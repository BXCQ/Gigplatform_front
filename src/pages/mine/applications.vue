<template>
  <view class="applications-container">
    <!-- 自定义导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @tap="goBack">
        <text class="cuIcon-back"></text>
      </view>
      <view class="nav-title">我的申请</view>
      <view class="nav-right"></view>
    </view>
    
    <!-- 状态筛选 -->
    <scroll-view scroll-x class="bg-white nav">
      <view class="flex text-center">
        <view class="cu-item flex-sub" 
          :class="currentStatus === 'all' ? 'text-blue cur' : ''" 
          @tap="changeStatus('all')">
          全部
        </view>
        <view class="cu-item flex-sub" 
          :class="currentStatus === 'pending' ? 'text-blue cur' : ''" 
          @tap="changeStatus('pending')">
          待处理
        </view>
        <view class="cu-item flex-sub" 
          :class="currentStatus === 'accepted' ? 'text-blue cur' : ''" 
          @tap="changeStatus('accepted')">
          已通过
        </view>
        <view class="cu-item flex-sub" 
          :class="currentStatus === 'rejected' ? 'text-blue cur' : ''" 
          @tap="changeStatus('rejected')">
          未通过
        </view>
        <view class="cu-item flex-sub" 
          :class="currentStatus === 'completed' ? 'text-blue cur' : ''" 
          @tap="changeStatus('completed')">
          已完成
        </view>
      </view>
    </scroll-view>
    
    <!-- 申请列表 -->
    <view class="applications-list" v-if="filteredApplications.length > 0">
      <view class="application-item" v-for="(item, index) in filteredApplications" :key="index" @tap="viewDetail(item)">
        <view class="application-header">
          <view class="job-title">{{item.jobTitle}}</view>
          <view class="application-status" :class="statusClassMap[item.status]">{{getStatusText(item.status)}}</view>
        </view>
        
        <view class="application-info">
          <view class="info-row">
            <text class="info-label">工作薪资：</text>
            <text class="info-value text-red">{{item.salary}}</text>
          </view>
          <view class="info-row">
            <text class="info-label">工作地点：</text>
            <text class="info-value">{{item.location}}</text>
          </view>
          <view class="info-row">
            <text class="info-label">招聘人数：</text>
            <text class="info-value">{{item.peopleCount}}人</text>
          </view>
          <view class="info-row">
            <text class="info-label">工作时间：</text>
            <text class="info-value">{{item.workTime}}</text>
          </view>
        </view>
        
        <view class="application-footer">
          <view class="apply-time">申请时间：{{item.applyTime}}</view>
          <view class="action-btns">
            <button class="action-btn" v-if="item.status === 'accepted'" @tap.stop="contactEmployer(item)">联系雇主</button>
            <button class="action-btn" v-if="item.status === 'pending'" @tap.stop="cancelApplication(item)">取消申请</button>
            <button class="action-btn" v-if="item.status === 'completed'" @tap.stop="viewEvaluation(item)">查看评价</button>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <image src="/static/img/empty-task.png" mode="aspectFit"></image>
      <view class="empty-text">暂无申请记录</view>
      <button class="find-job-btn" @tap="findJobs">去找工作</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentStatus: 'all',
      statusClassMap: {
        'pending': 'status-pending',
        'accepted': 'status-accepted',
        'rejected': 'status-rejected',
        'completed': 'status-completed'
      },
      applications: [
        {
          id: '1',
          jobTitle: '朴朴配送员',
          status: 'pending',
          salary: '3.10元/单',
          location: '福建省厦门市翔安区马巷街道香西路315-6号',
          peopleCount: 20,
          workTime: '2025/04/17 11:06 - 2025/05/17 11:06',
          applyTime: '2025/04/18 09:30',
          employerContact: '13800138000'
        },
        {
          id: '2',
          jobTitle: '家庭保洁',
          status: 'accepted',
          salary: '180元/天',
          location: '思明区莲前东路',
          peopleCount: 2,
          workTime: '2025/04/20 08:00 - 2025/04/20 18:00',
          applyTime: '2025/04/15 14:22',
          employerContact: '13900139000'
        },
        {
          id: '3',
          jobTitle: '酒店服务员',
          status: 'rejected',
          salary: '220元/天',
          location: '湖里区高林中路',
          peopleCount: 5,
          workTime: '2025/04/10 09:00 - 2025/04/11 17:00',
          applyTime: '2025/04/05 16:48',
          employerContact: '15800158000'
        },
        {
          id: '4',
          jobTitle: '仓库理货员',
          status: 'completed',
          salary: '200元/天',
          location: '集美区杏林湾路',
          peopleCount: 10,
          workTime: '2025/03/15 08:00 - 2025/03/16 18:00',
          applyTime: '2025/03/10 11:36',
          employerContact: '15900159000',
          evaluation: '工作认真负责，效率高，很好的工作态度。'
        }
      ]
    }
  },
  computed: {
    filteredApplications() {
      if (this.currentStatus === 'all') {
        return this.applications;
      } else {
        return this.applications.filter(item => item.status === this.currentStatus);
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    
    changeStatus(status) {
      this.currentStatus = status;
    },
    
    getStatusText(status) {
      const statusMap = {
        'pending': '待处理',
        'accepted': '已通过',
        'rejected': '未通过',
        'completed': '已完成'
      };
      return statusMap[status] || '未知状态';
    },
    
    viewDetail(item) {
      uni.navigateTo({
        url: `/pages/jobDetail/jobDetail?id=${item.id}`
      });
    },
    
    contactEmployer(item) {
      uni.makePhoneCall({
        phoneNumber: item.employerContact,
        success: () => {
          console.log('拨打电话成功');
        },
        fail: () => {
          console.log('拨打电话失败');
        }
      });
    },
    
    cancelApplication(item) {
      uni.showModal({
        title: '取消申请',
        content: '确定要取消此申请吗？',
        success: (res) => {
          if (res.confirm) {
            // 这里应该有实际的取消逻辑
            const index = this.applications.findIndex(app => app.id === item.id);
            if (index !== -1) {
              this.applications.splice(index, 1);
              
              uni.showToast({
                title: '已取消申请',
                icon: 'success'
              });
            }
          }
        }
      });
    },
    
    viewEvaluation(item) {
      if (item.evaluation) {
        uni.showModal({
          title: '雇主评价',
          content: item.evaluation,
          showCancel: false
        });
      } else {
        uni.showToast({
          title: '暂无评价',
          icon: 'none'
        });
      }
    },
    
    findJobs() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }
  }
}
</script>

