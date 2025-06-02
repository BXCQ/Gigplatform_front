<template>
  <view class="index-container">
    <!-- 自定义导航栏 -->
    <cu-custom bgColor="bg-gradient-green" :isBack="false">
      <block slot="content">
        <text class="header-title">厦门零工市场</text>
      </block>
    </cu-custom>
    
    <!-- 搜索栏 -->
    <view class="search-box">
      <view class="search-bar" @tap="goToSearch">
        <view class="location-btn">
          <text>区域</text>
          <text class="cuIcon-unfold"></text>
        </view>
        <view class="search-form">
          <text class="cuIcon-search text-gray"></text>
          <text class="text-gray">您想找一份什么样的工作?</text>
        </view>
        <view class="search-btn">搜索</view>
      </view>
    </view>
    
    <!-- 轮播图 (招募广告) -->
    <view class="banner-wrapper" :style="{height: bannerHeight}">
      <swiper class="screen-swiper" 
              :indicator-dots="true"
              :indicator-color="'rgba(255, 255, 255, .3)'"
              :indicator-active-color="'#ffffff'"
              :autoplay="true" 
              :circular="true" 
              :interval="3000" 
              :duration="500">
        <swiper-item v-for="(item, index) in banners" :key="index" @tap="bannerTap(item)">
          <image :src="item.imageUrl" mode="widthFix" class="swiper-image"></image>
        </swiper-item>
      </swiper>
    </view>
    
    <!-- 分类导航 -->
    <view class="category-section">
      <view class="category-grid">
        <view class="category-item" v-for="(item, index) in categories" :key="index" @tap="goToCategory(item)">
          <view class="icon-wrapper">
            <image :src="item.icon" mode="aspectFit" class="category-icon"></image>
          </view>
          <text class="category-name">{{item.name}}</text>
          <text class="category-desc">{{item.description}}</text>
        </view>
      </view>
    </view>
    
    <!-- 推广横幅 (可选) -->
    <view class="promo-banner" v-if="showPromoBanner">
      <image src="/static/img/default/shili.png" mode="widthFix"></image>
    </view>
    
    <!-- 岗位推荐分类标签 -->
    <view class="section-divider"></view>
    <view class="recommend-section">
      <view class="recommend-tabs">
        <view class="tab-item" :class="{active: currentTab === 'hot'}" @tap="switchTab('hot')">
          <text>热门推荐</text>
        </view>
        <view class="tab-item" :class="{active: currentTab === 'nearest'}" @tap="switchTab('nearest')">
          <text>离我最近</text>
        </view>
        <view class="tab-item" :class="{active: currentTab === 'latest'}" @tap="switchTab('latest')">
          <text>最新岗位</text>
        </view>
      </view>
      
      <!-- 热门推荐岗位 -->
      <view class="job-list-container" v-if="currentTab === 'hot'">
        <view class="job-list">
          <job-card-compact v-for="(job, index) in recommendJobs" :key="index" :job="job"></job-card-compact>
          <view class="more-jobs" @tap="gotoMoreJobs">查看更多岗位 <text class="cuIcon-right"></text></view>
        </view>
      </view>
      
      <!-- 离我最近岗位 -->
      <view class="job-list-container" v-if="currentTab === 'nearest'">
        <view class="job-list">
          <job-card-compact v-for="(job, index) in nearestJobs" :key="index" :job="job"></job-card-compact>
          <view class="more-jobs" @tap="gotoMoreJobs">查看更多岗位 <text class="cuIcon-right"></text></view>
        </view>
      </view>
      
      <!-- 最新岗位 -->
      <view class="job-list-container" v-if="currentTab === 'latest'">
        <view class="job-list">
          <job-card-compact v-for="(job, index) in latestJobs" :key="index" :job="job"></job-card-compact>
          <view class="more-jobs" @tap="gotoMoreJobs">查看更多岗位 <text class="cuIcon-right"></text></view>
        </view>
      </view>
    </view>
    
    <!-- 身份切换按钮 -->
    <identity-switch></identity-switch>
  </view>
</template>

<script>
import JobCardCompact from '@/components/job-card-compact.vue'
import IdentitySwitch from '@/components/identity-switch.vue'
import API from '@/api/index.js'

