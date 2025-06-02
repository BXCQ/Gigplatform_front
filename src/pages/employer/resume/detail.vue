<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="cu-custom">
      <view class="cu-bar fixed bg-gradient-green" style="height:90rpx;">
        <view class="action" @tap="goBack">
          <text class="cuIcon-back text-white"></text>
          <text class="text-white">返回</text>
        </view>
        <view class="content text-white">零工简历</view>
        <view class="action">
          <text class="cuIcon-share text-white" @tap="shareResume"></text>
        </view>
      </view>
    </view>
    
    <!-- 加载状态 -->
    <view class="loading-container" v-if="loading">
      <view class="cu-load loading"></view>
    </view>
    
    <block v-else>
      <!-- 个人信息卡片 -->
      <view class="user-card">
        <view class="user-info-row">
          <view class="left-section">
            <view class="user-name">{{resumeInfo.username}}</view>
            <view class="user-basic">{{resumeInfo.gender === 'male' ? '男' : '女'}} · {{resumeInfo.age}}岁 · {{resumeInfo.education}}</view>
            <!-- 评分和认证 -->
            <view class="user-stats">
              <view class="stat-item" v-if="resumeInfo.rating > 0">
                <text class="cuIcon-favor text-yellow"></text>
                <text>{{resumeInfo.rating.toFixed(1)}}</text>
              </view>
              <view class="stat-item" v-if="resumeInfo.certificationCount > 0">
                <text class="cuIcon-roundcheckfill text-green"></text>
                <text>已认证({{resumeInfo.certificationCount}})</text>
              </view>
              <view class="stat-item" v-if="resumeInfo.hasInsurance === '1'">
                <text class="cuIcon-safe text-blue"></text>
                <text>已投保</text>
              </view>
              <view class="stat-item" v-if="resumeInfo.jobsCompleted > 0">
                <text class="cuIcon-check text-green"></text>
                <text>已完成{{resumeInfo.jobsCompleted}}单</text>
              </view>
            </view>
          </view>
          <view class="avatar-wrap">
            <image class="avatar" :src="resumeInfo.avatar || '/static/img/default-avatar.png'" mode="aspectFill"></image>
            <view class="gender-tag" :class="resumeInfo.gender === 'male' ? 'male' : 'female'">
              <text :class="resumeInfo.gender === 'male' ? 'cuIcon-male' : 'cuIcon-female'"></text>
            </view>
          </view>
        </view>
        
        <!-- 时薪信息 -->
        <view class="hourly-rate" v-if="resumeInfo.hourlyRate > 0">
          <text class="rate">¥ {{resumeInfo.hourlyRate}}</text>
          <text class="unit">/小时</text>
        </view>
        
        <!-- 技能标签 -->
        <view class="user-tags">
          <view class="tag-item" v-for="(skill, index) in skillsList" :key="index">{{skill}}</view>
          <view class="tag-item">{{resumeInfo.availability}}</view>
        </view>
      </view>
      
      <!-- 简历内容 -->
      <view class="resume-content">
        <!-- 从事工种 -->
        <view class="section">
          <view class="section-header">
            <view class="section-line bg-blue"></view>
            <text class="section-title">从事工种</text>
          </view>
          <view class="section-content">
            <text>{{resumeInfo.skills}}</text>
          </view>
        </view>
        
        <!-- 工作区域 -->
        <view class="section">
          <view class="section-header">
            <view class="section-line bg-blue"></view>
            <text class="section-title">可工作时间</text>
          </view>
          <view class="section-content">
            <text>{{resumeInfo.availability}}</text>
          </view>
        </view>
        
        <!-- 工作经验 -->
        <view class="section">
          <view class="section-header">
            <view class="section-line bg-blue"></view>
            <text class="section-title">工作经验</text>
          </view>
          <view class="section-content">
            <text>{{resumeInfo.experience || '暂未填写'}}</text>
          </view>
        </view>
        
        <!-- 认证信息 -->
        <view class="section" v-if="resumeInfo.certificationStatus">
          <view class="section-header">
            <view class="section-line bg-blue"></view>
            <text class="section-title">认证信息</text>
          </view>
          <view class="section-content">
            <view class="cert-item">
              <text class="label">认证状态：</text>
              <text :class="{'text-green': resumeInfo.certificationStatus === 'verified'}">
                {{resumeInfo.certificationStatus === 'verified' ? '已认证' : '未认证'}}
              </text>
            </view>
            <view class="cert-item" v-if="resumeInfo.certificationCount > 0">
              <text class="label">认证数量：</text>
              <text>{{resumeInfo.certificationCount}}个</text>
            </view>
            <view class="cert-item" v-if="resumeInfo.hasInsurance === '1'">
              <text class="label">保险状态：</text>
              <text class="text-blue">已投保</text>
            </view>
          </view>
        </view>
        
        <!-- 工作统计 -->
        <view class="section">
          <view class="section-header">
            <view class="section-line bg-blue"></view>
            <text class="section-title">工作统计</text>
          </view>
          <view class="section-content">
            <view class="stat-grid">
              <view class="stat-item">
                <text class="num">{{resumeInfo.jobsCompleted}}</text>
                <text class="label">完成订单</text>
              </view>
              <view class="stat-item">
                <text class="num">{{resumeInfo.rating}}</text>
                <text class="label">综合评分</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 联系方式 -->
        <view class="section" v-if="resumeInfo.phone">
          <view class="section-header">
            <view class="section-line bg-blue"></view>
            <text class="section-title">联系方式</text>
          </view>
          <view class="section-content">
            <text>{{resumeInfo.phone}}</text>
          </view>
        </view>
      </view>
    </block>
    
    <!-- 底部操作按钮 -->
    <view class="bottom-actions">
      <view class="action-btn collect" @tap="collectResume">
        <text :class="isCollected ? 'cuIcon-favorfill text-orange' : 'cuIcon-favor'"></text>
        <text>{{isCollected ? '已收藏' : '收藏'}}</text>
      </view>
      <view class="action-btn recommend" @tap="recommendJob">
        <text>推单记录</text>
      </view>
      <view class="action-btn forward" @tap="forwardJob">
        <text>推单给Ta</text>
      </view>
    </view>
  </view>
