<template>
  <view class="post-container">
    <!-- 自定义导航栏 -->
    <nav-bar title="用工发布" :showBack="true" @back="goBack"></nav-bar>
    
    <!-- 顶部切换 -->
    <view class="tab-bar">
      <view class="tab-item" :class="{active: currentTab === 'personal'}" @click="currentTab = 'personal'">
        <text>个人发布</text>
      </view>
      <view class="tab-item" :class="{active: currentTab === 'enterprise'}" @click="currentTab = 'enterprise'">
        <text>企业发布</text>
      </view>
    </view>
    
    <!-- 提示信息 -->
    <view class="tip-bar" v-if="showTip">
      <text>温馨提示: 请先进行个人/工注册发布需求</text>
      <button class="tip-btn" @click="goToRegister">去登记</button>
    </view>
    
    <!-- 表单区域 -->
    <scroll-view scroll-y class="form-scroll">
      <!-- 需求标题 -->
      <view class="form-item">
        <text class="required">* 需求标题</text>
        <view class="input-area">
          <input type="text" v-model="formData.title" placeholder="比如：保洁/家政/配送"/>
        </view>
      </view>
      
      <!-- 工种选择 -->
      <view class="form-item">
        <text class="required">* 工种</text>
        <view class="input-area select" @click="showCategoryPicker">
          <text :class="{placeholder: !formData.category}">{{formData.category || '请选择...'}}</text>
          <uni-icons type="forward" size="16" color="#CCCCCC"></uni-icons>
        </view>
      </view>
      
      <!-- 价格预算 -->
      <view class="form-item">
        <text class="required">* 价格预算</text>
        <view class="input-area">
          <input type="digit" v-model="formData.salary" placeholder="请输入(不得低于0.1元)"/>
          <text class="unit">元/人</text>
        </view>
      </view>
      
      <!-- 用工人数 -->
      <view class="form-item">
        <text class="required">* 用工人数</text>
        <view class="input-area">
          <text class="counter-value">{{formData.peopleCount}}</text>
          <view class="counter-btns">
            <button class="counter-btn minus" @click="decrementCount">-</button>
            <button class="counter-btn plus" @click="incrementCount">+</button>
          </view>
          <text class="unit">人</text>
        </view>
      </view>
      
      <!-- 工作地址 -->
      <view class="form-item">
        <text class="required">* 工作地址</text>
        <view class="input-area location" @click="chooseLocation">
          <text :class="{placeholder: !formData.address}">{{formData.address || '地图选择位置(必选！获取结果便于导航)'}}</text>
          <view class="location-icon">
            <uni-icons type="location" size="18" color="#4CAF50"></uni-icons>
          </view>
        </view>
        <input type="text" v-model="formData.addressDetail" placeholder="详细地址，例如楼层101室" class="address-detail"/>
      </view>
      
      <!-- 性别限制 -->
      <view class="form-item">
        <text class="required">* 性别限制</text>
        <view class="radio-group">
          <view class="radio-item" :class="{active: formData.gender === 'any'}" @click="formData.gender = 'any'">
            <view class="radio-circle">
              <view class="radio-inner" v-if="formData.gender === 'any'"></view>
            </view>
            <text>不限</text>
          </view>
          <view class="radio-item" :class="{active: formData.gender === 'male'}" @click="formData.gender = 'male'">
            <view class="radio-circle">
              <view class="radio-inner" v-if="formData.gender === 'male'"></view>
            </view>
            <text>男</text>
          </view>
          <view class="radio-item" :class="{active: formData.gender === 'female'}" @click="formData.gender = 'female'">
            <view class="radio-circle">
              <view class="radio-inner" v-if="formData.gender === 'female'"></view>
            </view>
            <text>女</text>
          </view>
        </view>
      </view>
      
      <!-- 工作内容 -->
      <view class="form-item">
        <text class="required">* 工作内容</text>
        <view class="textarea-area">
          <textarea v-model="formData.content" placeholder="请输入..."></textarea>
        </view>
      </view>
      
      <!-- 工作时间 -->
      <view class="form-item">
        <text class="required">* 工作时间</text>
        <view class="time-picker">
          <input type="text" v-model="formData.workStartTime" placeholder="请输入开始时间"/>
          <text class="time-separator">至</text>
          <input type="text" v-model="formData.workEndTime" placeholder="请输入结束时间"/>
        </view>
      </view>
      
      <!-- 工作环境 -->
      <view class="form-item">
        <text>工作环境</text>
        <view class="image-uploader" @click="chooseImage">
          <view class="upload-box" v-if="!formData.environmentImage">
            <uni-icons type="camera" size="24" color="#CCCCCC"></uni-icons>
          </view>
          <image v-else :src="formData.environmentImage" mode="aspectFill" class="preview-image"></image>
        </view>
      </view>
      
      <!-- 优惠券 -->
      <view class="coupon-section">
        <view class="coupon-header">
          <text>选择可用优惠券</text>
          <button class="coupon-btn" @click="selectCoupon">去选择</button>
        </view>
        <view class="coupon-item" v-if="selectedCoupon">
          <text class="coupon-name">{{selectedCoupon.name}}</text>
          <text class="coupon-value">{{selectedCoupon.value}}</text>
        </view>
      </view>
      
      <!-- 服务费支付 -->
      <view class="form-item">
        <text>* 发单付劳务费(0.00元/人上代先付的20%劳务费)</text>
        <view class="radio-group">
          <view class="radio-item" :class="{active: formData.payService}" @click="formData.payService = true">
            <view class="radio-circle">
              <view class="radio-inner" v-if="formData.payService"></view>
            </view>
            <text>支付</text>
          </view>
          <view class="radio-item" :class="{active: !formData.payService}" @click="formData.payService = false">
            <view class="radio-circle">
              <view class="radio-inner" v-if="!formData.payService"></view>
            </view>
            <text>不支付</text>
          </view>
        </view>
      </view>
      
      <!-- 薪资范围 -->
      <view class="form-item">
        <text>薪资上限</text>
        <view class="input-area">
          <input type="digit" v-model="formData.maxSalary" placeholder="请输入..."/>
        </view>
      </view>
      
      <view class="form-item">
        <text>薪资下限</text>
        <view class="input-area">
          <input type="digit" v-model="formData.minSalary" placeholder="请输入..."/>
        </view>
      </view>
      
      <!-- 结算方式 -->
      <view class="form-item">
        <text>结算方式</text>
        <view class="input-area select" @click="showPaymentMethodPicker">
          <text :class="{placeholder: !formData.paymentMethod}">{{formData.paymentMethod || '请选择...'}}</text>
          <uni-icons type="forward" size="16" color="#CCCCCC"></uni-icons>
        </view>
      </view>
      
      <!-- 紧急招聘 -->
      <view class="form-item">
        <text>急招</text>
        <view class="toggle-switch">
          <view class="switch-label" :class="{active: formData.isUrgent}">
            <text>{{formData.isUrgent ? '是' : '否'}}</text>
          </view>
          <switch :checked="formData.isUrgent" @change="switchUrgent" color="#4CAF50"/>
        </view>
      </view>
      
      <view class="form-item">
        <text>热招</text>
        <view class="toggle-switch">
          <view class="switch-label" :class="{active: formData.isHot}">
            <text>{{formData.isHot ? '是' : '否'}}</text>
          </view>
          <switch :checked="formData.isHot" @change="switchHot" color="#4CAF50"/>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部提交按钮 -->
    <view class="post-btn-wrapper">
      <button class="post-btn" @click="submitForm">用工发布</button>
    </view>
    
    <!-- 底部导航栏 -->
    <employer-tabbar currentTab="publish"></employer-tabbar>
    
    <!-- 分类选择弹窗 -->
    <uni-popup ref="categoryPopup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">选择工种</text>
          <text class="popup-close" @click="closePopup('categoryPopup')">关闭</text>
        </view>
        <view class="popup-body">
          <view 
            class="popup-item" 
            v-for="(item, index) in categories" 
            :key="index"
            @click="selectCategory(item)"
          >
            <text>{{item}}</text>
          </view>
        </view>
      </view>
    </uni-popup>
    
    <!-- 结算方式弹窗 -->
    <uni-popup ref="paymentMethodPopup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">选择结算方式</text>
          <text class="popup-close" @click="closePopup('paymentMethodPopup')">关闭</text>
        </view>
        <view class="popup-body">
          <view 
            class="popup-item" 
            v-for="(item, index) in paymentMethods" 
            :key="index"
            @click="selectPaymentMethod(item)"
          >
            <text>{{item}}</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import EmployerTabbar from '@/components/employer-tabbar'

