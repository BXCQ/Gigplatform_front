<template>
  <view class="category-workers-container">
    <!-- 自定义导航栏 -->
    <nav-bar :title="categoryName"></nav-bar>
    
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <image class="search-icon" src="/static/img/icons/search.png" mode="aspectFit"></image>
        <input type="text" :placeholder="`搜索${categoryName}相关工人`" confirm-type="search" v-model="keyword" @confirm="search" />
      </view>
      <button class="search-btn" @click="search">搜索</button>
    </view>
    
    <!-- 筛选条件 -->
    <view class="filter-section">
      <view class="filter-item" @click="showFilterPopup('age')">
        <text>{{ ageFilter || '年龄' }}</text>
        <image src="/static/img/icons/arrow-down.png" mode="aspectFit" style="width: 24rpx; height: 24rpx; margin-left: 4rpx;"></image>
      </view>
      <view class="filter-item" @click="showFilterPopup('education')">
        <text>{{ educationFilter || '学历' }}</text>
        <image src="/static/img/icons/arrow-down.png" mode="aspectFit" style="width: 24rpx; height: 24rpx; margin-left: 4rpx;"></image>
      </view>
      <view class="filter-item" @click="showFilterPopup('type')">
        <text>{{ typeFilter || '从事工种' }}</text>
        <image src="/static/img/icons/arrow-down.png" mode="aspectFit" style="width: 24rpx; height: 24rpx; margin-left: 4rpx;"></image>
      </view>
      <view class="filter-item" @click="showFilterPopup('region')">
        <text>{{ regionFilter || '工作区域' }}</text>
        <image src="/static/img/icons/arrow-down.png" mode="aspectFit" style="width: 24rpx; height: 24rpx; margin-left: 4rpx;"></image>
      </view>
    </view>
    
    <!-- 工人列表 -->
    <scroll-view scroll-y class="worker-list" refresher-enabled @refresherrefresh="onRefresh" :refresher-triggered="isRefreshing">
      <view class="worker-item" v-for="(worker, index) in workerList" :key="index" @click="viewWorkerDetail(worker)">
        <view class="worker-info">
          <view class="name-tag">
            <text class="name">{{ worker.name }}</text>
            <image v-if="worker.certified" src="/static/img/icons/certified.png" mode="aspectFit" class="certified-icon"></image>
          </view>
          <view class="badge" v-if="worker.online">
            <view class="dot"></view>
            <text>在线</text>
          </view>
        </view>
        
        <view class="basic-info">
          <text>{{ worker.gender }} · {{ worker.age }}岁 · {{ worker.education }}</text>
        </view>
        
        <view class="detail-info">
          <view class="info-item">
            <image src="/static/img/icons/location.png" mode="aspectFit"></image>
            <text>工作区域: {{ worker.workArea || '不限' }}</text>
          </view>
          <view class="info-item">
            <image src="/static/img/icons/work.png" mode="aspectFit"></image>
            <text>从事工种: {{ worker.jobType }}</text>
          </view>
        </view>
        
        <view class="update-time">{{ worker.updateTime }}</view>
        
        <view class="action-buttons">
          <button class="action-btn call-btn" @click.stop="callWorker(worker)">联系Ta</button>
          <button class="action-btn message-btn" @click.stop="messageWorker(worker)">发消息</button>
        </view>
      </view>
      
      <view class="empty-state" v-if="workerList.length === 0">
        <image src="/static/img/icons/empty.png" mode="aspectFit"></image>
        <text>暂无{{ categoryName }}相关工人</text>
      </view>
    </scroll-view>
    
    <!-- 筛选弹窗 -->
    <uni-popup ref="filterPopup" type="bottom">
      <view class="filter-popup">
        <view class="filter-header">
          <text>筛选</text>
          <text class="close-btn" @click="closeFilterPopup">关闭</text>
        </view>
        
        <view class="filter-content" v-if="currentFilterType === 'age'">
          <view class="filter-option" :class="{active: ageFilter === ''}" @click="selectFilter('age', '')">
            <text>不限</text>
          </view>
          <view class="filter-option" :class="{active: ageFilter === '18-25岁'}" @click="selectFilter('age', '18-25岁')">
            <text>18-25岁</text>
          </view>
          <view class="filter-option" :class="{active: ageFilter === '26-35岁'}" @click="selectFilter('age', '26-35岁')">
            <text>26-35岁</text>
          </view>
          <view class="filter-option" :class="{active: ageFilter === '36-45岁'}" @click="selectFilter('age', '36-45岁')">
            <text>36-45岁</text>
          </view>
          <view class="filter-option" :class="{active: ageFilter === '46-55岁'}" @click="selectFilter('age', '46-55岁')">
            <text>46-55岁</text>
          </view>
          <view class="filter-option" :class="{active: ageFilter === '55岁以上'}" @click="selectFilter('age', '55岁以上')">
            <text>55岁以上</text>
          </view>
        </view>
        
        <view class="filter-content" v-if="currentFilterType === 'education'">
          <view class="filter-option" :class="{active: educationFilter === ''}" @click="selectFilter('education', '')">
            <text>不限</text>
          </view>
          <view class="filter-option" :class="{active: educationFilter === '小学'}" @click="selectFilter('education', '小学')">
            <text>小学</text>
          </view>
          <view class="filter-option" :class="{active: educationFilter === '初中'}" @click="selectFilter('education', '初中')">
            <text>初中</text>
          </view>
          <view class="filter-option" :class="{active: educationFilter === '高中'}" @click="selectFilter('education', '高中')">
            <text>高中</text>
          </view>
          <view class="filter-option" :class="{active: educationFilter === '大专'}" @click="selectFilter('education', '大专')">
            <text>大专</text>
          </view>
          <view class="filter-option" :class="{active: educationFilter === '本科及以上'}" @click="selectFilter('education', '本科及以上')">
            <text>本科及以上</text>
          </view>
        </view>
        
        <view class="filter-content" v-if="currentFilterType === 'type'">
          <view class="filter-option" :class="{active: typeFilter === ''}" @click="selectFilter('type', '')">
            <text>不限</text>
          </view>
          <view class="filter-option" :class="{active: typeFilter === '家政/保洁'}" @click="selectFilter('type', '家政/保洁')">
            <text>家政/保洁</text>
          </view>
          <view class="filter-option" :class="{active: typeFilter === '搬运工'}" @click="selectFilter('type', '搬运工')">
            <text>搬运工</text>
          </view>
          <view class="filter-option" :class="{active: typeFilter === '餐饮服务'}" @click="selectFilter('type', '餐饮服务')">
            <text>餐饮服务</text>
          </view>
          <view class="filter-option" :class="{active: typeFilter === '快递员'}" @click="selectFilter('type', '快递员')">
            <text>快递员</text>
          </view>
        </view>
        
        <view class="filter-content" v-if="currentFilterType === 'region'">
          <view class="filter-option" :class="{active: regionFilter === ''}" @click="selectFilter('region', '')">
            <text>不限</text>
          </view>
          <view class="filter-option" :class="{active: regionFilter === '思明区'}" @click="selectFilter('region', '思明区')">
            <text>思明区</text>
          </view>
          <view class="filter-option" :class="{active: regionFilter === '湖里区'}" @click="selectFilter('region', '湖里区')">
            <text>湖里区</text>
          </view>
          <view class="filter-option" :class="{active: regionFilter === '集美区'}" @click="selectFilter('region', '集美区')">
            <text>集美区</text>
          </view>
          <view class="filter-option" :class="{active: regionFilter === '海沧区'}" @click="selectFilter('region', '海沧区')">
            <text>海沧区</text>
          </view>
          <view class="filter-option" :class="{active: regionFilter === '同安区'}" @click="selectFilter('region', '同安区')">
            <text>同安区</text>
          </view>
          <view class="filter-option" :class="{active: regionFilter === '翔安区'}" @click="selectFilter('region', '翔安区')">
            <text>翔安区</text>
          </view>
        </view>
        
        <view class="filter-actions">
          <button class="reset-btn" @click="resetFilter">重置</button>
          <button class="confirm-btn" @click="applyFilter">确定</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      categoryId: null,
      categoryName: '',
      keyword: '',
      isRefreshing: false,
      workerList: [],
      ageFilter: '',
      educationFilter: '',
      typeFilter: '',
      regionFilter: '',
      currentFilterType: ''
    }
  },
  onLoad(options) {
    if (options.id) {
      this.categoryId = options.id
    }
    if (options.name) {
      this.categoryName = options.name
    }
    this.loadWorkerList()
  },
  methods: {
    loadWorkerList() {
      // 显示加载中
      uni.showLoading({
        title: '加载中...'
      })
      
      // 尝试从API获取数据
      API.getWorkersByCategory(this.categoryId, {
        page: 1,
        limit: 10,
        search: this.keyword || undefined
      }).then(result => {
        // 关闭加载提示
        uni.hideLoading()
        
        // 如果API返回了数据
        if (result && result.list && result.list.length > 0) {
          this.workerList = result.list
        } else {
          // 如果API没有返回数据，显示示例数据
          this.showExampleData()
        }
      }).catch(error => {
        console.error('获取零工列表失败', error)
        uni.hideLoading()
        uni.showToast({
          title: '获取列表失败，显示示例数据',
          icon: 'none'
        })
        // 在API请求失败时显示示例数据
        this.showExampleData()
      })
    },
    
    // 显示示例数据
    showExampleData() {
      this.workerList = [
        {
          id: 1,
          name: '程*',
          gender: '女',
          age: 49,
          education: '学历未知',
          workArea: '',
          jobType: '家政/保洁',
          updateTime: '1天前',
          online: true,
          certified: true,
          phone: '13812345678'
        },
        {
          id: 2,
          name: '张*章',
          gender: '男',
          age: 38,
          education: '学历未知',
          workArea: '',
          jobType: '家政/保洁',
          updateTime: '1天前',
          online: false,
          certified: false,
          phone: '13987654321'
        },
        {
          id: 3,
          name: '郑*芳',
          gender: '女',
          age: 49,
          education: '学历未知',
          workArea: '福建省 厦门市 湖里区',
          jobType: '家政/保洁',
          updateTime: '1天前',
          online: true,
          certified: true,
          phone: '13876543210'
        },
        {
          id: 4,
          name: '李*燕',
          gender: '女',
          age: 28,
          education: '学历未知',
          workArea: '福建省 厦门市 不限',
          jobType: '家政/保洁',
          updateTime: '1天前',
          online: true,
          certified: true,
          phone: '13765432109'
        }
      ]
    },
    search() {
      // 搜索处理
      this.loadWorkerList()
    },
    onRefresh() {
      this.isRefreshing = true
      
      // 刷新数据
      setTimeout(() => {
        this.loadWorkerList()
        this.isRefreshing = false
      }, 1000)
    },
    viewWorkerDetail(worker) {
      uni.navigateTo({
        url: `/pages/worker/workerDetail?id=${worker.id}`
      })
    },
    callWorker(worker) {
      uni.makePhoneCall({
        phoneNumber: worker.phone,
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
    messageWorker(worker) {
      uni.navigateTo({
        url: `/pages/message/chat?id=${worker.id}&name=${worker.name}`
      })
    },
    showFilterPopup(type) {
      this.currentFilterType = type
      this.$refs.filterPopup.open()
    },
    closeFilterPopup() {
      this.$refs.filterPopup.close()
    },
    selectFilter(type, value) {
      if (type === 'age') {
        this.ageFilter = value
      } else if (type === 'education') {
        this.educationFilter = value
      } else if (type === 'type') {
        this.typeFilter = value
      } else if (type === 'region') {
        this.regionFilter = value
      }
    },
    resetFilter() {
      if (this.currentFilterType === 'age') {
        this.ageFilter = ''
      } else if (this.currentFilterType === 'education') {
        this.educationFilter = ''
      } else if (this.currentFilterType === 'type') {
        this.typeFilter = ''
      } else if (this.currentFilterType === 'region') {
        this.regionFilter = ''
      }
    },
    applyFilter() {
      this.closeFilterPopup()
      this.loadWorkerList()
    }
  }
}
</script>

<style lang="scss">
.category-workers-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
  
  .search-bar {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #FFFFFF;
    
    .search-input {
      flex: 1;
      height: 70rpx;
      background: #F5F5F5;
      border-radius: 35rpx;
      display: flex;
      align-items: center;
      padding: 0 20rpx;
      margin-right: 16rpx;
      
      .search-icon {
        width: 32rpx;
        height: 32rpx;
        margin-right: 10rpx;
      }
      
      input {
        flex: 1;
        height: 70rpx;
        font-size: 26rpx;
      }
    }
    
    .search-btn {
      width: 100rpx;
      height: 70rpx;
      line-height: 70rpx;
      text-align: center;
      background: #4CAF50;
      border-radius: 35rpx;
      color: #FFF;
      font-size: 26rpx;
      padding: 0;
    }
  }
  
  .filter-section {
    display: flex;
    justify-content: space-between;
    background-color: #FFFFFF;
    padding: 20rpx 30rpx;
    margin: 0 20rpx;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 16rpx 0 rgba(0, 0, 0, 0.08);
    
    .filter-item {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #666;
    }
  }
  
  .worker-list {
    padding: 0 20rpx;
    height: calc(100vh - 240rpx);
    
    .worker-item {
      background-color: #FFFFFF;
      padding: 24rpx;
      margin-bottom: 20rpx;
      border-radius: 16rpx;
      box-shadow: 0 4rpx 16rpx 0 rgba(0, 0, 0, 0.08);
      
      .worker-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16rpx;
        
        .name-tag {
          display: flex;
          align-items: center;
          
          .name {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            margin-right: 10rpx;
          }
          
          .certified-icon {
            width: 32rpx;
            height: 32rpx;
          }
        }
        
        .badge {
          display: flex;
          align-items: center;
          background-color: rgba(76, 175, 80, 0.1);
          padding: 4rpx 12rpx;
          border-radius: 20rpx;
          
          .dot {
            width: 16rpx;
            height: 16rpx;
            border-radius: 50%;
            background-color: #4CAF50;
            margin-right: 6rpx;
          }
          
          text {
            font-size: 22rpx;
            color: #4CAF50;
          }
        }
      }
      
      .basic-info {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 16rpx;
      }
      
      .detail-info {
        margin-bottom: 16rpx;
        
        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 10rpx;
          
          image {
            width: 28rpx;
            height: 28rpx;
            margin-right: 8rpx;
          }
          
          text {
            font-size: 26rpx;
            color: #666;
          }
        }
      }
      
      .update-time {
        text-align: right;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 16rpx;
      }
      
      .action-buttons {
        display: flex;
        justify-content: space-between;
        
        .action-btn {
          width: 48%;
          height: 70rpx;
          line-height: 70rpx;
          border-radius: 35rpx;
          font-size: 28rpx;
          padding: 0;
        }
        
        .call-btn {
          background-color: #4CAF50;
          color: #FFFFFF;
        }
        
        .message-btn {
          background-color: #F5F5F5;
          color: #666;
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
        width: 160rpx;
        height: 160rpx;
        margin-bottom: 20rpx;
      }
      
      text {
        font-size: 28rpx;
        color: #999;
      }
    }
  }
  
  .filter-popup {
    background-color: #FFFFFF;
    border-radius: 20rpx 20rpx 0 0;
    padding: 30rpx;
    
    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      
      text {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
      }
      
      .close-btn {
        font-size: 28rpx;
        color: #999;
      }
    }
    
    .filter-content {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 30rpx;
      
      .filter-option {
        width: 30%;
        height: 70rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #F5F5F5;
        border-radius: 35rpx;
        margin-right: 3%;
        margin-bottom: 20rpx;
        
        text {
          font-size: 26rpx;
          color: #666;
        }
        
        &.active {
          background-color: #E8F5E9;
          border: 1rpx solid #4CAF50;
          
          text {
            color: #4CAF50;
          }
        }
      }
    }
    
    .filter-actions {
      display: flex;
      justify-content: space-between;
      
      button {
        width: 48%;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
      }
      
      .reset-btn {
        background-color: #F5F5F5;
        color: #666;
      }
      
      .confirm-btn {
        background-color: #4CAF50;
        color: #FFFFFF;
      }
    }
  }
}
</style>
