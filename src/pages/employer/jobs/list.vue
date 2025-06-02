<template>
  <view class="job-list-container">
    <!-- 自定义导航栏 -->
    <cu-custom bgColor="bg-gradient-green " isBack>
      <block slot="content">我的招聘</block>
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
    
    <!-- 职位列表 -->
    <view class="job-list" v-if="jobs.length > 0">
      <view 
        class="job-card"
        v-for="(job, index) in jobs"
        :key="index"
        @click="viewJobDetail(job.id)"
      >
        <view class="job-header">
          <view class="job-title">{{ job.title }}</view>
          <view :class="['status-tag', getStatusClass(job.status)]">
            {{ getStatusText(job.status) }}
          </view>
        </view>
        
        <view class="job-meta">
          <view class="meta-item">
            <uni-icons type="money" size="16" color="#FF5722"></uni-icons>
            <text class="salary">¥{{ job.salary }}/天</text>
          </view>
          <view class="meta-item">
            <uni-icons type="location" size="16" color="#666"></uni-icons>
            <text>{{ job.location }}</text>
          </view>
          <view class="meta-item">
            <uni-icons type="person" size="16" color="#666"></uni-icons>
            <text>{{ job.applicants }}人申请</text>
          </view>
        </view>
        
        <view class="job-info">
          <view class="info-item" v-if="job.requirements">
            <text class="label">要求：</text>
            <text class="content">{{ job.requirements }}</text>
          </view>
          <view class="info-item">
            <text class="label">发布时间：</text>
            <text class="content">{{ formatTime(job.createdAt) }}</text>
          </view>
        </view>
        
        <view class="action-bar">
          <button 
            class="action-btn edit" 
            v-if="job.status === 'pending' || job.status === 'recruiting'"
            @click.stop="editJob(job.id)"
          >
            编辑
          </button>
          <button 
            class="action-btn applicants" 
            @click.stop="viewApplicants(job.id)"
          >
            查看申请人
          </button>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <image src="/static/img/empty-job.png" mode="aspectFit"></image>
      <text>暂无发布职位</text>
      <button class="publish-btn" @click="publishJob">发布职位</button>
    </view>
    
    <!-- 加载更多 -->
    <view class="load-more" v-if="hasMore">
      <text v-if="isLoading">加载中...</text>
      <text v-else @tap="loadMore">加载更多</text>
    </view>
    
    <!-- 底部发布按钮 -->
    <view class="publish-fab" @click="publishJob">
      <uni-icons type="plus" size="24" color="#FFF"></uni-icons>
      <text>发布职位</text>
    </view>
  </view>
</template>

<script>
import api from '@/api/index.js'