export default {
  components: {
    EmployerTabbar
  },
  data() {
    return {
      currentTab: 'personal',
      showTip: true,
      formData: {
        title: '',
        category: '',
        salary: '',
        peopleCount: 1,
        address: '',
        addressDetail: '',
        latitude: 0,
        longitude: 0,
        gender: 'any',
        content: '',
        workStartTime: '',
        workEndTime: '',
        environmentImage: '',
        payService: true,
        maxSalary: '',
        minSalary: '',
        paymentMethod: '',
        isUrgent: false,
        isHot: false
      },
      categories: [
        '家政服务', '物流配送', '制造业', '餐饮服务', '医疗陪诊',
        '零售服务', '建筑工地', '活动促销', '手工制作', '其他服务'
      ],
      paymentMethods: [
        '日结', '周结', '月结', '完工结算'
      ],
      selectedCoupon: null
    }
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1,
        fail: function() {
          uni.reLaunch({
            url: '/pages/employer/resume/index'
          })
        }
      })
    },
    goToRegister() {
      uni.navigateTo({
        url: '/pages/employer/certification'
      })
      this.showTip = false
    },
    incrementCount() {
      this.formData.peopleCount++
    },
    decrementCount() {
      if (this.formData.peopleCount > 1) {
        this.formData.peopleCount--
      }
    },
    chooseLocation() {
      uni.chooseLocation({
        success: (res) => {
          this.formData.address = res.address
          this.formData.latitude = res.latitude
          this.formData.longitude = res.longitude
        }
      })
    },
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.formData.environmentImage = res.tempFilePaths[0]
        }
      })
    },
    showCategoryPicker() {
      this.$refs.categoryPopup.open()
    },
    showPaymentMethodPicker() {
      this.$refs.paymentMethodPopup.open()
    },
    closePopup(popupName) {
      this.$refs[popupName].close()
    },
    selectCategory(category) {
      this.formData.category = category
      this.closePopup('categoryPopup')
    },
    selectPaymentMethod(method) {
      this.formData.paymentMethod = method
      this.closePopup('paymentMethodPopup')
    },
    selectCoupon() {
      // 模拟选择优惠券
      this.selectedCoupon = {
        name: '发单劳务费优惠券',
        value: '减免20%服务费'
      }
    },
    switchUrgent(e) {
      this.formData.isUrgent = e.detail.value
    },
    switchHot(e) {
      this.formData.isHot = e.detail.value
    },
    validateForm() {
      // 必填字段验证
      const requiredFields = [
        {field: 'title', name: '需求标题'},
        {field: 'category', name: '工种'},
        {field: 'salary', name: '价格预算'},
        {field: 'address', name: '工作地址'},
        {field: 'content', name: '工作内容'},
        {field: 'workStartTime', name: '工作开始时间'},
        {field: 'workEndTime', name: '工作结束时间'}
      ]
      
      for (let item of requiredFields) {
        if (!this.formData[item.field]) {
          uni.showToast({
            title: `请填写${item.name}`,
            icon: 'none'
          })
          return false
        }
      }
      
      // 工资检查
      if (parseFloat(this.formData.salary) < 0.1) {
        uni.showToast({
          title: '价格预算不能低于0.1元',
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    submitForm() {
      if (!this.validateForm()) return
      
      uni.showLoading({
        title: '提交中...'
      })
      
      // 模拟提交处理
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '发布成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/employer/jobManage'
          })
        }, 1500)
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
.post-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F5F5F5;
  
  .tab-bar {
    display: flex;
    height: 100rpx;
    background-color: #FFFFFF;
    
    .tab-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      
      text {
        font-size: 30rpx;
        color: #666;
      }
      
      &.active {
        text {
          color: #4CAF50;
          font-weight: bold;
        }
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 30%;
          width: 40%;
          height: 4rpx;
          background-color: #4CAF50;
        }
      }
    }
  }
  
  .tip-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #FFF9E9;
    
    text {
      font-size: 24rpx;
      color: #FF9800;
    }
    
    .tip-btn {
      font-size: 24rpx;
      color: #FFFFFF;
      background-color: #FF9800;
      padding: 6rpx 20rpx;
      border-radius: 30rpx;
      line-height: 1.5;
    }
  }
  
  .form-scroll {
    flex: 1;
    padding: 0 30rpx 120rpx;
  }
  
  .form-item {
    margin: 30rpx 0;
    
    .required:before {
      content: '*';
      color: #FF5252;
      margin-right: 4rpx;
    }
    
    > text {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 16rpx;
    }
    
    .input-area {
      height: 88rpx;
      background-color: #FFFFFF;
      border-radius: 8rpx;
      padding: 0 20rpx;
      display: flex;
      align-items: center;
      
      input {
        flex: 1;
        height: 100%;
        font-size: 28rpx;
      }
      
      .unit {
        color: #999;
        font-size: 28rpx;
        margin-left: 10rpx;
      }
      
      &.select {
        justify-content: space-between;
        
        text {
          font-size: 28rpx;
          color: #333;
          
          &.placeholder {
            color: #999;
          }
        }
      }
      
      &.location {
        justify-content: space-between;
        
        text {
          flex: 1;
          font-size: 28rpx;
          color: #333;
          
          &.placeholder {
            color: #999;
          }
        }
        
        .location-icon {
          margin-left: 10rpx;
        }
      }
      
      .counter-value {
        flex: 1;
        font-size: 28rpx;
      }
      
      .counter-btns {
        display: flex;
        margin-right: 10rpx;
        
        .counter-btn {
          width: 60rpx;
          height: 60rpx;
          border-radius: 4rpx;
          background-color: #F5F5F5;
          color: #333;
          margin: 0 6rpx;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 1;
          font-size: 40rpx;
        }
      }
    }
    
    .address-detail {
      margin-top: 20rpx;
      height: 88rpx;
      background-color: #FFFFFF;
      border-radius: 8rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
    }
    
    .textarea-area {
      background-color: #FFFFFF;
      border-radius: 8rpx;
      padding: 20rpx;
      
      textarea {
        width: 100%;
        height: 200rpx;
        font-size: 28rpx;
      }
    }
    
    .radio-group {
      display: flex;
      
      .radio-item {
        display: flex;
        align-items: center;
        margin-right: 50rpx;
        
        .radio-circle {
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
          border: 2rpx solid #CCCCCC;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 10rpx;
          
          .radio-inner {
            width: 24rpx;
            height: 24rpx;
            border-radius: 50%;
            background-color: #4CAF50;
          }
        }
        
        &.active {
          .radio-circle {
            border-color: #4CAF50;
          }
        }
        
        text {
          font-size: 28rpx;
          color: #333;
        }
      }
    }
    
    .time-picker {
      display: flex;
      align-items: center;
      
      input {
        flex: 1;
        height: 88rpx;
        background-color: #FFFFFF;
        border-radius: 8rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
      }
      
      .time-separator {
        padding: 0 20rpx;
        font-size: 28rpx;
        color: #999;
      }
    }
    
    .image-uploader {
      .upload-box {
        width: 200rpx;
        height: 200rpx;
        background-color: #FFFFFF;
        border-radius: 8rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2rpx dashed #CCCCCC;
      }
      
      .preview-image {
        width: 200rpx;
        height: 200rpx;
        border-radius: 8rpx;
      }
    }
    
    .toggle-switch {
      display: flex;
      align-items: center;
      
      .switch-label {
        margin-right: 20rpx;
        
        text {
          font-size: 28rpx;
          color: #999;
        }
        
        &.active {
          text {
            color: #4CAF50;
          }
        }
      }
    }
  }
  
  .coupon-section {
    background-color: #FFFFFF;
    border-radius: 8rpx;
    padding: 20rpx;
    margin: 30rpx 0;
    
    .coupon-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      text {
        font-size: 28rpx;
        color: #333;
      }
      
      .coupon-btn {
        font-size: 24rpx;
        color: #4CAF50;
        background-color: #E8F5E9;
        padding: 6rpx 20rpx;
        border-radius: 30rpx;
        line-height: 1.5;
      }
    }
    
    .coupon-item {
      margin-top: 20rpx;
      background-color: #FFF9E9;
      border-radius: 8rpx;
      padding: 20rpx;
      display: flex;
      justify-content: space-between;
      
      .coupon-name {
        font-size: 26rpx;
        color: #FF9800;
      }
      
      .coupon-value {
        font-size: 26rpx;
        color: #FF9800;
        font-weight: bold;
      }
    }
  }
  
  .post-btn-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 20rpx 30rpx;
    background-color: #FFFFFF;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    
    .post-btn {
      width: 100%;
      height: 88rpx;
      background-color: #4CAF50;
      color: #FFFFFF;
      font-size: 32rpx;
      border-radius: 44rpx;
      line-height: 88rpx;
    }
  }
  
  .popup-content {
    background-color: #FFFFFF;
    border-radius: 20rpx 20rpx 0 0;
    
    .popup-header {
      display: flex;
      justify-content: space-between;
      padding: 30rpx;
      border-bottom: 1rpx solid #EEEEEE;
      
      .popup-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
      }
      
      .popup-close {
        font-size: 28rpx;
        color: #999;
      }
    }
    
    .popup-body {
      max-height: 60vh;
      overflow-y: auto;
      
      .popup-item {
        padding: 30rpx;
        border-bottom: 1rpx solid #EEEEEE;
        font-size: 28rpx;
        color: #333;
        
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style> 