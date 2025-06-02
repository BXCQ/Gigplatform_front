<template>
  <view class="job-manage-container">
    <!-- 自定义导航栏 -->
    <nav-bar title="岗位管理" :showBack="true"></nav-bar>
    
    <!-- 岗位状态筛选Tab -->
    <view class="status-tabs">
      <view class="tab-item" 
        v-for="(tab, index) in tabs" 
        :key="index" 
        :class="{ active: activeTab === index }"
        @click="switchTab(index)">
        <text>{{ tab.name }}</text>
        <view class="tab-badge" v-if="tab.count > 0">{{ tab.count }}</view>
      </view>
    </view>
    
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <uni-icons type="search" size="18" color="#999"></uni-icons>
        <input type="text" placeholder="搜索岗位名称" v-model="searchText" @confirm="searchJobs" />
      </view>
      <view class="filter-btn" @click="showFilterPopup">
        <uni-icons type="filter" size="18" color="#666"></uni-icons>
        <text>筛选</text>
      </view>
    </view>
    
    <!-- 岗位列表 -->
    <view class="job-list" v-if="filteredJobs.length > 0">
      <view class="job-item" v-for="(job, index) in filteredJobs" :key="index">
        <view class="job-header" @click="gotoJobDetail(job)">
          <view class="job-title">{{ job.title }}</view>
          <view class="job-status" :class="job.statusClass">{{ job.statusText }}</view>
        </view>
        
        <view class="job-info">
          <view class="info-item">
            <text class="label">工作地区：</text>
            <text>{{ job.location }}</text>
          </view>
          <view class="info-item">
            <text class="label">薪资待遇：</text>
            <text class="salary">{{ job.salary }}</text>
          </view>
          <view class="info-item">
            <text class="label">发布时间：</text>
            <text>{{ job.publishTime }}</text>
          </view>
        </view>
        
        <view class="job-stats">
          <view class="stat-item">
            <text class="stat-num">{{ job.viewCount }}</text>
            <text class="stat-label">浏览</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">{{ job.applyCount }}</text>
            <text class="stat-label">申请</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">{{ job.hiredCount }}</text>
            <text class="stat-label">已雇佣</text>
          </view>
        </view>
        
        <view class="job-actions">
          <button class="action-btn" v-if="job.status === 'pending'" @click="updateJobStatus(job.id, 'published')">通过审核</button>
          <button class="action-btn promote-btn" v-if="job.status === 'published'" @click="promoteJob(job)">推广</button>
          <button class="action-btn" v-if="job.status === 'published'" @click="pauseJob(job)">暂停</button>
          <button class="action-btn" v-if="job.status === 'paused'" @click="resumeJob(job)">恢复</button>
          <button class="action-btn primary-btn" v-if="job.status === 'published' || job.status === 'paused'" @click="viewApplicants(job)">查看申请</button>
          <button class="action-btn" v-if="job.status !== 'expired'" @click="editJob(job)">编辑</button>
          <button class="action-btn delete-btn" @click="confirmDeleteJob(job)">删除</button>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <image src="/static/img/icons/empty.png" mode="aspectFit"></image>
      <text>暂无岗位信息</text>
      <button class="post-btn" @click="gotoPostJob">立即发布岗位</button>
    </view>
    
    <!-- 筛选弹窗 -->
    <uni-popup ref="filterPopup" type="bottom">
      <view class="filter-popup">
        <view class="popup-header">
          <text>岗位筛选</text>
          <view class="close-btn" @click="hideFilterPopup">×</view>
        </view>
        
        <view class="filter-section">
          <view class="section-title">发布时间</view>
          <view class="filter-options">
            <view class="option" 
              v-for="(option, index) in timeFilters" 
              :key="index"
              :class="{ active: filters.timeRange === option.value }"
              @click="selectTimeFilter(option.value)">
              {{ option.label }}
            </view>
          </view>
        </view>
        
        <view class="filter-section">
          <view class="section-title">薪资范围</view>
          <view class="filter-options">
            <view class="option" 
              v-for="(option, index) in salaryFilters" 
              :key="index"
              :class="{ active: filters.salaryRange === option.value }"
              @click="selectSalaryFilter(option.value)">
              {{ option.label }}
            </view>
          </view>
        </view>
        
        <view class="filter-actions">
          <button class="reset-btn" @click="resetFilters">重置</button>
          <button class="confirm-btn" @click="applyFilters">确定</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0,
      searchText: '',
      tabs: [
        { name: '全部', count: 8 },
        { name: '已发布', count: 5 },
        { name: '审核中', count: 1 },
        { name: '已暂停', count: 1 },
        { name: '已过期', count: 1 }
      ],
      jobs: [
        {
          id: '1',
          title: '外卖骑手',
          status: 'published',
          statusText: '已发布',
          statusClass: 'success',
          location: '思明区莲前街道',
          salary: '6000-8000元/月',
          publishTime: '2023-05-01',
          viewCount: 256,
          applyCount: 18,
          hiredCount: 3
        },
        {
          id: '2',
          title: '仓库理货员',
          status: 'published',
          statusText: '已发布',
          statusClass: 'success',
          location: '湖里区金山街道',
          salary: '150元/天',
          publishTime: '2023-05-05',
          viewCount: 180,
          applyCount: 12,
          hiredCount: 5
        },
        {
          id: '3',
          title: '快递分拣员',
          status: 'paused',
          statusText: '已暂停',
          statusClass: 'warning',
          location: '集美区杏林街道',
          salary: '4500-5500元/月',
          publishTime: '2023-04-20',
          viewCount: 198,
          applyCount: 15,
          hiredCount: 8
        },
        {
          id: '4',
          title: '商场导购员',
          status: 'pending',
          statusText: '审核中',
          statusClass: 'info',
          location: '思明区嘉莲街道',
          salary: '4000-5000元/月',
          publishTime: '2023-05-08',
          viewCount: 86,
          applyCount: 4,
          hiredCount: 0
        },
        {
          id: '5',
          title: '小区保安',
          status: 'expired',
          statusText: '已过期',
          statusClass: 'default',
          location: '湖里区金山街道',
          salary: '5000元/月',
          publishTime: '2023-03-15',
          viewCount: 310,
          applyCount: 25,
          hiredCount: 10
        }
      ],
      filters: {
        timeRange: '',
        salaryRange: ''
      },
      timeFilters: [
        { label: '全部', value: '' },
        { label: '今天', value: 'today' },
        { label: '近3天', value: '3days' },
        { label: '近一周', value: 'week' },
        { label: '近一月', value: 'month' }
      ],
      salaryFilters: [
        { label: '全部', value: '' },
        { label: '3K以下', value: 'below3k' },
        { label: '3K-5K', value: '3k-5k' },
        { label: '5K-8K', value: '5k-8k' },
        { label: '8K-12K', value: '8k-12k' },
        { label: '12K以上', value: 'above12k' }
      ]
    }
  },
  computed: {
    filteredJobs() {
      let result = this.jobs
      
      // 筛选状态
      if (this.activeTab === 1) {
        result = result.filter(job => job.status === 'published')
      } else if (this.activeTab === 2) {
        result = result.filter(job => job.status === 'pending')
      } else if (this.activeTab === 3) {
        result = result.filter(job => job.status === 'paused')
      } else if (this.activeTab === 4) {
        result = result.filter(job => job.status === 'expired')
      }
      
      // 搜索关键词
      if (this.searchText) {
        result = result.filter(job => 
          job.title.toLowerCase().includes(this.searchText.toLowerCase())
        )
      }
      
      return result
    }
  },
  methods: {
    switchTab(index) {
      this.activeTab = index
    },
    
    searchJobs() {
      // 已经通过计算属性filteredJobs自动筛选
      console.log('搜索关键词：', this.searchText)
    },
    
    gotoJobDetail(job) {
      uni.navigateTo({
        url: `/pages/jobDetail/jobDetail?id=${job.id}&isEmployer=true`
      })
    },
    
    updateJobStatus(jobId, status) {
      // 更新岗位状态
      const index = this.jobs.findIndex(job => job.id === jobId)
      if (index !== -1) {
        this.jobs[index].status = status
        this.jobs[index].statusText = status === 'published' ? '已发布' : '已暂停'
        this.jobs[index].statusClass = status === 'published' ? 'success' : 'warning'
        
        uni.showToast({
          title: '状态已更新',
          icon: 'success'
        })
      }
    },
    
    promoteJob(job) {
      uni.navigateTo({
        url: `/pages/employer/jobPromote?id=${job.id}`
      })
    },
    
    pauseJob(job) {
      uni.showModal({
        title: '暂停岗位',
        content: `确定要暂停"${job.title}"岗位吗？暂停后求职者将无法看到此岗位。`,
        success: (res) => {
          if (res.confirm) {
            this.updateJobStatus(job.id, 'paused')
          }
        }
      })
    },
    
    resumeJob(job) {
      uni.showModal({
        title: '恢复岗位',
        content: `确定要恢复"${job.title}"岗位吗？恢复后求职者可以继续看到此岗位。`,
        success: (res) => {
          if (res.confirm) {
            this.updateJobStatus(job.id, 'published')
          }
        }
      })
    },
    
    viewApplicants(job) {
      uni.navigateTo({
        url: `/pages/employer/applicants?jobId=${job.id}`
      })
    },
    
    editJob(job) {
      uni.navigateTo({
        url: `/pages/employer/jobPost?id=${job.id}&edit=true`
      })
    },
    
    confirmDeleteJob(job) {
      uni.showModal({
        title: '删除岗位',
        content: `确定要删除"${job.title}"岗位吗？此操作不可恢复。`,
        success: (res) => {
          if (res.confirm) {
            this.deleteJob(job.id)
          }
        }
      })
    },
    
    deleteJob(jobId) {
      const index = this.jobs.findIndex(job => job.id === jobId)
      if (index !== -1) {
        this.jobs.splice(index, 1)
        
        // 更新tab计数
        this.updateTabCounts()
        
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
      }
    },
    
    gotoPostJob() {
      uni.navigateTo({
        url: '/pages/employer/jobPost'
      })
    },
    
    showFilterPopup() {
      this.$refs.filterPopup.open()
    },
    
    hideFilterPopup() {
      this.$refs.filterPopup.close()
    },
    
    selectTimeFilter(value) {
      this.filters.timeRange = value
    },
    
    selectSalaryFilter(value) {
      this.filters.salaryRange = value
    },
    
    resetFilters() {
      this.filters = {
        timeRange: '',
        salaryRange: ''
      }
    },
    
    applyFilters() {
      // 应用筛选条件
      console.log('应用筛选：', this.filters)
      this.hideFilterPopup()
      
      // 这里应该调用接口获取筛选后的数据
      // 示例代码仅作演示
      uni.showToast({
        title: '筛选已应用',
        icon: 'success'
      })
    },
    
    updateTabCounts() {
      // 更新各状态的计数
      this.tabs[0].count = this.jobs.length
      this.tabs[1].count = this.jobs.filter(job => job.status === 'published').length
      this.tabs[2].count = this.jobs.filter(job => job.status === 'pending').length
      this.tabs[3].count = this.jobs.filter(job => job.status === 'paused').length
      this.tabs[4].count = this.jobs.filter(job => job.status === 'expired').length
    }
  }
}
</script>

