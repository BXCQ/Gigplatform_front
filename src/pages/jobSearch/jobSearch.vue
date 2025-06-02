<template>
  <view class="task-container">
    <!-- 自定义导航栏 -->
    <cu-custom bgColor="bg-gradient-green">
      <block slot="content">任务</block>
    </cu-custom>
    
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="cuIcon-search text-gray"></text>
        <input type="text" placeholder="搜索工作" confirm-type="search" v-model="searchText" @confirm="search"></input>
      </view>
      <view class="filter-btn" @tap="showFilterPopup">
        <text class="cuIcon-filter"></text>
      </view>
    </view>
    
    <!-- 排序选项 -->
    <view class="sort-bar">
      <view class="sort-item" 
        v-for="(item, index) in sortOptions" 
        :key="index"
        :class="{ active: currentSort === item.value }"
        @tap="changeSort(item.value)">
        {{ item.label }}
        <text class="sort-icon" v-if="item.value === currentSort">
          {{ sortOrder === 'asc' ? '↑' : '↓' }}
        </text>
      </view>
    </view>
    
    <!-- 筛选条件 -->
    <view class="filter-section" v-if="showFilters">
      <view class="filter-group">
        <view class="filter-title">薪资范围</view>
        <view class="salary-range">
          <input type="number" v-model="filterParams.minSalary" placeholder="最低薪资" />
          <text class="range-separator">-</text>
          <input type="number" v-model="filterParams.maxSalary" placeholder="最高薪资" />
        </view>
      </view>
      
      <view class="filter-group">
        <view class="filter-title">地点</view>
        <view class="location-input">
          <input type="text" v-model="filterParams.location" placeholder="请输入地点" />
        </view>
      </view>
      
      <view class="filter-group">
        <view class="filter-title">时间范围</view>
        <view class="date-range">
          <picker mode="date" :value="filterParams.startDate" @change="onStartDateChange">
            <view class="date-picker">{{ filterParams.startDate || '开始日期' }}</view>
          </picker>
          <text class="date-separator">至</text>
          <picker mode="date" :value="filterParams.endDate" @change="onEndDateChange">
            <view class="date-picker">{{ filterParams.endDate || '结束日期' }}</view>
          </picker>
        </view>
      </view>
      
      <view class="filter-buttons">
        <button class="reset-btn" @click="resetFilters">重置</button>
        <button class="confirm-btn" @click="applyFilters">确定</button>
      </view>
    </view>
    
    <!-- 任务列表 -->
    <scroll-view 
      class="task-list" 
      scroll-y 
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh">
      <view class="task-item" v-for="(task, index) in taskList" :key="index" @click="viewTaskDetail(task)">
        <view class="task-header">
          <view class="task-title">{{ task.title }}</view>
          <view class="task-tags">
            <text class="tag urgent" v-if="task.urgent === 'yes'">急聘</text>
            <text class="tag hot" v-if="task.hotJob === 'yes'">热门</text>
          </view>
        </view>
        
        <view class="task-info">
          <view class="info-item">
            <text class="label">薪资：</text>
            <text class="value">¥{{ task.salary }}/天</text>
          </view>
          <view class="info-item">
            <text class="label">地点：</text>
            <text class="value">{{ task.location }}</text>
          </view>
          <view class="info-item">
            <text class="label">时间：</text>
            <text class="value">{{ formatTime(task.startTime) }} - {{ formatTime(task.endTime) }}</text>
          </view>
          <view class="info-item">
            <text class="label">要求：</text>
            <text class="value">{{ task.requirements }}</text>
          </view>
        </view>
        
        <view class="task-footer">
          <view class="employer-info">
            <image class="avatar" :src="task.employerAvatar || '/static/img/default-avatar.png'" mode="aspectFill"></image>
            <text class="name">{{ task.employerName || '雇主' }}</text>
          </view>
          <view class="task-status" :class="getStatusClass(task.status)">
            {{ getStatusText(task.status) }}
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <view class="loading-more" v-if="isLoading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-if="!hasMore && taskList.length > 0">
        <text>没有更多了</text>
      </view>
      <view class="empty-state" v-if="!isLoading && taskList.length === 0">
        <image src="/static/img/empty.png" mode="aspectFit"></image>
        <text>暂无相关职位</text>
      </view>
    </scroll-view>
    
    <!-- 身份切换按钮 -->
    <identity-switch></identity-switch>
  </view>
