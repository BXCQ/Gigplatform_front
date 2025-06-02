<template>
  <view class="custom-nav">
    <view class="nav-left" @click="goBack" v-if="showBack || canGoBack">
      <uni-icons type="back" size="18" color="#333333"></uni-icons>
    </view>
    <view class="nav-title">
      <view class="search-bar" v-if="isSearchBar">
        <view class="search-box">
          <uni-icons type="search" size="18" color="#999"></uni-icons>
          <input type="text" :placeholder="placeholder" @focus="onFocus" v-model="searchValue" />
        </view>
        <view class="location" @click="chooseLocation">
          <text>{{location}}</text>
          <uni-icons type="arrowdown" size="14" color="#4CAF50"></uni-icons>
        </view>
      </view>
      <text v-else>{{title}}</text>
    </view>
    <view class="nav-right">
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'custom-nav-bar',
  props: {
    title: {
      type: String,
      default: '厦门零工市场'
    },
    showBack: {
      type: Boolean,
      default: false
    },
    isSearchBar: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '搜索职位、企业'
    },
    alwaysShowBack: {
      type: Boolean,
      default: true // 设置为true，默认总是显示返回按钮
    }
  },
  data() {
    return {
      searchValue: '',
      canGoBack: false
    }
  },
  computed: {
    ...mapState({
      locationState: state => state.location
    }),
    location() {
      return this.locationState.district || '思明区'
    },
    shouldShowBack() {
      // 如果props设置显示back或检测到可返回，则显示返回按钮
      return this.showBack || (this.alwaysShowBack && this.canGoBack)
    }
  },
  created() {
    // 检查是否有历史页面可以返回
    this.checkCanGoBack()
  },
  methods: {
    checkCanGoBack() {
      const pages = getCurrentPages()
      this.canGoBack = pages.length > 1
    },
    goBack() {
      this.$emit('back')
      uni.navigateBack({
        delta: 1,
        fail: () => {
          // 如果返回失败(如没有上一页)，尝试跳到首页
          uni.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    },
    onFocus() {
      this.$emit('onFocus')
    },
    chooseLocation() {
      uni.showActionSheet({
        itemList: ['思明区', '湖里区', '集美区', '海沧区', '同安区', '翔安区'],
        success: (res) => {
          const district = ['思明区', '湖里区', '集美区', '海沧区', '同安区', '翔安区'][res.tapIndex]
          this.$store.commit('setLocation', {
            ...this.locationState,
            district: district
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.custom-nav {
  position: relative;
  display: flex;
  align-items: center;
  height: 90rpx;
  padding: 0 20rpx;
  background-color: #FFFFFF;
  box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.05);
  
  .nav-left {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .nav-title {
    flex: 1;
    text-align: center;
    color: #333333;
    font-size: 32rpx;
    font-weight: 500;
    
    .search-bar {
      display: flex;
      align-items: center;
      height: 60rpx;
      
      .search-box {
        flex: 1;
        height: 60rpx;
        display: flex;
        align-items: center;
        background-color: #F5F5F5;
        border-radius: 30rpx;
        padding: 0 20rpx;
        
        input {
          flex: 1;
          height: 100%;
          font-size: 28rpx;
          margin-left: 10rpx;
        }
      }
      
      .location {
        display: flex;
        align-items: center;
        margin-left: 20rpx;
        padding: 0 10rpx;
        height: 60rpx;
        background: #F5F5F5;
        border-radius: 30rpx;
        
        text {
          font-size: 26rpx;
          color: #4CAF50;
          margin-right: 6rpx;
        }
      }
    }
  }
  
  .nav-right {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style> 