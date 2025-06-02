<template>
  <view class="mine-container">
    <!-- 自定义导航栏 -->
    <nav-bar title="员工个人中心"></nav-bar>
    
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <image class="avatar" :src="userInfo && userInfo.avatar || '/static/img/default-avatar.png'" mode="aspectFill"></image>
        <view class="info">
          <view class="name">{{displayName}}</view>
          <view class="tag" v-if="certification">{{certification}}</view>
        </view>
        <view class="login-btn" v-if="!isLoggedIn" @click="login">登录/注册</view>
      </view>
      
      <!-- 钱包信息 -->
      <view class="wallet-info" v-if="isLoggedIn">
        <view class="wallet-item">
          <text class="amount">¥{{walletInfo.balance}}</text>
          <text class="label">余额</text>
        </view>
        <view class="divider"></view>
        <view class="wallet-item">
          <text class="amount">{{walletInfo.points}}</text>
          <text class="label">积分</text>
        </view>
        <view class="divider"></view>
        <view class="wallet-item">
          <text class="amount">¥{{walletInfo.income}}</text>
          <text class="label">总收入</text>
        </view>
      </view>
      
      <!-- 未登录提示 -->
      <view class="wallet-info not-login" v-else>
        <text class="login-tips">登录后查看您的资产信息</text>
      </view>
    </view>
    
    <!-- 统计卡片 -->
    <view class="stats-card" v-if="isLoggedIn">
      <view class="stat-item" @click="checkLogin('/pages/mine/myApplications')">
        <view class="count">{{statsInfo.applicationCount}}</view>
        <view class="label">我的申请</view>
      </view>
      <view class="stat-item" @click="checkLogin('/pages/mine/favorites')">
        <view class="count">{{statsInfo.favoriteCount}}</view>
        <view class="label">我的收藏</view>
      </view>
      <view class="stat-item" @click="checkLogin('/pages/mine/certification')">
        <view class="count">{{statsInfo.certificationCount}}</view>
        <view class="label">技能认证</view>
      </view>
    </view>
    
    <!-- 功能列表 -->
    <view class="menu-card">
      <view class="menu-group">
        <view class="menu-title">我的服务</view>
        <view class="menu-list">
          <view class="menu-item" @click="checkLogin('/pages/mine/myApplications')">
            <view class="icon">
              <uni-icons type="paperplane" size="22" color="#4CAF50"></uni-icons>
            </view>
            <view class="text">我的申请</view>
            <uni-icons type="right" size="16" color="#CCCCCC"></uni-icons>
          </view>
          <view class="menu-item" @click="checkLogin('/pages/mine/favorites')">
            <view class="icon">
              <uni-icons type="star" size="22" color="#FF9800"></uni-icons>
            </view>
            <view class="text">我的收藏</view>
            <uni-icons type="right" size="16" color="#CCCCCC"></uni-icons>
          </view>
          <view class="menu-item" @click="checkLogin('/pages/mine/certification')">
            <view class="icon">
              <uni-icons type="medal" size="22" color="#4CAF50"></uni-icons>
            </view>
            <view class="text">技能认证</view>
            <uni-icons type="right" size="16" color="#CCCCCC"></uni-icons>
          </view>
          <view class="menu-item" @click="checkLogin('/pages/mine/insurance')">
            <view class="icon">
              <uni-icons type="safety" size="22" color="#4CAF50"></uni-icons>
            </view>
            <view class="text">保险</view>
            <view class="badge" v-if="userInfo && userInfo.hasInsurance">已购买</view>
            <uni-icons type="right" size="16" color="#CCCCCC"></uni-icons>
          </view>
        </view>
      </view>
      
      <view class="menu-group">
        <view class="menu-title">培训服务</view>
        <view class="menu-list">
          <view class="menu-item" @click="checkLogin('/pages/training/training')">
            <view class="icon">
              <uni-icons type="videocam" size="22" color="#FF5722"></uni-icons>
            </view>
            <view class="text">在线培训</view>
            <view class="badge" v-if="userInfo && userInfo.hasNewCourse">NEW</view>
            <uni-icons type="right" size="16" color="#CCCCCC"></uni-icons>
          </view>
          <view class="menu-item" @click="checkLogin('/pages/mine/certificates')">
            <view class="icon">
              <uni-icons type="vip" size="22" color="#9C27B0"></uni-icons>
            </view>
            <view class="text">我的证书</view>
            <uni-icons type="right" size="16" color="#CCCCCC"></uni-icons>
          </view>
        </view>
      </view>
      
      <view class="menu-group">
        <view class="menu-title">其他</view>
        <view class="menu-list">
          <view class="menu-item" @click="navigateTo('/pages/mine/feedback')">
            <view class="icon">
              <uni-icons type="help" size="22" color="#607D8B"></uni-icons>
            </view>
            <view class="text">意见反馈</view>
            <uni-icons type="right" size="16" color="#CCCCCC"></uni-icons>
          </view>
          <view class="menu-item" @click="navigateTo('/pages/mine/settings')">
            <view class="icon">
              <uni-icons type="gear" size="22" color="#607D8B"></uni-icons>
            </view>
            <view class="text">设置</view>
            <uni-icons type="right" size="16" color="#CCCCCC"></uni-icons>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-btn" v-if="isLoggedIn" @click="handleLogout">退出登录</view>
    
    <!-- 身份切换按钮 -->
    <identity-switch v-if="!isLoggedIn"></identity-switch>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import IdentitySwitch from '@/components/identity-switch.vue'