<style lang="scss">
.applications-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 20rpx;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 90rpx;
  padding: 0 30rpx;
  background-color: #FFFFFF;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .nav-left {
    font-size: 40rpx;
  }
  
  .nav-title {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .nav-right {
    width: 40rpx;
  }
}

/* 状态筛选 */
.nav {
  white-space: nowrap;
  height: 90rpx;
  
  .cu-item {
    height: 90rpx;
    font-size: 28rpx;
    position: relative;
    
    &.cur {
      font-weight: bold;
      
      &::after {
        content: "";
        width: 40rpx;
        height: 6rpx;
        border-radius: 20rpx;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
  }
}

/* 申请列表 */
.applications-list {
  padding: 20rpx;
  
  .application-item {
    background-color: #FFFFFF;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .application-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .job-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
      
      .application-status {
        padding: 6rpx 20rpx;
        border-radius: 30rpx;
        font-size: 24rpx;
        
        &.status-pending {
          background-color: #FFF3E0;
          color: #FF9800;
        }
        
        &.status-accepted {
          background-color: #E8F5E9;
          color: #4CAF50;
        }
        
        &.status-rejected {
          background-color: #FFEBEE;
          color: #F44336;
        }
        
        &.status-completed {
          background-color: #ECEFF1;
          color: #607D8B;
        }
      }
    }
    
    .application-info {
      margin-bottom: 20rpx;
      
      .info-row {
        display: flex;
        margin-bottom: 10rpx;
        font-size: 28rpx;
        
        .info-label {
          width: 150rpx;
          color: #999999;
        }
        
        .info-value {
          flex: 1;
          color: #333333;
          
          &.text-red {
            color: #F44336;
            font-weight: bold;
          }
        }
      }
    }
    
    .application-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20rpx;
      border-top: 1rpx solid #EEEEEE;
      
      .apply-time {
        font-size: 24rpx;
        color: #999999;
      }
      
      .action-btns {
        display: flex;
        
        .action-btn {
          height: 60rpx;
          line-height: 60rpx;
          font-size: 24rpx;
          margin-left: 20rpx;
          padding: 0 30rpx;
          border-radius: 30rpx;
          background-color: #4C68FF;
          color: #FFFFFF;
        }
      }
    }
  }
}

/* 空状态 */
.empty-state {
  padding: 100rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999999;
    margin-bottom: 40rpx;
  }
  
  .find-job-btn {
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #4C68FF;
    color: #FFFFFF;
    font-size: 28rpx;
    border-radius: 40rpx;
  }
}
</style> 