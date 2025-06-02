<template>
  <view class="my-applications">
    <!-- 自定义导航栏 -->
    <cu-custom bgColor="bg-gradient-green " isBack>
      <block slot="content">我的申请</block>
    </cu-custom>
    
    <!-- 状态筛选 -->
    <view class="filter-bar">
      <view 
        v-for="(item, index) in statusFilters" 
        :key="index"
        :class="['filter-item', { active: currentStatus === item.value }]"
        @tap="changeStatus(item.value)"
      >
        {{ item.label }}
      </view>
    </view>
    
    <!-- 申请列表 -->
    <view class="application-list" v-if="applications.length > 0">
      <view 
        class="application-item"
        v-for="(item, index) in applications"
        :key="index"
      >
        <view class="job-info" @tap="viewJobDetail(item.jobId)">
          <view class="job-title">{{ item.extraProperties.jobTitle }}</view>
          <view class="job-meta">
            <text class="salary">¥{{ item.extraProperties.jobSalary }}/天</text>
            <text class="location">{{ item.extraProperties.jobLocation }}</text>
          </view>
          <view class="job-requirements" v-if="item.extraProperties.jobRequirements">
            <text class="label">要求：</text>
            <text class="content">{{ item.extraProperties.jobRequirements }}</text>
          </view>
        </view>
        
        <view class="employer-info">
          <view class="company-info">
            <text class="company">{{ item.extraProperties.employerCompany }}</text>
            <text class="employer">{{ item.extraProperties.employerName }}</text>
          </view>
          <view class="contact-info" v-if="item.status === 'accepted'">
            <text class="phone">{{ item.extraProperties.employerPhone }}</text>
          </view>
        </view>
        
        <view class="application-info">
          <view class="cover-letter" v-if="item.coverLetter">
            <text class="label">申请说明：</text>
            <text class="content">{{ item.coverLetter }}</text>
          </view>
          <view class="application-status">
            <text :class="['status-tag', getStatusClass(item.status)]">{{ getStatusText(item.status) }}</text>
            <text class="apply-time">{{ formatTime(item.createdAt) }}</text>
          </view>
        </view>
        
        <!-- 取消申请按钮 -->
        <view class="action-bar" v-if="item.status === 'pending'">
          <button class="cancel-btn" @tap="cancelApplication(item)">取消申请</button>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <image src="/static/img/empty.png" mode="aspectFit"></image>
      <text>暂无申请记录</text>
    </view>
    
    <!-- 加载更多 -->
    <view class="load-more" v-if="hasMore">
      <text v-if="isLoading">加载中...</text>
      <text v-else @tap="loadMore">加载更多</text>
    </view>
  </view>
</template>

<script>
import API from '@/api/index.js'

