<template>
  <view class="login-container">
    <!-- 顶部导航栏 -->
    <view class="nav-back" @click="goBack">
      <uni-icons type="arrow-left" size="24" color="#333"></uni-icons>
    </view>
    
    <!-- 头部标题 -->
    <view class="header">
      <view class="logo">
        <image src="/static/img/logo.png" mode="aspectFit"></image>
      </view>
      <view class="title">智慧零工平台</view>
      <view class="sub-title">用技能创造价值，让工作更自由</view>
    </view>
    
    <!-- 登录表单 -->
    <view class="login-form">
      <!-- 切换登录方式 -->
      <view class="login-type">
        <view 
          class="type-item" 
          :class="{ active: loginType === 'password' }" 
          @click="switchLoginType('password')">
          账号密码登录
        </view>
        <view 
          class="type-item" 
          :class="{ active: loginType === 'code' }" 
          @click="switchLoginType('code')">
          验证码登录
        </view>
      </view>
      
      <!-- 账号密码登录 -->
      <view class="form-box" v-if="loginType === 'password'">
        <view class="input-item">
          <uni-icons type="person" size="22" color="#999"></uni-icons>
          <input 
            type="text" 
            v-model="formData.username" 
            placeholder="请输入手机号/用户名" 
            maxlength="11" />
        </view>
        <view class="input-item">
          <uni-icons type="locked" size="22" color="#999"></uni-icons>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="formData.password" 
            placeholder="请输入密码" 
            maxlength="20" />
          <view class="toggle-password" @click="showPassword = !showPassword">
            <uni-icons :type="showPassword ? 'eye-filled' : 'eye-slash'" size="22" color="#999"></uni-icons>
          </view>
        </view>
      </view>
      
      <!-- 验证码登录 -->
      <view class="form-box" v-else>
        <view class="input-item">
          <uni-icons type="phone" size="22" color="#999"></uni-icons>
          <input 
            type="number" 
            v-model="formData.phone" 
            placeholder="请输入手机号" 
            maxlength="11" />
        </view>
        <view class="input-item">
          <uni-icons type="chatboxes" size="22" color="#999"></uni-icons>
          <input 
            type="number" 
            v-model="formData.code" 
            placeholder="请输入验证码" 
            maxlength="6" />
          <view class="code-btn" :class="{ disabled: isCounting }" @click="sendCode">
            {{ codeText }}
          </view>
        </view>
      </view>
      
      <!-- 提交按钮 -->
      <button class="submit-btn" @click="handleLogin">登录</button>
      
      <!-- 操作选项 -->
      <view class="action-bar">
        <view class="forgot-pwd" @click="navigateTo('/pages/login/reset-password')">忘记密码?</view>
        <view class="register" @click="navigateTo('/pages/login/register')">立即注册</view>
      </view>
    </view>
    
    <!-- 其他登录方式 -->
    <view class="other-login">
      <view class="title">
        <view class="line"></view>
        <text>其他登录方式</text>
        <view class="line"></view>
      </view>
      <view class="icon-list">
        <view class="icon-item" @click="thirdPartyLogin('wechat')">
          <uni-icons type="weixin" size="30" color="#4CAF50"></uni-icons>
          <text>微信</text>
        </view>
        <view class="icon-item" @click="thirdPartyLogin('qq')">
          <uni-icons type="qq" size="30" color="#1296db"></uni-icons>
          <text>QQ</text>
        </view>
        <view class="icon-item" @click="thirdPartyLogin('weibo')">
          <uni-icons type="weibo" size="30" color="#e6162d"></uni-icons>
          <text>微博</text>
        </view>
      </view>
    </view>
    
    <!-- 底部协议 -->
    <view class="privacy-policy">
      <checkbox :checked="agreePolicy" @click="agreePolicy = !agreePolicy" color="#4CAF50" />
      <text class="policy-text">登录即表示同意</text>
      <text class="policy-link" @click="navigateTo('/pages/common/user-agreement')">《用户协议》</text>
      <text class="policy-text">和</text>
      <text class="policy-link" @click="navigateTo('/pages/common/privacy-policy')">《隐私政策》</text>
    </view>
  </view>
</template>

