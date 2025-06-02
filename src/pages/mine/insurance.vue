<template>
  <view class="insurance-container">
    <!-- 自定义导航栏 -->
    <cu-custom bgColor="bg-white" isBack>
      <block slot="content">保险</block>
    </cu-custom>
    
    <!-- 保险公司电话 -->
    <view class="insurance-section">
      <view class="section-title">保险公司电话</view>
      <view class="phone-box" @click="callInsurance">
        <text>95518</text>
        <image src="/static/img/icons/call.png" mode="aspectFit" class="call-icon"></image>
      </view>
    </view>
    
    <!-- 上传凭证 -->
    <view class="insurance-section">
      <view class="section-title">上传凭证</view>
      <view class="upload-box" @click="chooseImage">
        <image v-if="imageUrl" :src="imageUrl" mode="aspectFill" class="uploaded-image"></image>
        <view v-else class="upload-placeholder">
          <image src="/static/img/icons/camera.png" mode="aspectFit" class="camera-icon"></image>
        </view>
      </view>
    </view>
    
    <!-- 备注 -->
    <view class="insurance-section">
      <view class="section-title">备注</view>
      <textarea class="remark-textarea" placeholder="请输入备注..." v-model="remark"></textarea>
    </view>
    
    <!-- 提交按钮 -->
    <button class="submit-btn" @click="submitInsurance">提交信息</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: '',
      remark: ''
    }
  },
  methods: {
    callInsurance() {
      uni.makePhoneCall({
        phoneNumber: '95518',
        success: () => {
          console.log('拨打电话成功')
        },
        fail: (err) => {
          console.error('拨打电话失败', err)
          uni.showToast({
            title: '拨打电话失败',
            icon: 'none'
          })
        }
      })
    },
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.imageUrl = res.tempFilePaths[0]
        },
        fail: (err) => {
          console.error('选择图片失败', err)
        }
      })
    },
    submitInsurance() {
      if (!this.imageUrl) {
        uni.showToast({
          title: '请上传保险凭证',
          icon: 'none'
        })
        return
      }
      
      // 模拟上传
      uni.showLoading({
        title: '提交中...'
      })
      
      setTimeout(() => {
        uni.hideLoading()
        
        uni.showModal({
          title: '提交成功',
          content: '您的保险信息已提交，我们将尽快审核',
          showCancel: false,
          success: () => {
            uni.navigateBack()
          }
        })
      }, 1500)
    }
  }
}
</script>

<style lang="scss">
.insurance-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 50rpx;
  
  .insurance-section {
    background-color: #FFFFFF;
    margin: 20rpx;
    border-radius: 16rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
    
    .section-title {
      font-size: 30rpx;
      color: #333;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    
    .phone-box {
      background-color: #F5F5F5;
      padding: 20rpx 30rpx;
      border-radius: 12rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      text {
        font-size: 30rpx;
        color: #333;
      }
      
      .call-icon {
        width: 40rpx;
        height: 40rpx;
      }
    }
    
    .upload-box {
      width: 100%;
      height: 300rpx;
      background-color: #F5F5F5;
      border-radius: 12rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      
      .upload-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .camera-icon {
          width: 80rpx;
          height: 80rpx;
          margin-bottom: 20rpx;
        }
      }
      
      .uploaded-image {
        width: 100%;
        height: 100%;
      }
    }
    
    .remark-textarea {
      width: 100%;
      height: 200rpx;
      background-color: #F5F5F5;
      border-radius: 12rpx;
      padding: 20rpx;
      font-size: 28rpx;
      color: #333;
    }
  }
  
  .submit-btn {
    width: 90%;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #4CAF50;
    color: #FFFFFF;
    font-size: 32rpx;
    border-radius: 45rpx;
    margin-top: 40rpx;
  }
}
</style> 