</template>

<script>
import API from '@/api/index.js'

export default {
  data() {
    return {
      id: '',
      resumeInfo: {},
      loading: true,
      isCollected: false
    }
  },
  computed: {
    skillsList() {
      return this.resumeInfo.skills ? this.resumeInfo.skills.split(',') : [];
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      this.loadResumeDetail();
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },
    
    loadResumeDetail() {
      this.loading = true;
      // 调用API获取零工详情
      API.getWorkerDetail(this.id).then(response => {
        if (response && response.code === 0 && response.data) {
          this.resumeInfo = response.data;
        } else {
          uni.showToast({
            title: '获取零工信息失败',
            icon: 'none'
          });
        }
      }).catch(error => {
        console.error('获取零工详情失败:', error);
        uni.showToast({
          title: '获取零工信息失败',
          icon: 'none'
        });
      }).finally(() => {
        this.loading = false;
      });
    },
    
    collectResume() {
      this.isCollected = !this.isCollected;
      uni.showToast({
        title: this.isCollected ? '收藏成功' : '已取消收藏',
        icon: 'success'
      });
    },
    
    recommendJob() {
      uni.showToast({
        title: '查看推单记录',
        icon: 'none'
      });
      // 可以跳转到对应页面
      // uni.navigateTo({
      //   url: `/pages/employer/recommend/list?workerId=${this.id}`
      // });
    },
    
    forwardJob() {
      uni.navigateTo({
        url: `/pages/employer/jobForward?workerId=${this.id}`
      });
    },
    
    shareResume() {
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      });
    }
  }
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
  padding-top: 90rpx;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200rpx;
}

