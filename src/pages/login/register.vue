<template>
  <view class="register-container">
    <!-- 顶部导航栏 -->
    <view class="nav-back" @click="goBack">
      <uni-icons type="arrow-left" size="24" color="#333"></uni-icons>
    </view>
    
    <!-- 顶部标题 -->
    <view class="header">
      <view class="title">注册账号</view>
      <view class="sub-title">填写以下信息完成注册</view>
    </view>
    
    <!-- 步骤指示器 -->
    <view class="step-box">
      <view class="step-line">
        <view class="line"></view>
        <view class="active-line" :style="{ width: `${(currentStep-1)/2*100}%` }"></view>
      </view>
      <view class="step-items">
        <view class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <view class="step-number">1</view>
          <view class="step-text">手机验证</view>
        </view>
        <view class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <view class="step-number">2</view>
          <view class="step-text">设置账号</view>
        </view>
        <view class="step-item" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
          <view class="step-number">3</view>
          <view class="step-text">完成注册</view>
        </view>
      </view>
    </view>
    
    <!-- 步骤一：手机验证 -->
    <view class="form-box" v-if="currentStep === 1">
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
      <button class="submit-btn" @click="verifyPhone">下一步</button>
    </view>
    
    <!-- 步骤二：设置账号 -->
    <view class="form-box" v-if="currentStep === 2">
      <view class="input-item">
        <uni-icons type="person" size="22" color="#999"></uni-icons>
        <input 
          type="text" 
          v-model="formData.username" 
          placeholder="请输入昵称" 
          maxlength="20" />
      </view>
      <view class="input-item">
        <uni-icons type="locked" size="22" color="#999"></uni-icons>
        <input 
          :type="showPassword ? 'text' : 'password'" 
          v-model="formData.password" 
          placeholder="请设置登录密码（6-20位）" 
          maxlength="20" />
        <view class="toggle-password" @click="showPassword = !showPassword">
          <uni-icons :type="showPassword ? 'eye-filled' : 'eye-slash'" size="22" color="#999"></uni-icons>
        </view>
      </view>
      <view class="input-item">
        <uni-icons type="locked" size="22" color="#999"></uni-icons>
        <input 
          :type="showConfirmPassword ? 'text' : 'password'" 
          v-model="formData.confirmPassword" 
          placeholder="请确认登录密码" 
          maxlength="20" />
        <view class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
          <uni-icons :type="showConfirmPassword ? 'eye-filled' : 'eye-slash'" size="22" color="#999"></uni-icons>
        </view>
      </view>
      <button class="submit-btn" @click="setAccount">下一步</button>
      <view class="back-btn" @click="currentStep = 1">返回上一步</view>
    </view>
    
    <!-- 步骤三：用户类型选择 -->
    <view class="form-box" v-if="currentStep === 3">
      <view class="user-type-title">请选择您的用户类型</view>
      <view class="user-type-desc">您可以在个人中心随时切换身份</view>
      
      <view class="user-type-box">
        <view 
          class="user-type-item" 
          :class="{ active: formData.userType === 'employee' }" 
          @click="formData.userType = 'employee'">
          <view class="type-icon">
            <uni-icons type="person" size="32" :color="formData.userType === 'employee' ? '#4CAF50' : '#999'"></uni-icons>
          </view>
          <view class="type-text">
            <view class="type-name">零工 / 服务者</view>
            <view class="type-desc">提供服务，获取报酬</view>
          </view>
          <view class="type-check" v-if="formData.userType === 'employee'">
            <uni-icons type="checkbox-filled" size="20" color="#4CAF50"></uni-icons>
          </view>
        </view>
        
        <view 
          class="user-type-item" 
          :class="{ active: formData.userType === 'employer' }" 
          @click="formData.userType = 'employer'">
          <view class="type-icon">
            <uni-icons type="staff" size="32" :color="formData.userType === 'employer' ? '#4CAF50' : '#999'"></uni-icons>
          </view>
          <view class="type-text">
            <view class="type-name">雇主 / 需求方</view>
            <view class="type-desc">发布需求，招聘服务者</view>
          </view>
          <view class="type-check" v-if="formData.userType === 'employer'">
            <uni-icons type="checkbox-filled" size="20" color="#4CAF50"></uni-icons>
          </view>
        </view>
      </view>
      
      <button class="submit-btn" @click="completeRegister">完成注册</button>
      <view class="back-btn" @click="currentStep = 2">返回上一步</view>
    </view>
    
    <!-- 注册成功 -->
    <view class="success-box" v-if="registrationSuccess">
      <view class="success-icon">
        <uni-icons type="checkmarkempty" size="80" color="#4CAF50"></uni-icons>
      </view>
      <view class="success-title">注册成功</view>
      <view class="success-desc">您的账号已成功注册</view>
      <button class="submit-btn" @click="goToLogin">立即登录</button>
    </view>
    
    <!-- 底部协议 -->
    <view class="privacy-policy" v-if="!registrationSuccess">
      <checkbox :checked="agreePolicy" @click="agreePolicy = !agreePolicy" color="#4CAF50" />
      <text class="policy-text">注册即表示同意</text>
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
      currentStep: 1, // 当前步骤
      formData: {
        phone: '', // 手机号
        code: '', // 验证码
        username: '', // 昵称
        password: '', // 密码
        confirmPassword: '', // 确认密码
		email:'',
        userType: 'employer' // 用户类型：employee (零工), employer (雇主)
      },
      showPassword: false, // 显示密码
      showConfirmPassword: false, // 显示确认密码
      codeText: '获取验证码', // 验证码按钮文本
      countdown: 60, // 倒计时秒数
      isCounting: false, // 是否正在倒计时
      agreePolicy: true, // 是否同意协议
      registrationSuccess: false // 注册是否成功
    }
  },
  methods: {
    ...mapMutations(['toggleUserType']),
    // 返回上一页
    goBack() {
      if (this.registrationSuccess) {
        uni.navigateBack()
      } else if (this.currentStep > 1) {
        this.currentStep--
      } else {
        uni.navigateBack()
      }
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
      
      // 实际开发需调用后端接口发送验证码
    },
    // 验证手机号和验证码
    verifyPhone() {
      // 检查协议是否同意
      if (!this.agreePolicy) {
        uni.showToast({
          title: '请阅读并同意用户协议和隐私政策',
          icon: 'none'
        })
        return
      }
      
      // 验证手机号
      const phoneReg = /^1[3-9]\d{9}$/
      if (!phoneReg.test(this.formData.phone)) {
        uni.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return
      }
      
      // 验证验证码
      if (!this.formData.code || this.formData.code.length !== 6) {
        uni.showToast({
          title: '请输入6位验证码',
          icon: 'none'
        })
        return
      }
      
      // 模拟验证成功
      this.currentStep = 2
      
      // 实际开发需调用后端接口验证
    },
    // 设置账号信息
    setAccount() {
      // 验证昵称
      if (!this.formData.username) {
        uni.showToast({
          title: '请输入昵称',
          icon: 'none'
        })
        return
      }
      
      // 验证密码
      if (!this.formData.password || this.formData.password.length < 6) {
        uni.showToast({
          title: '请设置至少6位的登录密码',
          icon: 'none'
        })
        return
      }
      
      // 验证确认密码
      if (this.formData.password !== this.formData.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        })
        return
      }
      
      // 进入下一步
      this.currentStep = 3
    },
    // 完成注册
    completeRegister() {
      // 显示加载
      uni.showLoading({
        title: '注册中...'
      })
      
      // 模拟注册请求
      setTimeout(() => {
        // 隐藏加载
        uni.hideLoading()
        
        // // 设置用户类型
        // this.toggleUserType(this.formData.userType)
        
        // // 显示注册成功
        // this.registrationSuccess = true
        
        // 实际开发需调用后端接口
        console.log(this.formData);
        api.register(this.formData).then(res => {
		console.log(res);
          if (res.code === 200) {
            // 设置用户类型
            this.toggleUserType(this.formData.userType)
            // 显示注册成功
            this.registrationSuccess = true
          } else {
            uni.showToast({
              title: res.message || '注册失败',
              icon: 'none'
            })
          }
        }).catch(err => {
          uni.hideLoading()
          uni.showToast({
            title: '注册失败，请稍后重试',
            icon: 'none'
          })
          console.error('注册失败', err)
        })
        
      }, 1500)
    },
    // 跳转到登录页
    goToLogin() {
      // 返回上一页 (登录页)
      uni.redirectTo({
        url: '/pages/login/login'
      })
    },
    // 页面跳转
    navigateTo(url) {
      uni.navigateTo({
        url
      })
    }
  }
}
</script>

