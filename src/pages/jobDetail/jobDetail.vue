<template>
  <view class="job-detail">
    <!-- 自定义导航栏 -->
    <cu-custom bgColor="bg-gradient-green">
      <block slot="content">工作详情</block>
    </cu-custom>
    
    <!-- 工作信息 -->
    <view class="job-info" v-if="jobDetail">
      <view class="job-header">
        <view class="job-title">{{ jobDetail.title }}</view>
        <view class="job-tags">
          <text class="tag urgent" v-if="jobDetail.urgent === 'yes'">急聘</text>
          <text class="tag hot" v-if="jobDetail.hotJob === 'yes'">热门</text>
        </view>
      </view>
      
      <view class="salary-info">
        <text class="salary">¥{{ jobDetail.salary }}/天</text>
      </view>
      
      <view class="info-section">
        <view class="info-item">
          <text class="label">工作地点</text>
          <text class="value">{{ jobDetail.location }}</text>
        </view>
        <view class="info-item">
          <text class="label">工作要求</text>
          <text class="value">{{ jobDetail.requirements }}</text>
        </view>
        <view class="info-item">
          <text class="label">工作类型</text>
          <text class="value">{{ jobDetail.category ? jobDetail.category.name : '未分类' }}</text>
        </view>
        <view class="info-item">
          <text class="label">发布时间</text>
          <text class="value">{{ formatTime(jobDetail.createdAt) }}</text>
        </view>
      </view>
      
      <view class="description-section">
        <view class="section-title">工作描述</view>
        <view class="description-content">{{ jobDetail.description }}</view>
      </view>
      
      <!-- 雇主信息 -->
      <view class="employer-section">
        <view class="section-title">雇主信息</view>
        <view class="employer-info">
          <image class="avatar" :src="jobDetail.employer ? jobDetail.employer.avatar : '/static/img/default-avatar.png'" mode="aspectFill"></image>
          <view class="employer-detail">
            <view class="employer-name">{{ jobDetail.employer ? jobDetail.employer.username : '雇主' }}</view>
            <view class="company-name">{{ jobDetail.employer ? jobDetail.employer.companyName : '未设置公司名称' }}</view>
            <view class="company-address">{{ jobDetail.employer ? jobDetail.employer.address : '未设置地址' }}</view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 加载中 -->
    <view class="loading" v-if="isLoading">
      <text>加载中...</text>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-bar" v-if="jobDetail">
      <button class="contact-btn" @tap="contactEmployer">联系雇主</button>
      <button class="apply-btn" @tap="applyJob" v-if="canApply">申请工作</button>
      <button class="applied-btn" disabled v-else>已申请</button>
    </view>
  </view>
</template>

<script>
import API from '@/api/index.js'

export default {
  data() {
    return {
      jobId: null,
      jobDetail: null,
      isLoading: true,
      canApply: true
    }
  },
  onLoad(options) {
    if (options.id) {
      this.jobId = options.id
      this.fetchJobDetail()
    }
  },
  methods: {
    // 获取工作详情
    async fetchJobDetail() {
      try {
        const res = await API.getJobDetail(this.jobId)
        if (res.code === 0) {
          this.jobDetail = res.data
          // 检查是否已申请
          this.checkApplicationStatus()
        } else {
          uni.showToast({
            title: res.message || '获取工作详情失败',
            icon: 'none'
          })
        }
      } catch (err) {
        console.error('获取工作详情失败', err)
        uni.showToast({
          title: '获取工作详情失败',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    // 检查申请状态
    async checkApplicationStatus() {
      try {
        const res = await API.checkJobApplication(this.jobId)
        if (res.code === 0) {
          this.canApply = !res.data.hasApplied
        }
      } catch (err) {
        console.error('检查申请状态失败', err)
      }
    },
    
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`
    },
    
    // 联系雇主
    contactEmployer() {
      if (!this.jobDetail || !this.jobDetail.employer || !this.jobDetail.employer.phone) {
        uni.showToast({
          title: '雇主未设置联系方式',
          icon: 'none'
        })
        return
      }
      
      uni.makePhoneCall({
        phoneNumber: this.jobDetail.employer.phone
      })
    },
    
    // 申请工作
    async applyJob() {
      if (!this.canApply) return
      
      try {
        const res = await API.applyForJob(this.jobId, {
          message: '我想申请这份工作'
        })
        
        if (res.code === 0) {
          uni.showToast({
            title: '申请成功',
            icon: 'success'
          })
          this.canApply = false
        } else {
          uni.showToast({
            title: res.message || '申请失败',
            icon: 'none'
          })
        }
      } catch (err) {
        console.error('申请工作失败', err)
        uni.showToast({
          title: '申请失败',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style lang="scss">
.job-detail {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

.job-info {
  background-color: #FFFFFF;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
  
  .job-title {
    flex: 1;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  .job-tags {
    display: flex;
    
    .tag {
      padding: 4rpx 12rpx;
      border-radius: 20rpx;
      font-size: 22rpx;
      margin-left: 10rpx;
      
      &.urgent {
        background-color: #FF5722;
        color: #FFFFFF;
      }
      
      &.hot {
        background-color: #FF9800;
        color: #FFFFFF;
      }
    }
  }
}

.salary-info {
  margin-bottom: 30rpx;
  
  .salary {
    font-size: 40rpx;
    font-weight: bold;
    color: #FF5722;
  }
}

.info-section {
  margin-bottom: 30rpx;
  
  .info-item {
    display: flex;
    margin-bottom: 20rpx;
    
    .label {
      width: 140rpx;
      font-size: 28rpx;
      color: #999;
    }
    
    .value {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }
  }
}

.description-section {
  margin-bottom: 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .description-content {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }
}

.employer-section {
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .employer-info {
    display: flex;
    align-items: center;
    
    .avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
    
    .employer-detail {
      flex: 1;
      
      .employer-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
      }
      
      .company-name {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 10rpx;
      }
      
      .company-address {
        font-size: 26rpx;
        color: #999;
      }
    }
  }
}

.loading {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 28rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  button {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 40rpx;
    font-size: 28rpx;
    margin: 0 10rpx;
    
    &.contact-btn {
      background-color: #F5F5F5;
      color: #666;
    }
    
    &.apply-btn {
      background-color: #4CAF50;
      color: #FFFFFF;
    }
    
    &.applied-btn {
      background-color: #CCCCCC;
      color: #FFFFFF;
    }
  }
}
</style>