import api from '@/api/index.js'

export default {
  components: {
    IdentitySwitch
  },
  data() {
    return {
      isLoggedIn: false
    }
  },
  computed: {
    ...mapState(['userType', 'userInfo']),
    // 计算用户显示名称
    displayName() {
      return this.isLoggedIn && this.userInfo ? this.userInfo.name : '未登录'
    },
    // 计算用户认证状态
    certification() {
      return this.isLoggedIn && this.userInfo ? this.userInfo.certification : ''
    },
    // 计算用户资产信息
    walletInfo() {
      if (!this.isLoggedIn || !this.userInfo) {
        return {
          balance: '0.00',
          points: '0',
          income: '0.00'
        }
      }
      return {
        balance: this.userInfo.balance || '0.00',
        points: this.userInfo.points || '0',
        income: this.userInfo.income || '0.00'
      }
    },
    // 计算统计数据
    statsInfo() {
      if (!this.isLoggedIn || !this.userInfo) {
        return {
          applicationCount: 0,
          favoriteCount: 0,
          certificationCount: 0
        }
      }
      return {
        applicationCount: this.userInfo.applicationCount || 0,
        favoriteCount: this.userInfo.favoriteCount || 0,
        certificationCount: this.userInfo.certificationCount || 0
      }
    }
  },
  onShow() {
    this.checkLoginStatus()
  },
  methods: {
    ...mapMutations(['setUserInfo', 'setUserType']),
    // 检查登录状态
    checkLoginStatus() {
      const token = uni.getStorageSync('token')
      this.isLoggedIn = !!token
      if (token) {
        this.getUserProfile()
      } else {
        this.setUserInfo(null)
        this.setUserType('')
      }
    },
    // 获取用户信息
    getUserProfile() {
      uni.showLoading({ title: '加载中' })
      
      const userType = uni.getStorageSync('userType')
      const apiCall = userType === 'employer' ? api.getEmployerProfile() : api.getWorkerProfile()
      
      apiCall.then(res => {
        if (res.code === 0) {
          this.setUserInfo(res.data)
        } else {
          uni.showToast({
            title: res.message || '获取用户信息失败',
            icon: 'none'
          })
        }
      }).catch(err => {
        console.error('获取用户信息失败', err)
        if (err.statusCode === 401) {
          this.handleLogout()
        } else {
          uni.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          })
        }
      }).finally(() => {
        uni.hideLoading()
      })
    },
    // 检查登录状态并跳转
    checkLogin(url) {
      if (this.isLoggedIn) {
        this.navigateTo(url)
      } else {
        uni.showModal({
          title: '提示',
          content: '请先登录',
          confirmText: '去登录',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              this.login()
            }
          }
        })
      }
    },
    // 退出登录
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('token')
            this.setUserInfo(null)
            this.setUserType('')
            this.isLoggedIn = false
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            })
          }
        }
      })
    },
    // 跳转到登录页
    login() {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    },
    // 页面跳转
    navigateTo(url) {
      uni.navigateTo({ url })
    },
    // 底部导航
    navTo(page) {
      const routes = {
        'index': '/pages/index/index',
        'task': '/pages/jobSearch/jobSearch',
        'message': '/pages/message/index',
        'my': '/pages/mine/mine'
      }
      
      if (routes[page] && page !== 'my') {
        uni.switchTab({
          url: routes[page]
        })
      }
    }
  }
}
</script>

