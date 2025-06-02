<template>
  <view class="job-post-container">
    <employer-navbar title="发布工作"></employer-navbar>
    
    <scroll-view scroll-y class="form-container">
      <!-- 基本信息 -->
      <view class="form-section">
        <view class="section-title">基本信息</view>
        
        <!-- 工作标题 -->
        <view class="form-item">
          <text class="label required">工作标题</text>
          <input type="text" v-model="formData.title" placeholder="请输入工作标题" />
        </view>
        
        <!-- 工作类型 -->
        <view class="form-item">
          <text class="label required">工作类型</text>
          <view class="form-input" @tap="showJobTypePicker">
            <text class="text-gray">{{selectedJobType || '请选择工作类型'}}</text>
            <text class="cuIcon-right"></text>
          </view>
        </view>
        
        <!-- 工资范围 -->
        <view class="form-item">
          <text class="label required">工资范围</text>
          <view class="salary-range">
            <view class="salary-input-wrapper">
              <input 
                type="digit" 
                v-model="formData.salaryMin" 
                placeholder="最低工资" 
                @input="handleSalaryInput('min')"
                @blur="validateSalary('min')"
              />
              <text class="unit">元/天</text>
            </view>
            <text class="separator">-</text>
            <view class="salary-input-wrapper">
              <input 
                type="digit" 
                v-model="formData.salaryMax" 
                placeholder="最高工资" 
                @input="handleSalaryInput('max')"
                @blur="validateSalary('max')"
              />
              <text class="unit">元/天</text>
            </view>
          </view>
          <view class="salary-info">
            <text class="salary-tip" v-if="formData.salary">平均工资：{{formData.salary}}元/天</text>
            <text class="salary-warning" v-if="salaryWarning">{{salaryWarning}}</text>
          </view>
        </view>
        
        <!-- 招工人数 -->
        <view class="form-item">
          <text class="label required">招工人数</text>
          <input type="number" v-model="formData.workerCount" placeholder="请输入招工人数" />
        </view>
        
        <!-- 工作地点 -->
        <view class="form-item">
          <text class="label required">工作地点</text>
          <view class="form-input" @tap="chooseLocation">
            <text class="text-gray">{{formData.location || '请选择工作地点'}}</text>
            <text class="cuIcon-location"></text>
          </view>
        </view>
        
        <!-- 详细地址 -->
        <view class="form-item">
          <text class="label required">详细地址</text>
          <input type="text" v-model="formData.address" placeholder="请输入详细地址" />
        </view>
        
        <!-- 地址详情 -->
        <view class="form-item">
          <text class="label">地址详情</text>
          <input type="text" v-model="formData.addressDetail" placeholder="请输入地址详情（选填）" />
        </view>
      </view>
      
      <!-- 工作要求 -->
      <view class="form-section">
        <view class="section-title">工作要求</view>
        
        <!-- 性别要求 -->
        <view class="form-item">
          <text class="label">性别要求</text>
          <radio-group @change="handleGenderChange">
            <label class="radio-item">
              <radio value="none" :checked="formData.genderRequirement === 'none'" />
              <text>不限</text>
            </label>
            <label class="radio-item">
              <radio value="male" :checked="formData.genderRequirement === 'male'" />
              <text>男</text>
            </label>
            <label class="radio-item">
              <radio value="female" :checked="formData.genderRequirement === 'female'" />
              <text>女</text>
            </label>
          </radio-group>
        </view>
        
        <!-- 工作时间 -->
        <view class="form-item">
          <text class="label required">工作时间</text>
          <view class="time-range">
            <picker mode="date" :value="formData.startTime" :start="startDate" :end="endDate" @change="handleStartDateChange">
              <view class="form-input">
                <text class="text-gray">{{formData.startTime || '开始日期'}}</text>
                <text class="cuIcon-right"></text>
              </view>
            </picker>
            <text class="separator">至</text>
            <picker mode="date" :value="formData.endTime" :start="formData.startTime || startDate" :end="endDate" @change="handleEndDateChange">
              <view class="form-input">
                <text class="text-gray">{{formData.endTime || '结束日期'}}</text>
                <text class="cuIcon-right"></text>
              </view>
            </picker>
          </view>
        </view>
        
        <!-- 工作内容 -->
        <view class="form-item">
          <text class="label required">工作内容</text>
          <textarea v-model="formData.description" placeholder="请详细描述工作内容、要求等信息" />
        </view>
        
        <!-- 工作要求 -->
        <view class="form-item">
          <text class="label">工作要求</text>
          <textarea v-model="formData.requirements" placeholder="请输入工作要求（选填）" />
        </view>
        
        <!-- 工作环境图片 -->
        <view class="form-item">
          <text class="label">工作环境图片</text>
          <view class="image-uploader">
            <view class="image-list">
              <view class="image-item" v-for="(image, index) in formData.images" :key="index">
                <image :src="image" mode="aspectFill" @tap="previewImage(index)"></image>
                <text class="delete-btn" @tap="deleteImage(index)">×</text>
              </view>
              <view class="upload-btn" @tap="chooseImage" v-if="formData.images.length < 9">
                <text class="cuIcon-cameraadd"></text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 其他设置 -->
      <view class="form-section">
        <view class="section-title">其他设置</view>
        
        <!-- 结算方式 -->
        <view class="form-item">
          <text class="label required">结算方式</text>
          <view class="form-input" @tap="showPaymentTypePicker">
            <text class="text-gray">{{formData.paymentTypeLabel || '请选择结算方式'}}</text>
            <text class="cuIcon-right"></text>
          </view>
        </view>
        
        <!-- 是否支付劳务费 -->
        <view class="form-item">
          <text class="label">是否支付劳务费</text>
          <switch :checked="formData.payLabor === 'true'" @change="handlePayLaborChange" color="#8BC34A" />
        </view>
        
        <!-- 是否急招 -->
        <view class="form-item">
          <text class="label">是否急招</text>
          <switch :checked="formData.urgent === 'true'" @change="handleUrgentChange" color="#8BC34A" />
        </view>
        
        <!-- 是否热招 -->
        <view class="form-item">
          <text class="label">是否热招</text>
          <switch :checked="formData.hotJob === 'true'" @change="handleHotJobChange" color="#8BC34A" />
        </view>
        
        <!-- 发布类型 -->
        <view class="form-item">
          <text class="label required">发布类型</text>
          <radio-group @change="handlePublishTypeChange">
            <label class="radio-item">
              <radio value="personal" :checked="formData.publishType === 'personal'" />
              <text>个人发布</text>
            </label>
            <label class="radio-item">
              <radio value="company" :checked="formData.publishType === 'company'" />
              <text>企业发布</text>
            </label>
          </radio-group>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部发布按钮 -->
    <view class="bottom-bar">
      <button class="publish-btn" @tap="publishJob">发布工作</button>
    </view>
  </view>
