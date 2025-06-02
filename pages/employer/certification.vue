<template>
  <view class="certification-container">
    <!-- 自定义导航栏 -->
    <nav-bar title="企业认证" :showBack="true"></nav-bar>
    
    <!-- 认证表单 -->
    <view class="form-container">
      <view class="form-title">企业信息</view>
      
      <!-- 企业名称 -->
      <view class="form-item">
        <view class="label">
          <text class="required">*</text>
          <text>企业名称</text>
        </view>
        <input type="text" placeholder="请输入企业全称" v-model="formData.companyName" />
      </view>
      
      <!-- 统一社会信用代码 -->
      <view class="form-item">
        <view class="label">
          <text class="required">*</text>
          <text>统一社会信用代码</text>
        </view>
        <input type="text" placeholder="请输入统一社会信用代码" v-model="formData.creditCode" maxlength="18" />
      </view>
      
      <!-- 企业法人 -->
      <view class="form-item">
        <view class="label">
          <text class="required">*</text>
          <text>企业法人</text>
        </view>
        <input type="text" placeholder="请输入法人姓名" v-model="formData.legalPerson" />
      </view>
      
      <!-- 联系电话 -->
      <view class="form-item">
        <view class="label">
          <text class="required">*</text>
          <text>联系电话</text>
        </view>
        <input type="number" placeholder="请输入联系电话" v-model="formData.contactPhone" maxlength="11" />
      </view>
      
      <!-- 所在地区 -->
      <view class="form-item">
        <view class="label">
          <text class="required">*</text>
          <text>所在地区</text>
        </view>
        <view class="picker-item" @click="openRegionPicker">
          <text class="picker-text">{{formData.region || '请选择地区'}}</text>
          <uni-icons type="arrowright" size="16" color="#CCCCCC"></uni-icons>
        </view>
      </view>
      
      <!-- 详细地址 -->
      <view class="form-item">
        <view class="label">
          <text class="required">*</text>
          <text>详细地址</text>
        </view>
        <input type="text" placeholder="请输入详细地址" v-model="formData.address" />
      </view>
      
      <!-- 企业规模 -->
      <view class="form-item">
        <view class="label">
          <text>企业规模</text>
        </view>
        <view class="picker-item" @click="openScalePicker">
          <text class="picker-text">{{formData.scale || '请选择企业规模'}}</text>
          <uni-icons type="arrowright" size="16" color="#CCCCCC"></uni-icons>
        </view>
      </view>
      
      <!-- 企业简介 -->
      <view class="form-item textarea-item">
        <view class="label">
          <text>企业简介</text>
        </view>
        <textarea placeholder="请输入企业简介，不超过200字" v-model="formData.description" maxlength="200" />
        <view class="word-count">{{formData.description.length}}/200</view>
      </view>
      
      <view class="form-title">资质证明</view>
      
      <!-- 营业执照 -->
      <view class="form-item">
        <view class="label">
          <text class="required">*</text>
          <text>营业执照</text>
        </view>
        <view class="upload-area">
          <view class="upload-box" @click="chooseImage('license')" v-if="!formData.license">
            <view class="upload-icon">+</view>
            <text>上传营业执照</text>
          </view>
          <view class="image-preview" v-else>
            <image :src="formData.license" mode="aspectFill"></image>
            <view class="delete-btn" @click.stop="deleteImage('license')">×</view>
          </view>
        </view>
      </view>
      
      <!-- 企业Logo -->
      <view class="form-item">
        <view class="label">
          <text>企业Logo</text>
        </view>
        <view class="upload-area">
          <view class="upload-box" @click="chooseImage('logo')" v-if="!formData.logo">
            <view class="upload-icon">+</view>
            <text>上传Logo</text>
          </view>
          <view class="image-preview" v-else>
            <image :src="formData.logo" mode="aspectFill"></image>
            <view class="delete-btn" @click.stop="deleteImage('logo')">×</view>
          </view>
        </view>
      </view>
      
      <!-- 提交按钮 -->
      <button class="submit-btn" @click="submitForm">提交认证</button>
      
      <view class="tips">
        <view class="tips-title">温馨提示：</view>
        <view class="tips-item">• 企业认证通过后，将获得更多招聘特权</view>
        <view class="tips-item">• 企业信息需真实有效，我们将进行人工审核</view>
        <view class="tips-item">• 一般1-3个工作日内完成审核，请耐心等待</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        companyName: '',
        creditCode: '',
        legalPerson: '',
        contactPhone: '',
        region: '',
        address: '',
        scale: '',
        description: '',
        license: '',
        logo: ''
      },
      scaleOptions: ['50人以下', '50-200人', '200-500人', '500-1000人', '1000人以上']
    }
  },
  methods: {
    // 打开地区选择器
    openRegionPicker() {
      // 这里可以调用地区选择组件
      uni.showToast({
        title: '选择地区功能需集成地区选择器',
        icon: 'none'
      })
    },
    
    // 打开企业规模选择器
    openScalePicker() {
      uni.showActionSheet({
        itemList: this.scaleOptions,
        success: (res) => {
          this.formData.scale = this.scaleOptions[res.tapIndex]
        }
      })
    },
    
    // 选择图片
    chooseImage(type) {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.formData[type] = res.tempFilePaths[0]
        }
      })
    },
    
    // 删除图片
    deleteImage(type) {
      this.formData[type] = ''
    },
    
    // 提交表单
    submitForm() {
      // 表单验证
      if (!this.formData.companyName) {
        return this.showError('请输入企业名称')
      }
      if (!this.formData.creditCode) {
        return this.showError('请输入统一社会信用代码')
      }
      if (!this.formData.legalPerson) {
        return this.showError('请输入企业法人')
      }
      if (!this.formData.contactPhone) {
        return this.showError('请输入联系电话')
      }
      if (!this.formData.region) {
        return this.showError('请选择所在地区')
      }
      if (!this.formData.address) {
        return this.showError('请输入详细地址')
      }
      if (!this.formData.license) {
        return this.showError('请上传营业执照')
      }
      
      // 提交表单
      uni.showLoading({
        title: '提交中...'
      })
      
      // 模拟API请求
      setTimeout(() => {
        uni.hideLoading()
        uni.showModal({
          title: '认证申请已提交',
          content: '您的企业认证申请已提交，我们将在1-3个工作日内完成审核，请耐心等待。',
          showCancel: false,
          success: () => {
            // 返回上一页
            uni.navigateBack()
          }
        })
      }, 1500)
    },
    
    // 显示错误提示
    showError(message) {
      uni.showToast({
        title: message,
        icon: 'none'
      })
      return false
    }
  }
}
</script>