</template>

<script>
import IdentitySwitch from '@/components/identity-switch.vue'
import API from '@/api/index.js'

export default {
  components: {
    IdentitySwitch
  },
  data() {
    return {
      searchText: '',
      currentSort: 'time',
      sortOrder: 'desc',
      sortOptions: [
        { label: '最新发布', value: 'time' },
        { label: '薪资高低', value: 'salary' }
      ],
      taskList: [],
      isLoading: false,
      page: 1,
      limit: 10,
      hasMore: true,
      showFilters: false,
      isRefreshing: false,
      filterParams: {
        minSalary: '',
        maxSalary: '',
        location: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  onLoad() {
    this.fetchTasks()
  },
  methods: {
    // 获取任务列表
    async fetchTasks(isRefresh = false) {
      if (isRefresh) {
        this.page = 1
        this.hasMore = true
      }
      
      if (!this.hasMore || this.isLoading) return
      
      this.isLoading = true
      
      try {
        const params = {
          page: this.page,
          size: this.limit,
          search: this.searchText,
          status: 'open',
          sortBy: this.currentSort,
          sortOrder: this.sortOrder,
          minSalary: this.filterParams.minSalary || undefined,
          maxSalary: this.filterParams.maxSalary || undefined
        }
        
        const res = await API.getJobList(params)
        
        if (res.code === 0) {
          const { records, totalPage } = res.data
          
          if (isRefresh) {
            this.taskList = records
          } else {
            this.taskList = [...this.taskList, ...records]
          }
          
          this.hasMore = this.page < totalPage
          this.page++
        } else {
          uni.showToast({
            title: res.message || '获取任务列表失败',
            icon: 'none'
          })
        }
      } catch (err) {
        console.error('获取任务列表失败', err)
        uni.showToast({
          title: '获取任务列表失败',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
        if (isRefresh) {
          this.isRefreshing = false
        }
      }
    },
    
    // 切换排序
    changeSort(sort) {
      if (this.currentSort === sort) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.currentSort = sort
        this.sortOrder = 'desc'
      }
      this.fetchTasks(true)
    },
    
    // 开始日期变化
    onStartDateChange(e) {
      this.filterParams.startDate = e.detail.value
    },
    
    // 结束日期变化
    onEndDateChange(e) {
      this.filterParams.endDate = e.detail.value
    },
    
    // 搜索
    search() {
      this.fetchTasks(true)
    },
    
    // 显示筛选弹窗
    showFilterPopup() {
      this.showFilters = !this.showFilters
    },
    
    // 重置筛选条件
    resetFilters() {
      this.filterParams = {
        minSalary: '',
        maxSalary: '',
        location: '',
        startDate: '',
        endDate: ''
      }
    },
    
    // 应用筛选条件
    applyFilters() {
      this.showFilters = false
      this.fetchTasks(true)
    },
    
    // 加载更多
    loadMore() {
      this.fetchTasks()
    },
    
    // 下拉刷新
    onRefresh() {
      this.isRefreshing = true
      this.fetchTasks(true)
    },
    
    // 查看任务详情
    viewTaskDetail(task) {
      uni.navigateTo({
        url: `/pages/jobDetail/jobDetail?id=${task.id}`
      })
    },
    
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'open': '招聘中',
        'closed': '已结束',
        'canceled': '已取消'
      }
      return statusMap[status] || '未知状态'
    },
    
    // 获取状态样式
    getStatusClass(status) {
      const classMap = {
        'open': 'status-open',
        'closed': 'status-closed',
        'canceled': 'status-canceled'
      }
      return classMap[status] || ''
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.fetchTasks(true)
  },
  // 上拉加载更多
  onReachBottom() {
    if (this.hasMore) {
      this.fetchTasks()
    }
  }
}
</script>

<style lang="scss">
.task-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

.search-bar {
  display: flex;
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  
  .search-input {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #F5F5F5;
    height: 72rpx;
    border-radius: 36rpx;
    padding: 0 30rpx;
    
    .cuIcon-search {
      margin-right: 10rpx;
      font-size: 36rpx;
    }
    
    input {
      flex: 1;
      height: 100%;
      font-size: 28rpx;
    }
  }
  
  .filter-btn {
    width: 72rpx;
    height: 72rpx;
    background-color: #F5F5F5;
    border-radius: 36rpx;
    margin-left: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .cuIcon-filter {
      font-size: 36rpx;
      color: #666666;
    }
  }
}

/* ColorUI导航样式增强 */
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

.filter-section {
  background-color: #FFFFFF;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .filter-group {
    margin-bottom: 30rpx;
    
    .filter-title {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .filter-options {
      display: flex;
      flex-wrap: wrap;
      
      .filter-option {
        padding: 10rpx 20rpx;
        background-color: #F5F5F5;
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #666;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        
        &.active {
          background-color: #4CAF50;
          color: #FFFFFF;
        }
      }
    }
  }
  
  .filter-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 30rpx;
    
    button {
      width: 45%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 40rpx;
      font-size: 28rpx;
      
      &.reset-btn {
        background-color: #F5F5F5;
        color: #666;
      }
      
      &.confirm-btn {
        background-color: #4CAF50;
        color: #FFFFFF;
      }
    }
  }
}

.task-list {
  padding: 20rpx;
  height: calc(100vh - 240rpx);
  
  .task-item {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
    
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .task-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .task-tags {
        display: flex;
        
        .tag {
          padding: 4rpx 12rpx;
          border-radius: 20rpx;
          font-size: 22rpx;
          margin-left: 10rpx;
          
          &.urgent {
            background-color: #FF5722;
            color: #FFFFFF;
          }
          
          &.hot {
            background-color: #FF9800;
            color: #FFFFFF;
          }
        }
      }
    }
    
    .task-info {
      .info-item {
        display: flex;
        margin-bottom: 16rpx;
        
        .label {
          width: 100rpx;
          font-size: 26rpx;
          color: #999;
        }
        
        .value {
          flex: 1;
          font-size: 26rpx;
          color: #333;
        }
      }
    }
    
    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;
      padding-top: 20rpx;
      border-top: 1rpx solid #EEEEEE;
      
      .employer-info {
        display: flex;
        align-items: center;
        
        .avatar {
          width: 48rpx;
          height: 48rpx;
          border-radius: 50%;
          margin-right: 10rpx;
        }
        
        .name {
          font-size: 26rpx;
          color: #666;
        }
      }
      
      .task-status {
        font-size: 24rpx;
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        
        &.status-open {
          background-color: #E8F5E9;
          color: #4CAF50;
        }
        
        &.status-closed {
          background-color: #F5F5F5;
          color: #999;
        }
        
        &.status-canceled {
          background-color: #FFEBEE;
          color: #F44336;
        }
      }
    }
  }
  
  .loading-more, .no-more, .empty-state {
    text-align: center;
    padding: 30rpx;
    color: #999;
    font-size: 26rpx;
  }
  
  .empty-state {
    image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 20rpx;
    }
  }
}