<style lang="scss">
.mine-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
  
  .user-card {
    background: linear-gradient(to right, #4CAF50, #2E7D32);
    padding: 30rpx;
    border-radius: 0 0 20rpx 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    
    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      
      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        background-color: #FFFFFF;
        margin-right: 20rpx;
        border: 4rpx solid rgba(255, 255, 255, 0.5);
      }
      
      .info {
        flex: 1;
        
        .name {
          font-size: 34rpx;
          color: #FFFFFF;
          font-weight: bold;
          margin-bottom: 10rpx;
        }
        
        .tag {
          display: inline-block;
          font-size: 24rpx;
          color: #4CAF50;
          background-color: #FFFFFF;
          padding: 6rpx 20rpx;
          border-radius: 30rpx;
        }
      }
      
      .login-btn {
        padding: 10rpx 30rpx;
        background-color: rgba(255, 255, 255, 0.2);
        color: #FFFFFF;
        border-radius: 30rpx;
        font-size: 28rpx;
      }
    }
    
    .wallet-info {
      display: flex;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 16rpx;
      padding: 20rpx 0;
      
      &.not-login {
        justify-content: center;
        padding: 30rpx 0;
        
        .login-tips {
          color: rgba(255, 255, 255, 0.8);
          font-size: 28rpx;
        }
      }
      
      .wallet-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        .amount {
          font-size: 32rpx;
          color: #FFFFFF;
          font-weight: bold;
          margin-bottom: 8rpx;
        }
        
        .label {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.8);
        }
      }
      
      .divider {
        width: 1rpx;
        height: 50rpx;
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
  
  .stats-card {
    display: flex;
    background-color: #FFFFFF;
    border-radius: 16rpx;
    margin: -20rpx 20rpx 20rpx;
    padding: 30rpx 0;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 10;
    
    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .count {
        font-size: 36rpx;
        color: #333333;
        font-weight: bold;
        margin-bottom: 10rpx;
      }
      
      .label {
        font-size: 26rpx;
        color: #999999;
      }
    }
  }
  
  .menu-card {
    background-color: #FFFFFF;
    padding: 0 30rpx;
    
    .menu-group {
      padding: 30rpx 0;
      border-bottom: 1rpx solid #EEEEEE;
      
      &:last-child {
        border-bottom: none;
      }
      
      .menu-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
      }
      
      .menu-list {
        .menu-item {
          display: flex;
          align-items: center;
          padding: 24rpx 0;
          
          .icon {
            width: 44rpx;
            height: 44rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20rpx;
          }
          
          .text {
            flex: 1;
            font-size: 28rpx;
            color: #333;
          }
          
          .badge {
            font-size: 22rpx;
            color: #FFFFFF;
            background-color: #FF5722;
            padding: 4rpx 10rpx;
            border-radius: 20rpx;
            margin-right: 20rpx;
          }
        }
      }
    }
  }
  
  .logout-btn {
    margin: 40rpx 30rpx;
    background-color: #FFFFFF;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    border-radius: 45rpx;
    color: #FF5722;
    font-size: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  }
  
  .shadow-warp {
    position: relative;
    box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.05);
    border: 2rpx solid rgba(0, 0, 0, 0.03);
  }
}
</style> 