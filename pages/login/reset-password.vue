<template>
  <view class="reset-container">
    <!-- 顶部导航栏 -->
    <view class="nav-back" @click="goBack">
      <uni-icons type="arrow-left" size="24" color="#333"></uni-icons>
    </view>
    
    <!-- 顶部标题 -->
    <view class="header">
      <view class="title">重置密码</view>
      <view class="sub-title">通过手机号验证重置密码</view>
    </view>
    
    <!-- 步骤指示器 -->
    <view class="step-box">
      <view class="step-line">
        <view class="line"></view>
        <view class="active-line" :style="{ width: `${(currentStep-1)*50}%` }"></view>
      </view>
      <view class="step-items">
        <view class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <view class="step-number">1</view>
          <view class="step-text">手机验证</view>
        </view>
        <view class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <view class="step-number">2</view>
          <view class="step-text">设置新密码</view>
        </view>
        <view class="step-item" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
          <view class="step-number">3</view>
          <view class="step-text">重置成功</view>
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
    
    <!-- 步骤二：设置新密码 -->
    <view class="form-box" v-if="currentStep === 2">
      <view class="input-item">
        <uni-icons type="locked" size="22" color="#999"></uni-icons>
        <input 
          :type="showPassword ? 'text' : 'password'" 
          v-model="formData.password" 
          placeholder="请设置新密码（6-20位）" 
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
          placeholder="请确认新密码" 
          maxlength="20" />
        <view class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
          <uni-icons :type="showConfirmPassword ? 'eye-filled' : 'eye-slash'" size="22" color="#999"></uni-icons>
        </view>
      </view>
      <view class="password-tips">
        <text>密码安全提示：</text>
        <text>• 至少6个字符，区分大小写</text>
        <text>• 建议使用字母、数字和符号的组合</text>
      </view>
      <button class="submit-btn" @click="resetPassword">重置密码</button>
      <view class="back-btn" @click="currentStep = 1">返回上一步</view>
    </view>
    
    <!-- 步骤三：重置成功 -->
    <view class="success-box" v-if="currentStep === 3">
      <view class="success-icon">
        <uni-icons type="checkmarkempty" size="80" color="#4CAF50"></uni-icons>
      </view>
      <view class="success-title">重置成功</view>
      <view class="success-desc">您的密码已成功重置</view>
      <button class="submit-btn" @click="goToLogin">去登录</button>
    </view>
  </view>
</template>

<script>
import api from '@/api/index.js'

export default {
  data() {
    return {
      currentStep: 1, // 当前步骤
      formData: {
        phone: '', // 手机号
        code: '', // 验证码
        password: '', // 新密码
        confirmPassword: '' // 确认新密码
      },
      showPassword: false, // 显示新密码
      showConfirmPassword: false, // 显示确认新密码
      codeText: '获取验证码', // 验证码按钮文本
      countdown: 60, // 倒计时秒数
      isCounting: false // 是否正在倒计时
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      if (this.currentStep > 1 && this.currentStep < 3) {
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
      
      // 实际开发需调用后端接口
      /*
      api.sendSmsCode({
        phone: this.formData.phone,
        type: 'reset_password'
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
    // 验证手机号和验证码
    verifyPhone() {
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
      /*
      api.verifyResetCode({
        phone: this.formData.phone,
        code: this.formData.code
      }).then(res => {
        if (res.code === 0) {
          this.currentStep = 2
        } else {
          uni.showToast({
            title: res.message || '验证码错误',
            icon: 'none'
          })
        }
      }).catch(err => {
        uni.showToast({
          title: '验证失败，请稍后重试',
          icon: 'none'
        })
      })
      */
    },
    // 重置密码
    resetPassword() {
      // 验证密码
      if (!this.formData.password || this.formData.password.length < 6) {
        uni.showToast({
          title: '请设置至少6位的密码',
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
      
      // 显示加载
      uni.showLoading({
        title: '处理中...'
      })
      
      // 模拟重置密码
      setTimeout(() => {
        uni.hideLoading()
        this.currentStep = 3
        
        // 实际开发需调用后端接口
        /*
        api.resetPassword({
          phone: this.formData.phone,
          code: this.formData.code,
          password: this.formData.password
        }).then(res => {
          uni.hideLoading()
          if (res.code === 0) {
            this.currentStep = 3
          } else {
            uni.showToast({
              title: res.message || '重置失败',
              icon: 'none'
            })
          }
        }).catch(err => {
          uni.hideLoading()
          uni.showToast({
            title: '重置失败，请稍后重试',
            icon: 'none'
          })
        })
        */
      }, 1500)
    },
    // 跳转到登录页
    goToLogin() {
      uni.redirectTo({
        url: '/pages/login/login'
      })
    }
  }
}
</script>

<style lang="scss">
.reset-container {
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
    
    .password-tips {
      margin-top: 30rpx;
      background-color: #F8F8F8;
      padding: 20rpx;
      border-radius: 10rpx;
      
      text {
        display: block;
        font-size: 24rpx;
        color: #999;
        line-height: 40rpx;
        
        &:first-child {
          color: #666;
          font-weight: bold;
          margin-bottom: 10rpx;
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
}
</style> 