.category-nav {
  background-color: #FFFFFF;
  white-space: nowrap;
  padding: 20rpx 0;
  margin-bottom: 20rpx;
  
  .category-list {
    display: inline-flex;
    padding: 0 20rpx;
    
    .category-item {
      padding: 10rpx 30rpx;
      font-size: 28rpx;
      color: #666;
      position: relative;
      margin-right: 20rpx;
      
      &.active {
        color: #4CAF50;
        font-weight: bold;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -10rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 4rpx;
          background-color: #4CAF50;
          border-radius: 2rpx;
        }
      }
    }
  }
}

.sort-bar {
  display: flex;
  background-color: #FFFFFF;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  
  .sort-item {
    flex: 1;
    text-align: center;
    font-size: 28rpx;
    color: #666;
    position: relative;
    
    &.active {
      color: #4CAF50;
      font-weight: bold;
    }
    
    .sort-icon {
      margin-left: 4rpx;
    }
  }
}

.salary-range {
  display: flex;
  align-items: center;
  padding: 20rpx;
  
  input {
    flex: 1;
    height: 60rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
  }
  
  .range-separator {
    margin: 0 20rpx;
    color: #999;
  }
}

.location-input {
  padding: 20rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
  
  input {
    width: 100%;
    height: 60rpx;
    font-size: 28rpx;
  }
}

.date-range {
  display: flex;
  align-items: center;
  padding: 20rpx;
  
  .date-picker {
    flex: 1;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #333;
  }
  
  .date-separator {
    margin: 0 20rpx;
    color: #999;
  }
}
</style> 