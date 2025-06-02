<template>
  <view class="job-card" @tap="viewJobDetail">
    <view class="job-header">
      <view class="job-title-section">
        <text class="job-title">{{ job.title }}</text>
        <view class="job-tags" v-if="job.urgent || job.hotJob">
          <text class="tag urgent" v-if="job.urgent">急聘</text>
          <text class="tag hot" v-if="job.hotJob">热门</text>
        </view>
      </view>
      <text class="salary">{{ job.salary }}</text>
    </view>
    
    <view class="job-info">
      <view class="info-item">
        <text class="label">工作类型：</text>
        <text class="value">{{ job.jobType }}</text>
      </view>
      <view class="info-item">
        <text class="label">性别要求：</text>
        <text class="value">{{ job.gender }}</text>
      </view>
      <view class="info-item">
        <text class="label">工作地点：</text>
        <text class="value">{{ job.contact }}</text>
      </view>
      <view class="info-item">
        <text class="label">工作时间：</text>
        <text class="value">{{ job.startTime }} 至 {{ job.endTime }}</text>
      </view>
    </view>
    
    <view class="job-footer">
      <button class="apply-btn" @tap.stop="applyJob">申请接单</button>
    </view>
  </view>
</template>

<script>
import API from '@/api/index.js'

export default {
  name: 'JobCardCompact',
  props: {
    job: {
      type: Object,
      required: true
    }
  },
  methods: {
    viewJobDetail() {
      uni.navigateTo({
        url: `/pages/jobDetail/jobDetail?id=${this.job.id}`
      })
    },
    async applyJob() {
      try {
        // 检查是否登录
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.showModal({
            title: '提示',
            content: '请先登录后再申请职位',
            confirmText: '去登录',
            success: (res) => {
              if (res.confirm) {
                uni.navigateTo({
                  url: '/pages/login/login'
                })
              }
            }
          })
          return
        }

        // 确认申请
        const confirmRes = await new Promise((resolve) => {
          uni.showModal({
            title: '申请确认',
            content: `确定申请"${this.job.title}"职位吗？`,
            success: (res) => resolve(res)
          })
        })

        if (confirmRes.confirm) {
          // 显示加载中
          uni.showLoading({
            title: '申请中...'
          })

          // 调用申请接口
          const response = await API.applyForJob(this.job.id, {
            jobId: this.job.id,
            applyTime: new Date().toISOString()
          })

          if (response?.code === 0) {
            uni.showToast({
              title: '申请成功',
              icon: 'success'
            })
          } else {
            throw new Error(response?.message || '申请失败')
          }
        }
      } catch (error) {
        console.error('申请职位失败', error)
        uni.showToast({
          title: error.message || '申请失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    }
  }
}
</script>

<style lang="scss">
.job-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20rpx;
    
    .job-title-section {
      flex: 1;
      margin-right: 20rpx;

      .job-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
        margin-bottom: 8rpx;
        display: block;
      }

      .job-tags {
        display: flex;
        gap: 12rpx;

        .tag {
          font-size: 22rpx;
          padding: 4rpx 12rpx;
          border-radius: 8rpx;

          &.urgent {
            background-color: #FFF0F0;
            color: #FF4D4F;
          }

          &.hot {
            background-color: #FFF7E6;
            color: #FA8C16;
          }
        }
      }
    }
    
    .salary {
      font-size: 32rpx;
      font-weight: bold;
      color: #FF4D4F;
    }
  }
  
  .job-info {
    margin-bottom: 20rpx;

    .info-item {
      display: flex;
      margin-bottom: 12rpx;
      font-size: 26rpx;
      line-height: 1.5;

      .label {
        color: #666666;
        width: 140rpx;
        flex-shrink: 0;
  }
  
      .value {
        color: #333333;
        flex: 1;
      }
    }
  }

  .job-footer {
    display: flex;
    justify-content: flex-end;

    .apply-btn {
      background: linear-gradient(90deg, #6B7CFF, #8A5EFF);
      color: #FFFFFF;
      font-size: 28rpx;
      padding: 12rpx 32rpx;
      border-radius: 32rpx;
      border: none;
      line-height: 1.5;
    }
  }
}
</style> 