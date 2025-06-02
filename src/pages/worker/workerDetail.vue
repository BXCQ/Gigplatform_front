<template>
  <view class="worker-detail-container">
    <!-- 自定义导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @tap="goBack">
        <text class="cuIcon-back"></text>
      </view>
      <view class="nav-title">零工详情</view>
      <view class="nav-right"></view>
    </view>
    
    <!-- 工人基本信息 -->
    <view class="worker-card">
      <view class="worker-header">
        <image class="worker-avatar" :src="workerInfo.avatar || '/static/img/default-avatar.png'" mode="aspectFill"></image>
        <view class="worker-info">
          <view class="worker-name">{{workerInfo.name}}</view>
          <view class="worker-basic">{{workerInfo.gender}} · {{workerInfo.age}}岁 · {{workerInfo.education}}</view>
        </view>
        <view class="verification-badge" v-if="workerInfo.isVerified">
          <text class="cuIcon-check"></text>
          <text>已认证</text>
        </view>
      </view>
      
      <!-- 联系方式按钮 -->
      <view class="contact-btn" @tap="contactWorker">联系TA</view>
    </view>
    
    <!-- 工人详细信息 -->
    <view class="info-section">
      <view class="section-title">工作区域</view>
      <view class="section-content">{{workerInfo.workArea}}</view>
    </view>
    
    <view class="info-section">
      <view class="section-title">从事工种</view>
      <view class="section-content">{{workerInfo.jobTypes}}</view>
    </view>
    
    <view class="info-section">
      <view class="section-title">最近活跃</view>
      <view class="section-content">{{workerInfo.lastActive}}</view>
    </view>
    
    <view class="info-section" v-if="workerInfo.description">
      <view class="section-title">个人简介</view>
      <view class="section-content">{{workerInfo.description}}</view>
    </view>
    
    <!-- 历史评价 -->
    <view class="info-section">
      <view class="section-title">历史评价</view>
      <view class="section-content" v-if="workerInfo.reviews && workerInfo.reviews.length > 0">
        <view class="review-item" v-for="(review, index) in workerInfo.reviews" :key="index">
          <view class="review-header">
            <image class="reviewer-avatar" :src="review.employerAvatar" mode="aspectFill"></image>
            <view class="reviewer-info">
              <view class="reviewer-name">{{review.employerName}}</view>
              <view class="review-date">{{review.date}}</view>
            </view>
            <view class="review-rating">
              <text class="cuIcon-favorfill text-yellow" v-for="n in review.rating" :key="n"></text>
            </view>
          </view>
          <view class="review-content">{{review.content}}</view>
        </view>
      </view>
      <view class="empty-reviews" v-else>
        <text>暂无评价记录</text>
      </view>
    </view>
    
    <!-- 底部操作区 -->
    <view class="bottom-actions">
      <view class="action collect" @tap="toggleCollect">
        <text class="cuIcon-favor" :class="{'text-red': isCollected}"></text>
        <text>收藏</text>
      </view>
      <view class="action share" @tap="shareProfile">
        <text class="cuIcon-share"></text>
        <text>分享</text>
      </view>
      <button class="recommend-btn" @tap="recommendJob">推荐工作</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      isCollected: false,
      workerInfo: {
        id: '',
        name: '张*海',
        avatar: '/static/img/default-avatar.png',
        gender: '男',
        age: 46,
        education: '学历未知',
        isVerified: true,
        contact: '13800138000',
        workArea: '福建省 厦门市 思明区',
        jobTypes: '家政保洁',
        lastActive: '2小时前',
        description: '今年48岁，来厦门29年，带女儿上幼儿园...',
        reviews: [
          {
            employerName: '陈先生',
            employerAvatar: '/static/img/default-avatar.png',
            rating: 5,
            date: '2025/03/15',
            content: '工作认真负责，服务态度很好，按时完成任务，值得信赖。'
          },
          {
            employerName: '李女士',
            employerAvatar: '/static/img/default-avatar.png',
            rating: 4,
            date: '2025/02/20',
            content: '保洁工作做得很细致，下次还会继续雇佣。'
          }
        ]
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      // 根据ID获取工人信息
      // this.getWorkerInfo(this.id)
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    contactWorker() {
      uni.makePhoneCall({
        phoneNumber: this.workerInfo.contact,
        success: () => {
          console.log('拨打电话成功')
        },
        fail: () => {
          console.log('拨打电话失败')
        }
      })
    },
    
    toggleCollect() {
      this.isCollected = !this.isCollected
      uni.showToast({
        title: this.isCollected ? '已收藏' : '已取消收藏',
        icon: 'none'
      })
    },
    
    shareProfile() {
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        title: `${this.workerInfo.name}的个人简历`,
        summary: `${this.workerInfo.gender}, ${this.workerInfo.age}岁, 从事: ${this.workerInfo.jobTypes}`,
        success: function() {
          console.log('分享成功')
        },
        fail: function() {
          console.log('分享失败')
        }
      })
    },
    
    recommendJob() {
      uni.navigateTo({
        url: `/pages/employer/recommendJob?workerId=${this.id}`
      })
    }
  }
}
</script>

<style lang="scss">
.worker-detail-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 90rpx;
  padding: 0 30rpx;
  background-color: #FFFFFF;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .nav-left {
    font-size: 40rpx;
  }
  
  .nav-title {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .nav-right {
    width: 40rpx;
  }
}

.worker-card {
  background-color: #FFFFFF;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .worker-header {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .worker-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
    
    .worker-info {
      flex: 1;
      
      .worker-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
      }
      
      .worker-basic {
        font-size: 26rpx;
        color: #666;
      }
    }
    
    .verification-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .cuIcon-check {
        font-size: 40rpx;
        color: #4CAF50;
      }
      
      text {
        font-size: 22rpx;
        color: #4CAF50;
      }
    }
  }
  
  .contact-btn {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: #4C68FF;
    color: #FFFFFF;
    font-size: 30rpx;
    border-radius: 40rpx;
  }
}

.info-section {
  background-color: #FFFFFF;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .section-content {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }
  
  .review-item {
    border-bottom: 1rpx solid #EEEEEE;
    padding-bottom: 20rpx;
    margin-bottom: 20rpx;
    
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .review-header {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;
      
      .reviewer-avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        margin-right: 15rpx;
      }
      
      .reviewer-info {
        flex: 1;
        
        .reviewer-name {
          font-size: 28rpx;
          color: #333;
        }
        
        .review-date {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .review-rating {
        font-size: 28rpx;
      }
    }
    
    .review-content {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
  }
  
  .empty-reviews {
    text-align: center;
    padding: 40rpx 0;
    color: #999;
    font-size: 28rpx;
  }
}

.bottom-actions {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100rpx;
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .action {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100rpx;
    font-size: 24rpx;
    color: #999;
    
    .cuIcon-favor, .cuIcon-share {
      font-size: 40rpx;
      margin-bottom: 5rpx;
      
      &.text-red {
        color: #FF5722;
      }
    }
  }
  
  .recommend-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #4C68FF;
    color: #FFFFFF;
    font-size: 32rpx;
    border-radius: 40rpx;
    margin-left: 30rpx;
  }
}
</style> 