<style lang="scss">
.certification-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  
  .form-container {
    padding: 30rpx;
    
    .form-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin: 30rpx 0 20rpx;
      position: relative;
      padding-left: 20rpx;
      
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 10rpx;
        width: 6rpx;
        height: 30rpx;
        background-color: #4CAF50;
        border-radius: 3rpx;
      }
    }
    
    .form-item {
      background-color: #FFFFFF;
      padding: 24rpx 30rpx;
      margin-bottom: 2rpx;
      
      .label {
        display: flex;
        margin-bottom: 20rpx;
        
        .required {
          color: #FF5722;
          margin-right: 5rpx;
        }
        
        text {
          font-size: 28rpx;
          color: #333;
        }
      }
      
      input, .picker-item {
        height: 80rpx;
        font-size: 28rpx;
        color: #333;
      }
      
      .picker-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .picker-text {
          color: #666;
        }
      }
      
      &.textarea-item {
        position: relative;
        padding-bottom: 50rpx;
        
        textarea {
          width: 100%;
          height: 200rpx;
          font-size: 28rpx;
          color: #333;
        }
        
        .word-count {
          position: absolute;
          right: 30rpx;
          bottom: 20rpx;
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .upload-area {
        display: flex;
        
        .upload-box, .image-preview {
          width: 200rpx;
          height: 200rpx;
          border: 1px dashed #DDDDDD;
          border-radius: 8rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          
          .upload-icon {
            font-size: 50rpx;
            color: #CCCCCC;
            margin-bottom: 10rpx;
          }
          
          text {
            font-size: 24rpx;
            color: #999;
          }
        }
        
        .image-preview {
          position: relative;
          border: none;
          
          image {
            width: 100%;
            height: 100%;
            border-radius: 8rpx;
          }
          
          .delete-btn {
            position: absolute;
            top: -20rpx;
            right: -20rpx;
            width: 40rpx;
            height: 40rpx;
            background-color: rgba(0, 0, 0, 0.5);
            color: #FFFFFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
    
    .submit-btn {
      background-color: #4CAF50;
      color: #FFFFFF;
      font-size: 32rpx;
      height: 90rpx;
      line-height: 90rpx;
      border-radius: 45rpx;
      margin: 60rpx 0 40rpx;
    }
    
    .tips {
      padding: 30rpx;
      
      .tips-title {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 20rpx;
      }
      
      .tips-item {
        font-size: 26rpx;
        color: #999;
        line-height: 1.8;
      }
    }
  }
}
</style> 