<template>
  <view class="job-card" @click="goToDetail">
    <view class="job-header">
      <view class="job-title">{{job.title}}</view>
      <view class="job-salary">{{job.salary}}</view>
    </view>
    <view class="job-info">
      <view class="job-tag" v-if="job.isUrgent">
        <uni-icons type="fire" size="12" color="#FF5722"></uni-icons>
        <text>急招</text>
      </view>
      <view class="job-tag" v-if="job.payType === 'daily'">
        <uni-icons type="wallet" size="12" color="#4CAF50"></uni-icons>
        <text>日结</text>
      </view>
      <view class="job-tag" v-if="job.hasInsurance">
        <uni-icons type="safety" size="12" color="#1976D2"></uni-icons>
        <text>益鹭保</text>
      </view>
    </view>
    <view class="job-company">
      <image class="company-logo" :src="job.companyLogo || '/static/default-logo.png'" mode="aspectFill"></image>
      <text class="company-name">{{job.companyName}}</text>
      <text class="job-distance">{{job.distance}}</text>
    </view>
    <view class="job-address">
      <uni-icons type="location" size="14" color="#999"></uni-icons>
      <text>{{job.address}}</text>
    </view>
    <view class="job-time">
      <uni-icons type="calendar" size="14" color="#999"></uni-icons>
      <text>{{job.workTime}}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'job-card',
  props: {
    job: {
      type: Object,
      default: () => ({
        id: '',
        title: '',
        salary: '',
        companyName: '',
        companyLogo: '',
        isUrgent: false,
        payType: '',
        hasInsurance: false,
        address: '',
        distance: '',
        workTime: ''
      })
    }
  },
  methods: {
    goToDetail() {
      uni.navigateTo({
        url: `/pages/jobDetail/jobDetail?id=${this.job.id}`
      })
    }
  }
}
</script>

<style lang="scss">
.job-card {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
  
  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
    
    .job-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .job-salary {
      font-size: 32rpx;
      font-weight: bold;
      color: #FF5722;
    }
  }
  
  .job-info {
    display: flex;
    margin-bottom: 16rpx;
    
    .job-tag {
      display: flex;
      align-items: center;
      background-color: #F5F5F5;
      border-radius: 6rpx;
      padding: 4rpx 12rpx;
      margin-right: 12rpx;
      
      text {
        font-size: 24rpx;
        color: #666;
        margin-left: 6rpx;
      }
    }
  }
  
  .job-company {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    
    .company-logo {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      margin-right: 10rpx;
    }
    
    .company-name {
      font-size: 28rpx;
      color: #666;
      flex: 1;
    }
    
    .job-distance {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .job-address, .job-time {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #999;
    margin-top: 10rpx;
    
    text {
      margin-left: 10rpx;
    }
  }
}
</style> 