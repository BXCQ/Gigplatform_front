<template>
  <view class="detail-container">
    <!-- 自定义导航栏 -->
	<cu-custom bgColor="bg-gradient-green " isBack>
	  <block slot="content">{{ pageTitle }}</block>
	</cu-custom>
    
    <!-- 菜单项 -->
    <scroll-view scroll-x class="bg-white nav solid-bottom">
      <view class="flex text-center">
        <view class="cu-item flex-sub" :class="currentStatus === 'pending' ? 'text-blue cur' : ''" @tap="changeStatus('pending')">
          待确认
        </view>
        <view class="cu-item flex-sub" :class="currentStatus === 'accepted' ? 'text-blue cur' : ''" @tap="changeStatus('accepted')">
          已接单
        </view>
        <view class="cu-item flex-sub" :class="currentStatus === 'ongoing' ? 'text-blue cur' : ''" @tap="changeStatus('ongoing')">
          服务中
        </view>
        <view class="cu-item flex-sub" :class="currentStatus === 'completed' ? 'text-blue cur' : ''" @tap="changeStatus('completed')">
          已完成
        </view>
        <view class="cu-item flex-sub" :class="currentStatus === 'canceled' ? 'text-blue cur' : ''" @tap="changeStatus('canceled')">
          已取消
        </view>
      </view>
    </scroll-view>
    
    <!-- 空状态提示 -->
    <view class="empty-state" v-if="jobList.length === 0">
      <image src="/static/img/empty-task.png" mode="aspectFit"></image>
      <view class="empty-text">没有更多数据了</view>
    </view>
    
    <!-- 任务列表 -->
    <view class="job-list" v-else>
      <view class="job-item" v-for="(job, index) in jobList" :key="index" @tap="goToDetail(job)">
        <!-- 岗位信息卡片 -->
        <view class="job-card">
          <!-- 卡片头部信息 -->
          <view class="job-header">
            <view class="time-range">{{ job.timeRange }}</view>
            <view class="salary">{{ job.salary }}</view>
          </view>
          
          <!-- 岗位详情 -->
          <view class="job-detail">
            <view class="job-title">{{ job.title }}</view>
            <view class="job-tag-list">
              <view class="job-tag" v-if="job.requiredCount">招{{ job.requiredCount }}人</view>
              <view class="job-tag" v-if="job.gender !== 'none'">{{ job.gender === 'male' ? '只要男性' : '只要女性' }}</view>
              <view class="job-tag">{{ job.jobType }}</view>
            </view>
          </view>
          
          <!-- 岗位信息 -->
          <view class="job-info">
            <view class="info-item">
              <text class="label">工作时间:</text>
              <text class="value">{{ job.timeRange }}</text>
            </view>
            <view class="info-item">
              <text class="label">工作地址:</text>
              <text class="value">{{ job.address }}</text>
            </view>
            <view class="info-item" v-if="job.content">
              <text class="label">工作内容:</text>
              <text class="value">{{ job.content }}</text>
            </view>
          </view>
        </view>
          
        <!-- 底部按钮 -->
        <view class="job-actions">
          <view class="action-btn share" @tap.stop="shareJob(job)">
            <text class="cuIcon-share"></text>
            <text>分享</text>
          </view>
          <view class="action-btn status-update" @tap.stop="updateStatus(job)">
            {{ getActionText(job.status) }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type: '', // 页面类型: recruiting, reviewing, selecting, interviewing, completed
      currentStatus: 'pending',
      jobList: []
    }
  },
  computed: {
    pageTitle() {
      const titleMap = {
        'recruiting': '正在招工',
        'reviewing': '审核中',
        'selecting': '待选人',
        'interviewing': '待面试',
        'completed': '已完成'
      }
      return titleMap[this.type] || '岗位详情'
    }
  },
  onLoad(options) {
    if (options.type) {
      this.type = options.type
      this.loadJobList()
    }
  },
  methods: {
    // 加载岗位列表
    loadJobList() {
      // 模拟数据
      setTimeout(() => {
        this.jobList = [
          {
            id: '1',
            title: '车工 (女)',
            salary: '6500元/月',
            timeRange: '2025/05/09 00:00 - 2025/06/09 00:00',
            requiredCount: 2,
            gender: 'female',
            jobType: '普工',
            address: '集根路356号',
            content: '1、女性，有相关缝纫经验均可，根据经验岗位平车、高车、电脑车工、台包等岗位工作。厦门维发服饰有限公司(智能制造)，联系电话: 18030027221',
            status: 'pending'
          },
          {
            id: '2',
            title: '家电维修工',
            salary: '200元/天',
            timeRange: '2025/05/15 08:00 - 2025/05/15 17:00',
            requiredCount: 1,
            gender: 'male',
            jobType: '维修工',
            address: '思明区嘉莲街道45号',
            content: '负责空调、冰箱等大型家电的维修和保养服务，有2年以上相关工作经验',
            status: 'accepted'
          }
        ]
      }, 500)
    },
    
    // 切换状态标签
    changeStatus(status) {
      this.currentStatus = status
      // 这里应该重新加载相应状态的数据
    },
    
    // 查看详情
    goToDetail(job) {
      uni.navigateTo({
        url: `/pages/employer/jobs/jobDetail?id=${job.id}`
      })
    },
    
    // 分享岗位
    shareJob(job) {
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      })
    },
    
    // 更新岗位状态
    updateStatus(job) {
      const actionMap = {
        'pending': '确认接单',
        'accepted': '开始工作',
        'ongoing': '完成工作',
        'completed': '评价',
        'canceled': '重新发布'
      }
      
      uni.showToast({
        title: actionMap[job.status] || '操作',
        icon: 'none'
      })
    },
    
    // 获取操作按钮文字
    getActionText(status) {
      const actionMap = {
        'pending': '确认接单',
        'accepted': '开始工作',
        'ongoing': '完成工作',
        'completed': '评价服务',
        'canceled': '重新发布'
      }
      return actionMap[status] || '操作'
    }
  }
}
</script>