<script>
import api from '@/api/index.js'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      loginType: 'password', // 登录方式 password | code
      formData: {
        username: '', // 账号
        password: '', // 密码
        phone: '', // 手机号
        code: '' // 验证码
      },
      showPassword: false, // 是否显示密码
      codeText: '获取验证码', // 验证码按钮文本
      countdown: 60, // 倒计时秒数
      isCounting: false, // 是否正在倒计时
      agreePolicy: true // 是否同意协议
    }
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1
      })
    },
    // 切换登录方式
    switchLoginType(type) {
      this.loginType = type
    },
    // 发送验证码
    sendCode() {
      if (this.isCounting) return
      
      // 验证手机号
      const phoneReg = /^1[3-9]\d{9}$/
      if (!phoneReg.test(this.formData.phone)) {
        uni.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return
      }
      
      // 模拟发送验证码
      this.isCounting = true
      this.codeText = `${this.countdown}s`
      
      // 开始倒计时
      const timer = setInterval(() => {
        this.countdown--
        this.codeText = `${this.countdown}s`
        
        if (this.countdown <= 0) {
          clearInterval(timer)
          this.countdown = 60
          this.codeText = '获取验证码'
          this.isCounting = false
        }
      }, 1000)
      
      // 实际开发需调用后端接口
      /* 
      api.sendSmsCode({
        phone: this.formData.phone
      }).then(res => {
        if (res.code === 0) {
          uni.showToast({
            title: '验证码已发送',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: res.message || '发送失败',
            icon: 'none'
          })
          clearInterval(timer)
          this.countdown = 60
          this.codeText = '获取验证码'
          this.isCounting = false
        }
      }).catch(err => {
        uni.showToast({
          title: '发送失败，请稍后重试',
          icon: 'none'
        })
        clearInterval(timer)
        this.countdown = 60
        this.codeText = '获取验证码'
        this.isCounting = false
      })
      */
    },
    // 处理登录
    async handleLogin() {
      // 检查协议是否同意
      if (!this.agreePolicy) {
        uni.showToast({
          title: '请阅读并同意用户协议和隐私政策',
          icon: 'none'
        })
        return
      }
      
      // 表单验证
      if (this.loginType === 'password') {
        if (!this.formData.username) {
          uni.showToast({
            title: '请输入账号',
            icon: 'none'
          })
          return
        }
        if (!this.formData.password) {
          uni.showToast({
            title: '请输入密码',
            icon: 'none'
          })
          return
        }
      } else {
        const phoneReg = /^1[3-9]\d{9}$/
        if (!phoneReg.test(this.formData.phone)) {
          uni.showToast({
            title: '请输入正确的手机号码',
            icon: 'none'
          })
          return
        }
        if (!this.formData.code) {
          uni.showToast({
            title: '请输入验证码',
            icon: 'none'
          })
          return
        }
      }
      
      try {
        // 显示加载提示
        uni.showLoading({
          title: '登录中...'
        })
        
        // 调用登录接口
        const loginData = this.loginType === 'password' 
          ? {
              username: this.formData.username,
              password: this.formData.password
            }
          : {
              phone: this.formData.phone,
              code: this.formData.code
            }
        
        const res = await api.login(loginData)
        
        if (res.code === 0) {
          // 保存token
          uni.setStorageSync('token', res.data.token)
          
          // 保存用户信息
          this.setUserInfo(res.data.user)
          
          // 根据用户类型跳转到不同页面
          if (res.data.user.userType === 'employer') {
            // 雇主跳转到雇主中心
            uni.reLaunch({
              url: '/pages/employer/index'
            })
          } else if (res.data.user.userType === 'employee') {
            // 零工跳转到零工中心
            uni.reLaunch({
              url: '/pages/mine/mine'
            })
          } else {
            uni.showToast({
              title: '未知的用户类型',
              icon: 'none'
            })
          }
        } else {
          uni.showToast({
            title: res.message || '登录失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('登录失败:', error)
        uni.showToast({
          title: '登录失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    // 页面跳转
    navigateTo(url) {
      uni.navigateTo({
        url
      })
    },
    // 第三方登录
    thirdPartyLogin(type) {
      uni.showToast({
        title: `${type}登录功能开发中`,
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  padding: 0 60rpx;
  padding-top: var(--status-bar-height, 25px);
  background-color: #FFFFFF;
  position: relative;
  
  .nav-back {
    position: absolute;
    left: 30rpx;
    top: calc(var(--status-bar-height, 25px) + 20rpx);
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .header {
    padding-top: 100rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 80rpx;
    
    .logo {
      width: 160rpx;
      height: 160rpx;
      margin-bottom: 30rpx;
      
      image {
        width: 100%;
        height: 100%;
      }
    }
    
    .title {
      font-size: 40rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .sub-title {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .login-form {
    .login-type {
      display: flex;
      justify-content: center;
      margin-bottom: 50rpx;
      
      .type-item {
        font-size: 32rpx;
        color: #999;
        position: relative;
        padding: 0 30rpx;
        
        &.active {
          color: #333;
          font-weight: bold;
          
          &::after {
            content: '';
            position: absolute;
            bottom: -10rpx;
            left: 50%;
            transform: translateX(-50%);
            width: 60rpx;
            height: 6rpx;
            background-color: #4CAF50;
            border-radius: 3rpx;
          }
        }
      }
    }
    
    .form-box {
      .input-item {
        display: flex;
        align-items: center;
        height: 100rpx;
        border-bottom: 1rpx solid #EEEEEE;
        margin-bottom: 30rpx;
        
        uni-icons {
          margin-right: 20rpx;
        }
        
        input {
          flex: 1;
          font-size: 30rpx;
          color: #333;
        }
        
        .toggle-password, .code-btn {
          font-size: 28rpx;
          color: #4CAF50;
          text-align: center;
        }
        
        .code-btn {
          width: 180rpx;
          
          &.disabled {
            color: #999;
          }
        }
      }
    }
    
    .submit-btn {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      background: #4CAF50;
      color: #FFFFFF;
      font-size: 32rpx;
      border-radius: 45rpx;
      margin-top: 60rpx;
      margin-bottom: 30rpx;
    }
    
    .action-bar {
      display: flex;
      justify-content: space-between;
      font-size: 28rpx;
      
      .forgot-pwd {
        color: #999;
      }
      
      .register {
        color: #4CAF50;
      }
    }
  }
  
  .other-login {
    margin-top: 80rpx;
    
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 50rpx;
      
      .line {
        width: 100rpx;
        height: 1rpx;
        background-color: #EEEEEE;
      }
      
      text {
        font-size: 26rpx;
        color: #999;
        margin: 0 20rpx;
      }
    }
    
    .icon-list {
      display: flex;
      justify-content: space-around;
      
      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        text {
          font-size: 24rpx;
          color: #999;
          margin-top: 10rpx;
        }
      }
    }
  }
  
  .privacy-policy {
    position: fixed;
    bottom: 60rpx;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .policy-text {
      font-size: 24rpx;
      color: #999;
    }
    
    .policy-link {
      font-size: 24rpx;
      color: #4CAF50;
    }
  }
}
</style> 