export default {
  data() {
    return {
      applications: [],
      currentPage: 1,
      pageSize: 10,
      hasMore: true,
      isLoading: false,
      currentStatus: '',
      statusFilters: [
        { label: '全部', value: '' },
        { label: '待处理', value: 'pending' },
        { label: '已接受', value: 'accepted' },
        { label: '已拒绝', value: 'rejected' },
        { label: '已取消', value: 'cancelled' }
      ]
    }
  },
  onLoad() {
    this.loadApplications()
  },
  onPullDownRefresh() {
    this.currentPage = 1
    this.loadApplications().then(() => {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    // 加载申请列表
    async loadApplications(isLoadMore = false) {
      if (this.isLoading) return
      
      this.isLoading = true
      try {
        const res = await API.getWorkerApplications({
          page: this.currentPage,
          size: this.pageSize,
          status: this.currentStatus
        })
        
        if (res.code === 0) {
          const { records, totalPage } = res.data
          
          if (isLoadMore) {
            this.applications = [...this.applications, ...records]
          } else {
            this.applications = records
          }
          
          this.hasMore = this.currentPage < totalPage
        } else {
          uni.showToast({
            title: res.message || '获取申请列表失败',
            icon: 'none'
          })
        }
      } catch (err) {
        console.error('获取申请列表失败', err)
        uni.showToast({
          title: '获取申请列表失败',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    // 取消申请
    async cancelApplication(item) {
      try {
        uni.showModal({
          title: '提示',
          content: '确定要取消该申请吗？',
          success: async (res) => {
            if (res.confirm) {
              const result = await API.cancelJobApplication(item.jobId, item.id)
              if (result.code === 0) {
                uni.showToast({
                  title: '取消成功',
                  icon: 'success'
                })
                // 刷新列表
                this.currentPage = 1
                this.loadApplications()
              } else {
                uni.showToast({
                  title: result.message || '取消失败',
                  icon: 'none'
                })
              }
            }
          }
        })
      } catch (err) {
        console.error('取消申请失败', err)
        uni.showToast({
          title: '取消申请失败',
          icon: 'none'
        })
      }
    },
    
    // 加载更多
    loadMore() {
      if (this.hasMore && !this.isLoading) {
        this.currentPage++
        this.loadApplications(true)
      }
    },
    
    // 切换状态
    changeStatus(status) {
      if (this.currentStatus === status) return
      this.currentStatus = status
      this.currentPage = 1
      this.loadApplications()
    },
    
    // 查看工作详情
    viewJobDetail(jobId) {
      uni.navigateTo({
        url: `/pages/jobDetail/jobDetail?id=${jobId}`
      })
    },
    
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'pending': '待处理',
        'accepted': '已接受',
        'rejected': '已拒绝',
        'cancelled': '已取消'
      }
      return statusMap[status] || status
    },
    
    // 获取状态样式
    getStatusClass(status) {
      const classMap = {
        'pending': 'status-pending',
        'accepted': 'status-accepted',
        'rejected': 'status-rejected',
        'cancelled': 'status-cancelled'
      }
      return classMap[status] || ''
    }
  }
}
</script>

<style lang="scss">
.my-applications {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 30rpx;
}

.filter-bar {
  display: flex;
  background-color: #FFFFFF;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  
  .filter-item {
    padding: 10rpx 30rpx;
    font-size: 28rpx;
    color: #666;
    border-radius: 30rpx;
    margin-right: 20rpx;
    
    &.active {
      background-color: #4CAF50;
      color: #FFFFFF;
    }
  }
}

.application-list {
  padding: 0 30rpx;
  
  .application-item {
    background-color: #FFFFFF;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .job-info {
      margin-bottom: 20rpx;
      
      .job-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
      }
      
      .job-meta {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        
        .salary {
          font-size: 28rpx;
          color: #FF5722;
          margin-right: 20rpx;
        }
        
        .location {
          font-size: 26rpx;
          color: #999;
        }
      }
      
      .job-requirements {
        font-size: 26rpx;
        color: #666;
        
        .label {
          color: #999;
          margin-right: 10rpx;
        }
      }
    }
    
    .employer-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      padding: 15rpx 0;
      border-top: 1rpx solid #F5F5F5;
      border-bottom: 1rpx solid #F5F5F5;
      
      .company-info {
        .company {
          font-size: 28rpx;
          color: #666;
          margin-right: 20rpx;
        }
        
        .employer {
          font-size: 26rpx;
          color: #999;
        }
      }
      
      .contact-info {
        .phone {
          font-size: 26rpx;
          color: #4CAF50;
        }
      }
    }
    
    .application-info {
      .cover-letter {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 15rpx;
        
        .label {
          color: #999;
          margin-right: 10rpx;
        }
      }
      
      .application-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .status-tag {
          padding: 4rpx 12rpx;
          border-radius: 20rpx;
          font-size: 24rpx;
          
          &.status-pending {
            background-color: #FFC107;
            color: #FFFFFF;
          }
          
          &.status-accepted {
            background-color: #4CAF50;
            color: #FFFFFF;
          }
          
          &.status-rejected {
            background-color: #F44336;
            color: #FFFFFF;
          }
          
          &.status-cancelled {
            background-color: #9E9E9E;
            color: #FFFFFF;
          }
        }
        
        .apply-time {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
    
    .action-bar {
      margin-top: 20rpx;
      padding-top: 20rpx;
      border-top: 1rpx solid #F5F5F5;
      display: flex;
      justify-content: flex-end;
      
      .cancel-btn {
        background-color: #F5F5F5;
        color: #666;
        font-size: 26rpx;
        padding: 10rpx 30rpx;
        border-radius: 30rpx;
        border: none;
        
        &:active {
          background-color: #EEEEEE;
        }
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
  
  image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
  }
  
  text {
    font-size: 28rpx;
    color: #999;
  }
}

.load-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 28rpx;
}
</style> 