export default {
  data() {
    return {
      jobs: [],
      currentPage: 1,
      pageSize: 10,
      hasMore: true,
      isLoading: false,
      currentStatus: '',
      statusFilters: [
        { label: '全部', value: '' },
        { label: '审核中', value: 'pending' },
        { label: '招聘中', value: 'recruiting' },
        { label: '待面试', value: 'interviewing' },
        { label: '已完成', value: 'completed' }
      ]
    }
  },
  onLoad() {
    this.loadJobs()
  },
  onPullDownRefresh() {
    this.currentPage = 1
    this.loadJobs().then(() => {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    // 加载职位列表
    async loadJobs(isLoadMore = false) {
      if (this.isLoading) return
      
      this.isLoading = true
      try {
        const res = await api.getEmployerJobs({
          page: this.currentPage,
          size: this.pageSize,
          status: this.currentStatus
        })
        
        if (res.code === 0) {
          const { records, totalPage } = res.data
          
          if (isLoadMore) {
            this.jobs = [...this.jobs, ...records]
          } else {
            this.jobs = records
          }
          
          this.hasMore = this.currentPage < totalPage
        } else {
          uni.showToast({
            title: res.message || '获取职位列表失败',
            icon: 'none'
          })
        }
      } catch (err) {
        console.error('获取职位列表失败', err)
        uni.showToast({
          title: '获取职位列表失败',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    // 切换状态
    changeStatus(status) {
      if (this.currentStatus === status) return
      this.currentStatus = status
      this.currentPage = 1
      this.loadJobs()
    },
    
    // 查看职位详情
    viewJobDetail(jobId) {
      uni.navigateTo({
        url: `/pages/employer/jobs/detail?id=${jobId}`
      })
    },
    
    // 编辑职位
    editJob(jobId) {
      uni.navigateTo({
        url: `/pages/employer/jobs/edit?id=${jobId}`
      })
    },
    
    // 查看申请人
    viewApplicants(jobId) {
      uni.navigateTo({
        url: `/pages/employer/applicants/list?jobId=${jobId}`
      })
    },
    
    // 发布职位
    publishJob() {
      uni.navigateTo({
        url: '/pages/employer/jobs/create'
      })
    },
    
    // 加载更多
    loadMore() {
      if (this.hasMore && !this.isLoading) {
        this.currentPage++
        this.loadJobs(true)
      }
    },
    
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'pending': '审核中',
        'recruiting': '招聘中',
        'interviewing': '待面试',
        'completed': '已完成',
        'closed': '已关闭'
      }
      return statusMap[status] || status
    },
    
    // 获取状态样式
    getStatusClass(status) {
      const classMap = {
        'pending': 'status-pending',
        'recruiting': 'status-recruiting',
        'interviewing': 'status-interviewing',
        'completed': 'status-completed',
        'closed': 'status-closed'
      }
      return classMap[status] || ''
    }
  }
}
</script>

<style lang="scss">
.job-list-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 100rpx;
}

.filter-bar {
  display: flex;
  background-color: #FFFFFF;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  white-space: nowrap;
  overflow-x: auto;
  
  .filter-item {
    padding: 10rpx 30rpx;
    font-size: 28rpx;
    color: #666;
    border-radius: 30rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
    
    &.active {
      background-color: #4CAF50;
      color: #FFFFFF;
    }
  }
}

.job-list {
  padding: 0 30rpx;
  
  .job-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .job-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        flex: 1;
      }
      
      .status-tag {
        padding: 6rpx 20rpx;
        border-radius: 30rpx;
        font-size: 24rpx;
        flex-shrink: 0;
        margin-left: 20rpx;
        
        &.status-pending {
          background-color: #FFF3E0;
          color: #FF9800;
        }
        
        &.status-recruiting {
          background-color: #E8F5E9;
          color: #4CAF50;
        }
        
        &.status-interviewing {
          background-color: #F3E5F5;
          color: #9C27B0;
        }
        
        &.status-completed {
          background-color: #E0F2F1;
          color: #009688;
        }
        
        &.status-closed {
          background-color: #F5F5F5;
          color: #9E9E9E;
        }
      }
    }
    
    .job-meta {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20rpx;
      
      .meta-item {
        display: flex;
        align-items: center;
        margin-right: 30rpx;
        margin-bottom: 10rpx;
        font-size: 26rpx;
        color: #666;
        
        .salary {
          color: #FF5722;
          font-weight: bold;
        }
        
        uni-icons {
          margin-right: 8rpx;
        }
      }
    }
    
    .job-info {
      border-top: 1rpx solid #F5F5F5;
      padding-top: 20rpx;
      
      .info-item {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 10rpx;
        
        .label {
          color: #999;
          margin-right: 10rpx;
        }
      }
    }
    
    .action-bar {
      display: flex;
      justify-content: flex-end;
      margin-top: 20rpx;
      padding-top: 20rpx;
      border-top: 1rpx solid #F5F5F5;
      
      .action-btn {
        font-size: 26rpx;
        padding: 8rpx 20rpx;
        border-radius: 30rpx;
        margin-left: 20rpx;
        border: none;
        background-color: #F5F5F5;
        color: #666;
        
        &.edit {
          background-color: #FFF3E0;
          color: #FF9800;
        }
        
        &.applicants {
          background-color: #E3F2FD;
          color: #2196F3;
        }
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 30rpx;
  
  image {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 30rpx;
  }
  
  text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }
  
  .publish-btn {
    background: linear-gradient(to right, #8BC34A, #4CAF50);
    color: white;
    border-radius: 50rpx;
    width: 70%;
    font-size: 30rpx;
    height: 80rpx;
    line-height: 80rpx;
  }
}

.load-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 28rpx;
}

.publish-fab {
  position: fixed;
  right: 40rpx;
  bottom: 150rpx;
  background: linear-gradient(to right, #8BC34A, #4CAF50);
  color: white;
  border-radius: 50rpx;
  padding: 16rpx 30rpx;
  box-shadow: 0 6rpx 16rpx rgba(76, 175, 80, 0.3);
  display: flex;
  align-items: center;
  z-index: 100;
  
  text {
    margin-left: 8rpx;
    font-size: 28rpx;
  }
}
</style>