export default {
  components: {
    JobCardCompact,
    IdentitySwitch
  },
  data() {
    return {
      currentTab: 'hot', // hot, nearest, latest
      banners: [],
      bannerHeight: 'auto',
      showPromoBanner: false,
      categories: [],
      recommendJobs: [],
      nearestJobs: [],
      latestJobs: [],
      isLoading: false,
      location: null,
      pageSize: 10,
      currentPage: 1,
      hasMore: true
    }
  },
  onLoad() {
    this.getUserLocation()
    this.preloadBannerImage()
    this.fetchHomeData()
  },
  // 添加下拉刷新
  onPullDownRefresh() {
    this.refreshData()
  },
  // 添加触底加载更多
  onReachBottom() {
    if (this.hasMore && !this.isLoading) {
      this.loadMoreJobs()
    }
  },
  methods: {
    // 刷新数据
    async refreshData() {
      this.currentPage = 1
      this.hasMore = true
      await this.fetchHomeData()
      uni.stopPullDownRefresh()
    },
    
    // 加载更多工作
    async loadMoreJobs() {
      if (!this.hasMore || this.isLoading) return
      
      this.isLoading = true
      try {
        const newJobs = await this.fetchJobsByTab(this.currentTab, this.currentPage + 1)
        if (newJobs && newJobs.length > 0) {
          this.currentPage++
          switch (this.currentTab) {
            case 'hot':
              this.recommendJobs = [...this.recommendJobs, ...newJobs]
              break
            case 'nearest':
              this.nearestJobs = [...this.nearestJobs, ...newJobs]
              break
            case 'latest':
              this.latestJobs = [...this.latestJobs, ...newJobs]
              break
          }
        } else {
          this.hasMore = false
        }
      } catch (error) {
        console.error('加载更多工作失败', error)
        uni.showToast({
          title: '加载失败，请稍后再试',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
	
	// 新增方法：性别英文转中文
	  formatGender(gender) {
	    const genderMap = {
	      'male': '男性',
	      'female': '女性',
	      'none': '无要求'
	    }
	    return genderMap[gender] || '无要求'
	  },

    // 根据标签获取工作列表
    async fetchJobsByTab(tab, page = 1) {
      try {
        let response
        switch (tab) {
          case 'hot':
            response = await API.getLatestJobs({ page, size: this.pageSize })
            break
          case 'nearest':
            response = await API.getNearbyJobs({ 
              page, 
              size: this.pageSize,
              latitude: this.location?.latitude,
              longitude: this.location?.longitude
            })
            break
          case 'latest':
            response = await API.getLatestJobs({ page, size: this.pageSize })
            break
        }
        
        if (response?.code === 0 && response?.data) {
          return response.data.records.map(job => ({
            id: job.id,
            title: job.title,
            salary: `${job.salary}元/天`,
            gender: this.formatGender(job.genderRequirement) || '男女不限',
            jobType: job.categoryName || '临时工',
            contact: job.contact || job.location,
            startTime: this.formatDate(job.startTime),
            endTime: this.formatDate(job.endTime),
            urgent: job.urgent,
            hotJob: job.hotJob
          }))
        }
        return []
      } catch (error) {
        console.error(`获取${tab}工作列表失败`, error)
        return []
      }
    },

    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${month}月${day}日`
    },

    // 获取首页所需的所有数据
    async fetchHomeData() {
      this.isLoading = true
      try {
        // 并行加载所有数据
        const [banners, categories, jobs] = await Promise.all([
          this.fetchBanners(),
          this.fetchCategories(),
          this.fetchJobsByTab(this.currentTab)
        ])
        
        // 设置数据
        if (banners) this.banners = banners
        if (categories) this.categories = categories
        if (jobs) {
          switch (this.currentTab) {
            case 'hot':
              this.recommendJobs = jobs
              break
            case 'nearest':
              this.nearestJobs = jobs
              break
            case 'latest':
              this.latestJobs = jobs
              break
          }
        }
      } catch (error) {
        console.error('获取首页数据失败', error)
        uni.showToast({
          title: '获取数据失败，请稍后再试',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    // 获取轮播图数据
    async fetchBanners() {
      try {
        const response = await API.getBanners()
        if (response?.code === 0 && response?.data) {
          this.banners = response.data
        } else {
          this.useDefaultBanners()
        }
      } catch (error) {
        console.error('获取轮播图失败', error)
        this.useDefaultBanners()
      }
    },

    // 使用默认轮播图
    useDefaultBanners() {
      this.banners = [
        { id: 1, imageUrl: '/static/img/default/1 (1).png', url: '' },
        { id: 2, imageUrl: '/static/img/default/1 (2).png', url: '' },
        { id: 3, imageUrl: '/static/img/default/1 (3).png', url: '' }
      ]
    },
    
    // 获取分类数据
    async fetchCategories() {
      try {
        const response = await API.getCategories()
        if (response?.code === 0 && response?.data) {
          this.categories = response.data
        } else {
          this.useDefaultCategories()
        }
      } catch (error) {
        console.error('获取分类失败', error)
        this.useDefaultCategories()
      }
    },

    // 使用默认分类
    useDefaultCategories() {
      this.categories = [
        { id: 1, name: '餐饮服务', description: '包括厨师、服务员、配送员等餐饮相关工作', icon: '/static/img/category/1.png' },
        { id: 2, name: '保洁服务', description: '包括保洁、照顾老人、育儿等家庭服务工作', icon: '/static/img/category/2.png' },
        { id: 3, name: '搬运装卸', description: '包括搬运、装卸、建筑等体力工作', icon: '/static/img/category/3.png' },
        { id: 4, name: '专业技工', description: '包括维修、安装等技术性工作', icon: '/static/img/category/4.png' },
        { id: 5, name: '临时工', description: '包括促销、导购等销售类工作', icon: '/static/img/category/5.png' },
        { id: 6, name: '更多服务', description: '其他不方便分类的工作', icon: '/static/img/category/6.png' },
        { id: 7, name: '医疗陪诊', description: '医疗相关', icon: '/static/img/category/7.png' },
        { id: 8, name: '制造业', description: '制造相关', icon: '/static/img/category/8.png' },
        { id: 9, name: '家政服务', description: '家政相关', icon: '/static/img/category/9.png' },
        { id: 10, name: '物流配送', description: '物流相关', icon: '/static/img/category/10.png' }
      ]
    },

    // 切换标签
    async switchTab(tab) {
      if (this.currentTab === tab) return
      this.currentTab = tab
      this.currentPage = 1
      this.hasMore = true
      
      try {
        const jobs = await this.fetchJobsByTab(tab)
        switch (tab) {
          case 'hot':
            this.recommendJobs = jobs
            break
          case 'nearest':
            this.nearestJobs = jobs
            break
          case 'latest':
            this.latestJobs = jobs
            break
        }
      } catch (error) {
        console.error('切换标签失败', error)
        uni.showToast({
          title: '获取数据失败，请稍后再试',
          icon: 'none'
        })
      }
    },

    // 轮播图点击事件
    bannerTap(item) {
      if (item.linkUrl) {
        uni.navigateTo({
          url: item.linkUrl
        })
      }
    },

    // 跳转到分类页面
    goToCategory(category) {
        uni.navigateTo({
            url: `/pages/category/categoryJobs?id=${category.id}&name=${encodeURIComponent(category.name)}`
        })
    },

    // 查看更多工作
    gotoMoreJobs() {
      uni.navigateTo({
        url: `/pages/job/list?type=${this.currentTab}`
      })
    },

    // 跳转到搜索页
    goToSearch() {
      uni.navigateTo({
        url: '/pages/search/search'
      })
    },

    // 预加载轮播图第一张图片以获取高度
    preloadBannerImage() {
      // 固定使用原始比例
      // 原图为516 × 145
      const windowWidth = uni.getSystemInfoSync().windowWidth
      const imgHeight = windowWidth * (145/516)
      this.bannerHeight = imgHeight + 'px'
      console.log("Banner height calculated:", this.bannerHeight, "Screen width:", windowWidth)
    },
    
    // 获取用户位置
    getUserLocation() {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.location = {
            latitude: res.latitude,
            longitude: res.longitude
          }
          // 获取到位置后刷新附近的工作
          this.fetchNearbyJobs()
        },
        fail: (err) => {
          console.error('获取位置失败', err)
          uni.showToast({
            title: '获取位置失败，请检查定位权限',
            icon: 'none'
          })
        }
      })
    },
    
    // 获取附近工作
    async fetchNearbyJobs() {
      if (!this.location) return
      
      try {
        const params = {
          latitude: this.location.latitude,
          longitude: this.location.longitude,
          limit: 5
        }
        const jobs = await API.getNearbyJobs(params)
        if (jobs && jobs.length > 0) {
          this.nearestJobs = jobs
        }
      } catch (error) {
        console.error('获取附近工作失败', error)
      }
    },
  }
}
</script>

<style lang="scss">
.index-container {
  min-height: 100vh;
  background-color: #F6F7FB;
  padding-bottom: 120rpx;
  position: relative;
}

/* 标题样式 */
.header-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

/* 搜索栏样式 */
.search-box {
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid rgba(0,0,0,0.05);
}

.search-bar {
  display: flex;
  align-items: center;
  
  .location-btn {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    margin-right: 15rpx;
    color: #333;
    font-weight: 500;
    
    .cuIcon-unfold {
      font-size: 24rpx;
      margin-left: 4rpx;
    }
  }
  
  .search-form {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #F6F7FB;
    height: 72rpx;
    padding: 0 24rpx;
    border-radius: 36rpx;
    font-size: 28rpx;
    
    .cuIcon-search {
      margin-right: 10rpx;
      font-size: 32rpx;
    }
  }
  
  .search-btn {
    width: 90rpx;
    text-align: center;
    color: #FFFFFF;
    font-size: 28rpx;
    background: linear-gradient(90deg, #6B7CFF, #8A5EFF);
    height: 72rpx;
    line-height: 72rpx;
    border-radius: 36rpx;
    margin-left: 15rpx;
    font-weight: 500;
  }
}

/* 轮播图样式 */
.banner-wrapper {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.screen-swiper {
  width: 100%;
  height: 100%;
  
  .swiper-image {
    width: 100%;
    display: block;
  }
}

/* 分类导航样式 */
.category-section {
  background-color: #FFFFFF;
  padding: 20rpx 0 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.03);
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx 20rpx;
}

.category-item {
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15rpx 0;
  
  .icon-wrapper {
    width: 90rpx;
    height: 90rpx;
    background: #FFFFFF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    
    .category-icon {
      width: 60rpx;
      height: 60rpx;
    }
  }
  
  .category-name {
    font-size: 24rpx;
    color: #333333;
    font-weight: 500;
    margin-bottom: 4rpx;
  }

  .category-desc {
    font-size: 20rpx;
    color: #999999;
    text-align: center;
    padding: 0 10rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.3;
  }

  &:active {
    .icon-wrapper {
      transform: scale(0.95);
      box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
    }
  }
}

/* 推广横幅样式 */
.promo-banner {
  margin: 0 0 20rpx 0;
  width: 100%;
  
  image {
    width: 100%;
    display: block;
  }
}

/* 分隔线 */
.section-divider {
  height: 20rpx;
  background-color: #F6F7FB;
}

/* 推荐岗位区域样式 */
.recommend-section {
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.03);
}

.recommend-tabs {
  display: flex;
  justify-content: space-around;
  background-color: #FFFFFF;
  padding: 0;
  border-bottom: 1rpx solid rgba(0,0,0,0.05);
  overflow: hidden;
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 25rpx 0;
    font-size: 30rpx;
    color: #666666;
    position: relative;
    
    &.active {
      color: #6B7CFF;
      font-weight: 600;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 30%;
        width: 40%;
        height: 6rpx;
        border-radius: 3rpx;
        background: linear-gradient(90deg, #6B7CFF, #8A5EFF);
      }
    }
  }
}

.job-list-container {
  background-color: #FFFFFF;
  padding: 20rpx 30rpx;
}

.job-list {
  display: flex;
  flex-direction: column;
}

.more-jobs {
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #6B7CFF;
  border-top: 1rpx solid rgba(0,0,0,0.05);
  margin-top: 20rpx;
}
</style> 