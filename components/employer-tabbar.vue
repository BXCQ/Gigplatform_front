<template>
  <view class="employer-tabbar">
    <view class="tabbar-item" :class="{active: currentTab === 'resume'}" @click="switchTab('resume')">
      <image :src="getTabIcon('resume')" mode="aspectFit"></image>
      <text>求职简历</text>
    </view>
    <view class="tabbar-item" :class="{active: currentTab === 'publish'}" @click="switchTab('publish')">
      <image :src="getTabIcon('publish')" mode="aspectFit"></image>
      <text>发布职位</text>
    </view>
    <view class="tabbar-item" :class="{active: currentTab === 'my'}" @click="switchTab('my')">
      <image :src="getTabIcon('my')" mode="aspectFit"></image>
      <text>我的</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'employer-tabbar',
  props: {
    currentTab: {
      type: String,
      default: 'resume'
    }
  },
  methods: {
    getTabIcon(tabName) {
      const iconMap = {
        resume: this.currentTab === 'resume' ? '/static/img/tabbar/employer/resume-active.png' : '/static/img/tabbar/employer/resume.png',
        publish: this.currentTab === 'publish' ? '/static/img/tabbar/employer/publish-active.png' : '/static/img/tabbar/employer/publish.png',
        my: this.currentTab === 'my' ? '/static/img/tabbar/meactive.png' : '/static/img/tabbar/me.png'
      }
      return iconMap[tabName]
    },
    switchTab(tab) {
      if (tab === this.currentTab) return
      
      const urlMap = {
        resume: '/pages/employer/resume/index',
        publish: '/pages/employer/jobPost',
        my: '/pages/employer/index'
      }
      
      uni.reLaunch({
        url: urlMap[tab]
      })
    }
  }
}
</script>

<style lang="scss">
.employer-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx 0 rgba(0, 0, 0, 0.05);
  z-index: 999;
  
  .tabbar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    
    image {
      width: 24px;
      height: 24px;
      margin-bottom: 4rpx;
    }
    
    text {
      font-size: 10px;
      color: #8F8F94;
    }
    
    &.active {
      text {
        color: #4CAF50;
      }
    }
  }
}
</style> 