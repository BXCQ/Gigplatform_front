<template>
  <view class="identity-switch" v-if="!isLogin">
    <button class="cu-btn round bg-blue shadow-warp" @tap="trigger">
      <text class="cuIcon-refresh"></text>
      <text class="text">{{ buttonText }}</text>
    </button>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      currentPage: '' // 存储当前页面路径
    }
  },
  computed: {
    ...mapState(['isLogin']),
    // 根据当前页面返回不同的按钮文本
    buttonText() {
      if (this.currentPage.includes('/pages/employer/index')) {
        return '切换到员工'
      } else if (this.currentPage.includes('/pages/mine/mine')) {
        return '切换到雇主'
      }
      return '切换身份' // 默认文本
    }
  },
  mounted() {
    // 获取当前页面路径
    const pages = getCurrentPages()
    if (pages.length) {
      this.currentPage = `/${pages[pages.length - 1].route}`
    }
  },
  methods: {
    trigger() {
      // 根据当前页面跳转到不同目标
      if (this.currentPage.includes('/pages/employer/index')) {
        uni.switchTab({
          url: '/pages/mine/mine' // 切换到零工首页
        })
      } else {
        uni.redirectTo({
          url: '/pages/employer/index' // 切换到雇主首页
        })
      }
    }
  }
}
</script>

<style lang="scss">
.identity-switch {
  position: fixed;
  right: 30rpx;
  bottom: 160rpx;
  z-index: 99;
  
  .cu-btn {
    padding: 20rpx 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #FFFFFF;
    transition: all 0.3s;
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
    
    &:active {
      transform: scale(0.95) translateY(4rpx);
      box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.15);
    }
    
    .cuIcon-refresh {
      margin-right: 10rpx;
      font-size: 32rpx;
    }
    
    .text {
      white-space: nowrap;
    }
  }
}
</style> 