<style lang="scss">
.job-manage-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  
  .status-tabs {
    display: flex;
    background-color: #FFFFFF;
    padding: 0 30rpx;
    overflow-x: auto;
    white-space: nowrap;
    
    .tab-item {
      position: relative;
      padding: 24rpx 0;
      margin-right: 40rpx;
      
      text {
        font-size: 28rpx;
        color: #666;
      }
      
      .tab-badge {
        position: absolute;
        top: 14rpx;
        right: -20rpx;
        min-width: 36rpx;
        height: 36rpx;
        border-radius: 18rpx;
        background-color: #FF5722;
        color: #FFFFFF;
        font-size: 22rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8rpx;
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
          left: 25%;
          width: 50%;
          height: 4rpx;
          background-color: #4CAF50;
        }
      }
    }
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #FFFFFF;
    border-top: 1rpx solid #EEEEEE;
    
    .search-input {
      flex: 1;
      height: 70rpx;
      background-color: #F5F5F5;
      border-radius: 35rpx;
      display: flex;
      align-items: center;
      padding: 0 30rpx;
      
      uni-icons {
        margin-right: 10rpx;
      }
      
      input {
        flex: 1;
        height: 60rpx;
        font-size: 28rpx;
      }
    }
    
    .filter-btn {
      display: flex;
      align-items: center;
      margin-left: 20rpx;
      padding: 10rpx 20rpx;
      
      uni-icons {
        margin-right: 6rpx;
      }
      
      text {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
  
  .job-list {
    padding: 20rpx;
    
    .job-item {
      background-color: #FFFFFF;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      overflow: hidden;
      
      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24rpx;
        border-bottom: 1rpx solid #F5F5F5;
        
        .job-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }
        
        .job-status {
          font-size: 24rpx;
          padding: 6rpx 16rpx;
          border-radius: 20rpx;
          
          &.success {
            color: #4CAF50;
            background-color: rgba(76, 175, 80, 0.1);
          }
          
          &.warning {
            color: #FF9800;
            background-color: rgba(255, 152, 0, 0.1);
          }
          
          &.info {
            color: #2196F3;
            background-color: rgba(33, 150, 243, 0.1);
          }
          
          &.default {
            color: #9E9E9E;
            background-color: rgba(158, 158, 158, 0.1);
          }
        }
      }
      
      .job-info {
        padding: 20rpx 24rpx;
        border-bottom: 1rpx solid #F5F5F5;
        
        .info-item {
          margin-bottom: 10rpx;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .label {
            font-size: 26rpx;
            color: #999;
          }
          
          text {
            font-size: 26rpx;
            color: #666;
          }
          
          .salary {
            color: #FF5722;
          }
        }
      }
      
      .job-stats {
        display: flex;
        padding: 20rpx 0;
        background-color: #F9F9F9;
        
        .stat-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          
          &:not(:last-child)::after {
            content: '';
            position: absolute;
            right: 0;
            top: 20%;
            height: 60%;
            width: 1rpx;
            background-color: #EEEEEE;
          }
          
          .stat-num {
            font-size: 30rpx;
            color: #333;
            font-weight: bold;
            margin-bottom: 6rpx;
          }
          
          .stat-label {
            font-size: 24rpx;
            color: #999;
          }
        }
      }
      
      .job-actions {
        display: flex;
        flex-wrap: wrap;
        padding: 20rpx 24rpx;
        
        .action-btn {
          height: 60rpx;
          line-height: 60rpx;
          font-size: 26rpx;
          margin-right: 20rpx;
          margin-bottom: 10rpx;
          padding: 0 30rpx;
          background-color: #F5F5F5;
          color: #666;
          border-radius: 30rpx;
        }
        
        .primary-btn {
          background-color: #4CAF50;
          color: #FFFFFF;
        }
        
        .promote-btn {
          background-color: #FF9800;
          color: #FFFFFF;
        }
        
        .delete-btn {
          background-color: #fff;
          color: #FF5722;
          border: 1rpx solid #FF5722;
        }
      }
    }
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
    
    image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 30rpx;
    }
    
    text {
      font-size: 28rpx;
      color: #999;
      margin-bottom: 40rpx;
    }
    
    .post-btn {
      width: 300rpx;
      height: 80rpx;
      line-height: 80rpx;
      background-color: #4CAF50;
      color: #FFFFFF;
      font-size: 28rpx;
      border-radius: 40rpx;
    }
  }
  
  .filter-popup {
    background-color: #FFFFFF;
    border-radius: 24rpx 24rpx 0 0;
    padding-bottom: 40rpx;
    
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #F5F5F5;
      
      text {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .close-btn {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
        color: #999;
      }
    }
    
    .filter-section {
      padding: 20rpx 30rpx;
      
      .section-title {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
      }
      
      .filter-options {
        display: flex;
        flex-wrap: wrap;
        
        .option {
          height: 60rpx;
          line-height: 60rpx;
          padding: 0 30rpx;
          border-radius: 30rpx;
          background-color: #F5F5F5;
          font-size: 26rpx;
          color: #666;
          margin-right: 20rpx;
          margin-bottom: 16rpx;
          
          &.active {
            background-color: #E8F5E9;
            color: #4CAF50;
          }
        }
      }
    }
    
    .filter-actions {
      display: flex;
      padding: 30rpx;
      
      button {
        flex: 1;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        border-radius: 40rpx;
      }
      
      .reset-btn {
        background-color: #F5F5F5;
        color: #666;
        margin-right: 20rpx;
      }
      
      .confirm-btn {
        background-color: #4CAF50;
        color: #FFFFFF;
      }
    }
  }
}
</style> 