</template>

<script>
import EmployerNavbar from '@/components/employer-navbar.vue'
import api from '@/api/index.js'

export default {
  components: {
    EmployerNavbar
  },
  data() {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const startDate = `${year}-${month}-${day}`
    const endDate = `${year + 5}-12-31`
    
    return {
      jobTypes: [], // 工作类型列表
      paymentTypes: [
        { label: '现金结算', value: 'cash' },
        { label: '在线支付', value: 'online' }
      ],
      startDate,
      endDate,
      selectedJobType: '', // 选中的工作类型名称
      formData: {
        title: '',              // 工作标题
        categoryId: '',         // 工作类型ID
        description: '',        // 工作描述
        salary: '',            // 工资
        salaryMin: '',         // 最低工资
        salaryMax: '',         // 最高工资
        workerCount: '',       // 招工人数
        location: '',          // 工作地点
        address: '',           // 详细地址
        addressDetail: '',     // 地址详情
        latitude: '',          // 纬度
        longitude: '',         // 经度
        genderRequirement: 'none', // 性别要求
        requirements: '',      // 工作要求
        startTime: '',         // 开始时间
        endTime: '',           // 结束时间
        payLabor: 'false',     // 是否支付劳务费
        paymentType: 'cash',   // 结算方式
        paymentTypeLabel: '现金结算', // 结算方式显示文本
        urgent: 'false',       // 是否急招
        hotJob: 'false',       // 是否热招
        publishType: 'personal', // 发布类型
        images: []             // 工作环境图片
      },
      salaryWarning: '', // 工资警告信息
      salaryValidation: {
        min: { value: 0, isValid: false },
        max: { value: 0, isValid: false }
      }
    }
  },
  onLoad() {
    this.getJobTypes()
    // 监听日期选择事件
    uni.$on('dateSelected', this.handleDateSelected)
  },
  onUnload() {
    // 移除事件监听
    uni.$off('dateSelected', this.handleDateSelected)
  },
  methods: {
    // 获取工作类型列表
    async getJobTypes() {
      try {
        const res = await api.getCategories()
        if (res.code === 0) {
          this.jobTypes = res.data
        }
      } catch (error) {
        console.error('获取工作类型失败', error)
      }
    },
    
    // 显示工作类型选择器
    showJobTypePicker() {
      uni.showActionSheet({
        itemList: this.jobTypes.map(item => item.name),
        success: (res) => {
          const index = res.tapIndex
          this.selectedJobType = this.jobTypes[index].name
          this.formData.categoryId = this.jobTypes[index].id
        }
      })
    },
    
    // 处理性别选择
    handleGenderChange(e) {
      this.formData.genderRequirement = e.detail.value
    },
    
    // 处理开始日期变化
    handleStartDateChange(e) {
      this.formData.startTime = e.detail.value
      // 如果结束日期早于开始日期，则更新结束日期
      if (this.formData.endTime && this.formData.endTime < this.formData.startTime) {
        this.formData.endTime = this.formData.startTime
      }
    },
    
    // 处理结束日期变化
    handleEndDateChange(e) {
      this.formData.endTime = e.detail.value
    },
    
    // 显示结算方式选择器
    showPaymentTypePicker() {
      uni.showActionSheet({
        itemList: this.paymentTypes.map(item => item.label),
        success: (res) => {
          const index = res.tapIndex
          this.formData.paymentType = this.paymentTypes[index].value
          // 更新显示文本
          const selectedType = this.paymentTypes.find(item => item.value === this.formData.paymentType)
          if (selectedType) {
            this.formData.paymentTypeLabel = selectedType.label
          }
        }
      })
    },
    
    // 处理劳务费开关
    handlePayLaborChange(e) {
      this.formData.payLabor = e.detail.value ? 'true' : 'false'
    },
    
    // 处理急招开关
    handleUrgentChange(e) {
      this.formData.urgent = e.detail.value ? 'true' : 'false'
    },
    
    // 处理热招开关
    handleHotJobChange(e) {
      this.formData.hotJob = e.detail.value ? 'true' : 'false'
    },
    
    // 处理发布类型选择
    handlePublishTypeChange(e) {
      this.formData.publishType = e.detail.value
    },
    
    // 生成随机经纬度
    generateRandomLocation() {
      // 厦门市的大致经纬度范围
      const xiamenBounds = {
        minLat: 24.4,
        maxLat: 24.6,
        minLng: 118.0,
        maxLng: 118.2
      }
      
      // 生成随机经纬度
      const latitude = xiamenBounds.minLat + Math.random() * (xiamenBounds.maxLat - xiamenBounds.minLat)
      const longitude = xiamenBounds.minLng + Math.random() * (xiamenBounds.maxLng - xiamenBounds.minLng)
      
      return {
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6)
      }
    },
    
    // 选择位置
    chooseLocation() {
      // 生成随机位置
      const location = this.generateRandomLocation()
      
      // 模拟地址信息
      const addresses = [
        '厦门市思明区软件园二期',
        '厦门市湖里区高新技术园',
        '厦门市集美区软件园三期',
        '厦门市海沧区生物医药港',
        '厦门市同安区工业集中区'
      ]
      
      // 随机选择一个地址
      const randomAddress = addresses[Math.floor(Math.random() * addresses.length)]
      
      // 更新表单数据
      this.formData.location = randomAddress
      this.formData.address = randomAddress
      this.formData.latitude = location.latitude
      this.formData.longitude = location.longitude
      
      // 提示用户
      uni.showToast({
        title: '位置已选择',
        icon: 'success'
      })
    },
    
    // 选择图片
    async chooseImage() {
      try {
        const res = await uni.chooseImage({
          count: 9 - this.formData.images.length,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        })
        
        // 上传图片
        for (let tempFile of res.tempFilePaths) {
          const uploadRes = await api.uploadFile(tempFile)
          if (uploadRes.code === 0) {
            this.formData.images.push(uploadRes.data.url)
          }
        }
      } catch (error) {
        console.error('选择图片失败', error)
      }
    },
    
    // 预览图片
    previewImage(index) {
      uni.previewImage({
        urls: this.formData.images,
        current: index
      })
    },
    
    // 删除图片
    deleteImage(index) {
      this.formData.images.splice(index, 1)
    },
    
    // 发布工作
    publishJob() {
      if (!this.validateForm()) return
      
      uni.showLoading({
        title: '发布中...'
      })
      
      // 处理图片列表
      let imagesStr = ''
      if (this.formData.images && this.formData.images.length > 0) {
        imagesStr = this.formData.images.join(',')
      }
      
      // 构建请求数据
      const requestData = {
        title: this.formData.title || '',
        categoryId: parseInt(this.formData.categoryId),
        description: this.formData.description || '',
        salary: parseFloat(this.formData.salary) || 0,
        salaryMin: parseFloat(this.formData.salaryMin) || 0,
        salaryMax: parseFloat(this.formData.salaryMax) || 0,
        workerCount: parseInt(this.formData.workerCount) || 1,
        location: this.formData.location || '',
        address: this.formData.address || '',
        addressDetail: this.formData.addressDetail || '',
        latitude: parseFloat(this.formData.latitude) || 0,
        longitude: parseFloat(this.formData.longitude) || 0,
        genderRequirement: this.formData.genderRequirement || 'none',
        requirements: this.formData.requirements || '',
        startTime: this.formData.startTime || '',
        endTime: this.formData.endTime || '',
        paymentType: this.formData.paymentType || 'cash',
        payLabor: this.formData.payLabor || 'false',
        urgent: this.formData.urgent || 'false',
        hotJob: this.formData.hotJob || 'false',
        publishType: this.formData.publishType || 'personal',
        images: imagesStr
      }
      
      console.log('发送的数据:', requestData) // 添加日志
      
      api.publishJob(requestData).then(response => {
        if (response.code === 0) {
          uni.showToast({
            title: '发布成功',
            icon: 'success'
          })
          
          // 延迟返回上一页
          setTimeout(() => {
            uni.navigateBack()
          }, 5000)
        } else {
          uni.showToast({
            title: response.message || '发布失败',
            icon: 'none'
          })
        }
      }).catch(error => {
        console.error('发布工作失败', error)
        uni.showToast({
          title: error.message || '发布失败',
          icon: 'none'
        })
      }).finally(() => {
        uni.hideLoading()
      })
    },
    
    // 验证表单
    validateForm() {
      if (!this.formData.title) {
        uni.showToast({
          title: '请选择工作类型',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.categoryId) {
        uni.showToast({
          title: '请选择工作类型',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.salaryMin || !this.formData.salaryMax) {
        uni.showToast({
          title: '请输入完整的工资范围',
          icon: 'none'
        })
        return false
      }
      if (!this.validateSalary('min') || !this.validateSalary('max')) {
        uni.showToast({
          title: this.salaryWarning || '工资范围输入有误',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.location) {
        uni.showToast({
          title: '请选择工作地点',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.description) {
        uni.showToast({
          title: '请输入工作内容',
          icon: 'none'
        })
        return false
      }
      return true
    },
    
    // 处理日期选择
    handleDateSelected(data) {
      if (data.type === 'start') {
        this.formData.startTime = data.date
      } else if (data.type === 'end') {
        this.formData.endTime = data.date
      }
    },
    
    // 处理工资输入
    handleSalaryInput(type) {
      const value = parseFloat(this.formData[`salary${type === 'min' ? 'Min' : 'Max'}`]) || 0
      
      // 更新验证状态
      this.salaryValidation[type].value = value
      
      // 清除警告信息
      this.salaryWarning = ''
      
      // 计算平均工资
      this.calculateAverageSalary()
    },
    
    // 验证工资
    validateSalary(type) {
      const min = parseFloat(this.formData.salaryMin) || 0
      const max = parseFloat(this.formData.salaryMax) || 0
      
      // 验证最低工资
      if (type === 'min') {
        if (min <= 0) {
          this.salaryWarning = '最低工资必须大于0'
          this.salaryValidation.min.isValid = false
          return false
        }
        if (max > 0 && min > max) {
          this.salaryWarning = '最低工资不能大于最高工资'
          this.salaryValidation.min.isValid = false
          return false
        }
        this.salaryValidation.min.isValid = true
      }
      
      // 验证最高工资
      if (type === 'max') {
        if (max <= 0) {
          this.salaryWarning = '最高工资必须大于0'
          this.salaryValidation.max.isValid = false
          return false
        }
        if (min > 0 && min > max) {
          this.salaryWarning = '最高工资不能小于最低工资'
          this.salaryValidation.max.isValid = false
          return false
        }
        this.salaryValidation.max.isValid = true
      }
      
      return true
    },
    
    // 计算平均工资
    calculateAverageSalary() {
      const min = parseFloat(this.formData.salaryMin) || 0
      const max = parseFloat(this.formData.salaryMax) || 0
      
      // 如果最低工资大于0，就显示最低工资作为临时平均工资
      if (min > 0) {
        if (max > 0) {
          // 如果最高工资也大于0，则计算平均值
          this.formData.salary = ((min + max) / 2).toFixed(2)
        } else {
          // 如果最高工资为0，则显示最低工资
          this.formData.salary = min.toFixed(2)
        }
      } else {
        // 如果最低工资为0，则清空平均工资
        this.formData.salary = ''
      }
    }
  }
}
</script>

<style lang="scss">
.job-post-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-top: 90rpx;
  padding-bottom: 120rpx;
  
  .form-container {
    height: calc(100vh - 90rpx - 120rpx);
  }
  
  .form-section {
    background-color: #FFFFFF;
    margin-bottom: 20rpx;
    padding: 30rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 30rpx;
    }
    
    .form-item {
      margin-bottom: 30rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
        
        &.required::before {
          content: '*';
          color: #FF5722;
          margin-right: 8rpx;
        }
      }
      
      input, textarea {
        width: 100%;
        height: 80rpx;
        background-color: #F5F5F5;
        border-radius: 8rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
      }
      
      textarea {
        height: 200rpx;
        padding: 20rpx;
      }
      
      .form-input {
        height: 80rpx;
        background-color: #F5F5F5;
        border-radius: 8rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .text-gray {
          color: #666;
        }
        
        .cuIcon-right {
          color: #999;
          font-size: 32rpx;
        }
      }
      
      .radio-group {
        display: flex;
        flex-wrap: wrap;
        
        .radio-item {
          margin-right: 40rpx;
          margin-bottom: 20rpx;
          display: flex;
          align-items: center;
          
          radio {
            transform: scale(0.8);
            margin-right: 8rpx;
          }
          
          text {
            font-size: 28rpx;
            color: #333;
          }
        }
      }
      
      .salary-range {
        display: flex;
        align-items: center;
        
        .salary-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          background-color: #F5F5F5;
          border-radius: 8rpx;
          padding: 0 20rpx;
          
          input {
            flex: 1;
            height: 80rpx;
            font-size: 28rpx;
          }
          
          .unit {
            font-size: 28rpx;
            color: #666;
            margin-left: 10rpx;
          }
        }
        
        .separator {
          margin: 0 20rpx;
          color: #666;
        }
      }
      
      .salary-info {
        margin-top: 10rpx;
        
        .salary-tip {
          font-size: 24rpx;
          color: #666;
        }
        
        .salary-warning {
          font-size: 24rpx;
          color: #FF5722;
          margin-left: 20rpx;
        }
      }
      
      .time-range {
        display: flex;
        align-items: center;
        
        .form-input {
          flex: 1;
        }
        
        .separator {
          margin: 0 20rpx;
          color: #666;
        }
      }
      
      .image-uploader {
        .image-list {
          display: flex;
          flex-wrap: wrap;
          
          .image-item {
            width: 200rpx;
            height: 200rpx;
            margin-right: 20rpx;
            margin-bottom: 20rpx;
            position: relative;
            
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
              font-size: 32rpx;
            }
          }
          
          .upload-btn {
            width: 200rpx;
            height: 200rpx;
            background-color: #F5F5F5;
            border-radius: 8rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .cuIcon-cameraadd {
              font-size: 60rpx;
              color: #999;
            }
          }
        }
      }
    }
  }
  
  .bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 120rpx;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 30rpx;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .publish-btn {
      width: 100%;
      height: 80rpx;
      background-color: #8BC34A;
      color: #FFFFFF;
      font-size: 32rpx;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style> 