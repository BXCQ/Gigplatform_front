<template>
  <view class="detail-container">
    <!-- 自定义导航栏 -->
    <view class="cu-custom">
      <view class="cu-bar fixed bg-white" style="height:90rpx;">
        <navigator class="action" open-type="navigateBack" delta="1">
          <text class="cuIcon-back"></text>
        </navigator>
        <view class="content">详情</view>
        <view class="action">
          <text class="cuIcon-more"></text>
        </view>
      </view>
    </view>
    
    <!-- 任务摘要 -->
    <view class="job-summary">
      <view class="job-time">{{jobDetail.timeRange}}</view>
      <view class="job-header">
        <view class="job-title">{{jobDetail.title}}</view>
        <view class="job-salary">{{jobDetail.salary}}</view>
      </view>
      <view class="job-tags">
        <view class="tag">招{{jobDetail.requiredCount}}人</view>
        <view class="tag">{{jobDetail.gender === 'female' ? '只要女性' : (jobDetail.gender === 'male' ? '只要男性' : '不限性别')}}</view>
        <view class="tag">{{jobDetail.jobType}}</view>
      </view>
    </view>
    
    <!-- 详细信息 -->
    <view class="job-details">
      <view class="section">
        <view class="section-title">工作时间</view>
        <view class="section-content">{{jobDetail.timeRange}}</view>
      </view>
      <view class="section">
        <view class="section-title">工作地址</view>
        <view class="section-content with-map">
          <view class="address">{{jobDetail.address}}</view>
          <view class="map-icon" @tap="openLocation">
            <text class="cuIcon-location"></text>
          </view>
        </view>
      </view>
      <view class="section">
        <view class="section-title">工作内容</view>
        <view class="section-content">{{jobDetail.content}}</view>
      </view>
    </view>
    
    <!-- 雇主信息 -->
    <view class="employer-info">
      <view class="section-title">雇主信息</view>
      <view class="employer-card">
        <image class="employer-avatar" :src="jobDetail.employerAvatar" mode="aspectFill"></image>
        <view class="employer-data">
          <view class="employer-name">{{jobDetail.employerName}}</view>
          <view class="employer-verify" v-if="jobDetail.isVerified">
            <text class="cuIcon-roundcheckfill text-blue"></text>
            <text>已认证</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部操作区 -->
    <view class="bottom-actions">
      <view class="action-btn collect" @tap="collect">
        <text class="cuIcon-favor"></text>
        <text>收藏</text>
      </view>
      <view class="action-btn share" @tap="share">
        <text class="cuIcon-share"></text>
        <text>分享</text>
      </view>
      <button class="apply-btn" @tap="applyJob">申请接单</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      jobDetail: {
        timeRange: '2025/05/09 00:00 - 2025/06/09 00:00',
        title: '车工（女）',
        salary: '6500元/月',
        requiredCount: 2,
        gender: 'female',
        jobType: '普工',
        address: '集根路356号',
        content: '1、女性，有相关缝纫经验均可，根据经验岗位平车、高车、电脑车工、台包等岗位工作。厦门维发服饰有限公司(智能制造)，联系电话: 18030027221',
        employerName: '厦门维发服饰有限公司',
        employerAvatar: '/static/img/default-avatar.png',
        isVerified: true
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      // 实际应用中应该获取岗位详情
      // this.getJobDetail()
    }
  },
  methods: {
    // 获取岗位详情
    getJobDetail() {
      // 这里应该调用API获取岗位详情数据
    },
    
    // 打开地图
    openLocation() {
      uni.showToast({
        title: '打开地图导航',
        icon: 'none'
      })
    },
    
    // 收藏
    collect() {
      uni.showToast({
        title: '已收藏',
        icon: 'success'
      })
    },
    
    // 分享
    share() {
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      })
    },
    
    // 申请接单
    applyJob() {
      uni.showModal({
        title: '申请确认',
        content: '确定申请这个岗位吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '申请成功',
              icon: 'success'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.detail-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
  padding-top: 90rpx;
  
  .job-summary {
    padding: 30rpx;
    background-color: #e7f1ff;
    border-radius: 0 0 30rpx 30rpx;
    
    .job-time {
      font-size: 24rpx;
      color: #666666;
      margin-bottom: 10rpx;
    }
    
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .job-title {
        font-size: 36rpx;
        font-weight: bold;
        color: #333333;
      }
      
      .job-salary {
        font-size: 32rpx;
        font-weight: bold;
        color: #FF9800;
      }
    }
    
    .job-tags {
      display: flex;
      flex-wrap: wrap;
      
      .tag {
        background-color: #FFFFFF;
        color: #4169E1;
        font-size: 24rpx;
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        margin-right: 16rpx;
        margin-bottom: 10rpx;
      }
    }
  }
  
  .job-details {
    margin: 20rpx;
    padding: 30rpx;
    background-color: #FFFFFF;
    border-radius: 20rpx;
    
    .section {
      margin-bottom: 30rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .section-title {
        font-size: 28rpx;
        color: #999999;
        margin-bottom: 15rpx;
      }
      
      .section-content {
        font-size: 28rpx;
        color: #333333;
        line-height: 1.5;
        
        &.with-map {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .address {
            flex: 1;
          }
          
          .map-icon {
            width: 60rpx;
            height: 60rpx;
            background-color: #e7f1ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 20rpx;
            
            .cuIcon-location {
              color: #4169E1;
              font-size: 32rpx;
            }
          }
        }
      }
    }
  }
  
  .employer-info {
    margin: 20rpx;
    padding: 30rpx;
    background-color: #FFFFFF;
    border-radius: 20rpx;
    
    .section-title {
      font-size: 28rpx;
      color: #999999;
      margin-bottom: 20rpx;
    }
    
    .employer-card {
      display: flex;
      align-items: center;
      
      .employer-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      
      .employer-data {
        flex: 1;
        
        .employer-name {
          font-size: 28rpx;
          font-weight: bold;
          color: #333333;
          margin-bottom: 10rpx;
        }
        
        .employer-verify {
          display: flex;
          align-items: center;
          
          .cuIcon-roundcheckfill {
            margin-right: 10rpx;
          }
          
          text {
            font-size: 24rpx;
            color: #4169E1;
          }
        }
      }
    }
  }
  
  .bottom-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100rpx;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .action-btn {
      width: 120rpx;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      text {
        font-size: 22rpx;
        color: #999999;
        margin-top: 8rpx;
      }
    }
    
    .apply-btn {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      background-color: #4169E1;
      color: #FFFFFF;
      font-size: 30rpx;
      border-radius: 40rpx;
      margin-left: 30rpx;
      text-align: center;
    }
  }
}
</style> 