.cu-custom {
  .cu-bar {
    min-height: 90rpx;
    
    .action {
      display: flex;
      align-items: center;
      
      .cuIcon-back {
        margin-right: 6rpx;
      }
    }
  }
}

.user-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  margin: 30rpx 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  
  .user-info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    .left-section {
      flex: 1;
      
      .user-name {
        font-size: 36rpx;
        font-weight: bold;
        color: #333333;
      }
      
      .user-basic {
        font-size: 28rpx;
        color: #666666;
        margin-top: 10rpx;
      }
      
      .user-stats {
        display: flex;
        flex-wrap: wrap;
        margin-top: 15rpx;
        
        .stat-item {
          display: flex;
          align-items: center;
          margin-right: 20rpx;
          margin-bottom: 10rpx;
          padding: 4rpx 12rpx;
          background-color: rgba(0,0,0,0.03);
          border-radius: 8rpx;
          font-size: 24rpx;
          color: #666666;
          
          text {
            &:first-child {
              margin-right: 6rpx;
            }
          }
        }
      }
    }
    
    .avatar-wrap {
      position: relative;
      margin-left: 30rpx;
      
      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        background-color: #FFFFFF;
        border: 4rpx solid #F5F5F5;
      }
      
      .gender-tag {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.female {
          background-color: #FF6699;
        }
        
        &.male {
          background-color: #1E90FF;
        }
        
        .cuIcon-female, .cuIcon-male {
          color: #FFFFFF;
          font-size: 24rpx;
        }
      }
    }
  }
  
  .hourly-rate {
    margin: 20rpx 0;
    
    .rate {
      font-size: 36rpx;
      font-weight: bold;
      color: #FF5722;
    }
    
    .unit {
      font-size: 24rpx;
      color: #999;
      margin-left: 4rpx;
    }
  }
  
  .user-tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20rpx;
    
    .tag-item {
      padding: 6rpx 20rpx;
      background-color: #F0F8FF;
      color: #1976D2;
      font-size: 24rpx;
      border-radius: 30rpx;
      margin-right: 20rpx;
      margin-bottom: 10rpx;
    }
  }
}

.resume-content {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  margin: 0 20rpx 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  
  .section {
    padding: 30rpx;
    
    &:not(:last-child) {
      border-bottom: 1rpx solid #F5F5F5;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      
      .section-line {
        width: 6rpx;
        height: 30rpx;
        margin-right: 20rpx;
        border-radius: 3rpx;
      }
      
      .section-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #333333;
      }
    }
    
    .section-content {
      padding-left: 26rpx;
      font-size: 28rpx;
      color: #666666;
      line-height: 1.5;
    }
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  display: flex;
  background-color: #FFFFFF;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .action-btn {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    
    &.collect {
      background-color: #FFFFFF;
      color: #999999;
      width: 25%;
      flex-direction: column;
      font-size: 24rpx;
      
      .cuIcon-favor, .cuIcon-favorfill {
        font-size: 36rpx;
        margin-bottom: 6rpx;
      }
      
      .text-orange {
        color: #FF9800;
      }
    }
    
    &.recommend {
      background-color: #E53935;
      flex: 1;
      color: #FFFFFF;
    }
    
    &.forward {
      background-color: #2196F3;
      flex: 1;
      color: #FFFFFF;
    }
  }
}

.cert-item {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
  
  .label {
    color: #666;
    margin-right: 20rpx;
  }
  
  .text-green {
    color: #4CAF50;
  }
  
  .text-blue {
    color: #2196F3;
  }
}

.stat-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 20rpx 0;
  
  .stat-item {
    width: 25%;
    text-align: center;
    padding: 20rpx 0;
    
    .num {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      display: block;
    }
    
    .label {
      font-size: 24rpx;
      color: #666;
      margin-top: 10rpx;
      display: block;
    }
  }
}
</style> 