<style lang="scss">
.detail-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
  padding-top: 90rpx;
  
  .nav {
    background-color: #FFFFFF;
    height: 90rpx;
    white-space: nowrap;
    
    .cu-item {
      height: 90rpx;
      line-height: 90rpx;
      position: relative;
      
      &.cur::after {
        content: "";
        width: 40rpx;
        height: 6rpx;
        background-color: currentColor;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        border-radius: 10rpx;
      }
    }
  }
  
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
    }
  }
  
  .job-list {
    padding: 20rpx;
    
    .job-item {
      margin-bottom: 30rpx;
      border-radius: 12rpx;
      overflow: hidden;
      background-color: #FFFFFF;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
      
      .job-card {
        padding: 30rpx;
        
        .job-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20rpx;
          
          .time-range {
            color: #666666;
            font-size: 24rpx;
          }
          
          .salary {
            color: #FF9800;
            font-weight: bold;
            font-size: 32rpx;
          }
        }
        
        .job-detail {
          margin-bottom: 20rpx;
          
          .job-title {
            font-size: 36rpx;
            font-weight: bold;
            color: #333333;
            margin-bottom: 15rpx;
          }
          
          .job-tag-list {
            display: flex;
            flex-wrap: wrap;
            
            .job-tag {
              background-color: #F2F7FF;
              color: #4169E1;
              font-size: 24rpx;
              padding: 8rpx 16rpx;
              border-radius: 20rpx;
              margin-right: 16rpx;
              margin-bottom: 10rpx;
            }
          }
        }
        
        .job-info {
          background-color: #F9F9F9;
          padding: 20rpx;
          border-radius: 10rpx;
          
          .info-item {
            display: flex;
            margin-bottom: 10rpx;
            
            .label {
              width: 160rpx;
              color: #999999;
              font-size: 28rpx;
            }
            
            .value {
              flex: 1;
              color: #333333;
              font-size: 28rpx;
            }
          }
        }
      }
      
      .job-actions {
        display: flex;
        border-top: 1rpx solid #EEEEEE;
        
        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100rpx;
          font-size: 28rpx;
          
          &.share {
            border-right: 1rpx solid #EEEEEE;
            color: #999999;
            
            .cuIcon-share {
              margin-right: 10rpx;
            }
          }
          
          &.status-update {
            color: #4169E1;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style> 