<style lang="scss">
.register-container {
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
    margin-bottom: 60rpx;
    
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
  
  .step-box {
    margin-bottom: 60rpx;
    
    .step-line {
      position: relative;
      height: 6rpx;
      background-color: #EEEEEE;
      border-radius: 3rpx;
      margin: 0 40rpx;
      margin-bottom: 20rpx;
      
      .active-line {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: #4CAF50;
        border-radius: 3rpx;
        transition: width 0.3s;
      }
    }
    
    .step-items {
      display: flex;
      justify-content: space-between;
      
      .step-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 33.33%;
        
        .step-number {
          width: 40rpx;
          height: 40rpx;
          line-height: 40rpx;
          text-align: center;
          background-color: #EEEEEE;
          color: #999;
          border-radius: 50%;
          font-size: 26rpx;
          margin-bottom: 10rpx;
        }
        
        .step-text {
          font-size: 24rpx;
          color: #999;
        }
        
        &.active {
          .step-number {
            background-color: #4CAF50;
            color: #FFFFFF;
          }
          
          .step-text {
            color: #4CAF50;
          }
        }
        
        &.completed {
          .step-number {
            background-color: #4CAF50;
            color: #FFFFFF;
          }
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
    
    .user-type-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin: 20rpx 0;
      text-align: center;
    }
    
    .user-type-desc {
      font-size: 26rpx;
      color: #999;
      margin-bottom: 40rpx;
      text-align: center;
    }
    
    .user-type-box {
      .user-type-item {
        display: flex;
        align-items: center;
        padding: 30rpx;
        background-color: #F8F8F8;
        border-radius: 16rpx;
        margin-bottom: 30rpx;
        
        &.active {
          background-color: rgba(76, 175, 80, 0.1);
          border: 1rpx solid #4CAF50;
        }
        
        .type-icon {
          margin-right: 20rpx;
        }
        
        .type-text {
          flex: 1;
          
          .type-name {
            font-size: 30rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 8rpx;
          }
          
          .type-desc {
            font-size: 24rpx;
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
    }
    
    .back-btn {
      text-align: center;
      font-size: 28rpx;
      color: #999;
      margin-top: 30rpx;
    }
  }
  
  .success-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 120rpx;
    
    .success-icon {
      margin-bottom: 40rpx;
    }
    
    .success-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .success-desc {
      font-size: 28rpx;
      color: #999;
      margin-bottom: 80rpx;
    }
    
    .submit-btn {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      background: #4CAF50;
      color: #FFFFFF;
      font-size: 32rpx;
      border-radius: 45rpx;
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