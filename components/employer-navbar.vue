<template>
  <view class="employer-navbar">
    <view class="navbar-content">
      <view class="left-area" @tap="goBack">
        <text class="cuIcon-back"></text>
      </view>
      <view class="center-area">
        <text class="title">{{title}}</text>
      </view>
      <view class="right-area">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'EmployerNavbar',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    goBack() {
      // 获取当前页面路径
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentPath = currentPage.route;
      
      // 如果当前不是简历首页，则返回简历首页
      if (currentPath !== 'pages/employer/resume/index') {
        uni.redirectTo({
          url: '/pages/employer/resume/index'
        });
      } else {
        // 如果已经在简历首页，则返回上一页
        uni.navigateBack();
      }
    }
  }
}
</script>

<style lang="scss">
.employer-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90rpx;
  background-color: #8BC34A;
  z-index: 999;
  
  .navbar-content {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    
    .left-area {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .cuIcon-back {
        font-size: 40rpx;
        color: #FFFFFF;
      }
    }
    
    .center-area {
      flex: 1;
      text-align: center;
      
      .title {
        font-size: 32rpx;
        color: #FFFFFF;
        font-weight: bold;
      }
    }
    
    .right-area {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style> 