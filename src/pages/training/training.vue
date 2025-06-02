<template>
  <view class="training-container">
    <!-- 自定义导航栏 -->
    <cu-custom bgColor="bg-white" isBack>
      <block slot="content">在线培训</block>
    </cu-custom>
    
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <uni-icons type="search" size="18" color="#999"></uni-icons>
        <input type="text" placeholder="搜索课程" v-model="searchText" @confirm="searchCourses" />
      </view>
      <view class="filter-btn" @click="showFilterPopup">
        <uni-icons type="filter" size="18" color="#666"></uni-icons>
        <text>筛选</text>
      </view>
    </view>
    
    <!-- 分类标签 -->
    <scroll-view scroll-x class="category-tags">
      <view class="tag" 
        v-for="(tag, index) in categoryTags" 
        :key="index" 
        :class="{ active: activeTag === index }"
        @click="selectTag(index)">
        {{ tag.name }}
      </view>
    </scroll-view>
    
    <!-- 推荐课程 -->
    <view class="section" v-if="activeTag === 0">
      <view class="section-header">
        <text class="section-title">推荐课程</text>
        <view class="more-link" @click="viewMoreCourses('recommend')">
          <text>查看更多</text>
          <uni-icons type="arrowright" size="14" color="#999"></uni-icons>
        </view>
      </view>
      
      <view class="course-list">
        <view class="featured-course" @click="viewCourseDetail(featuredCourse)">
          <image class="course-image" :src="featuredCourse.image" mode="aspectFill"></image>
          <view class="course-info">
            <view class="course-title">{{ featuredCourse.title }}</view>
            <view class="course-meta">
              <view class="meta-item">
                <uni-icons type="videofill" size="14" color="#999"></uni-icons>
                <text>{{ featuredCourse.lessons }}课时</text>
              </view>
              <view class="meta-item">
                <uni-icons type="personadd" size="14" color="#999"></uni-icons>
                <text>{{ featuredCourse.students }}人学习</text>
              </view>
            </view>
            <view class="course-tags">
              <view class="tag" v-for="(tag, tagIndex) in featuredCourse.tags" :key="tagIndex">{{ tag }}</view>
            </view>
          </view>
        </view>
        
        <view class="course-grid">
          <view class="course-item" v-for="(course, index) in recommendCourses" :key="index" @click="viewCourseDetail(course)">
            <image class="course-image" :src="course.image" mode="aspectFill"></image>
            <view class="course-title">{{ course.title }}</view>
            <view class="course-meta">
              <text class="course-price" v-if="course.price > 0">¥{{ course.price }}</text>
              <text class="course-free" v-else>免费</text>
              <text class="course-students">{{ course.students }}人在学</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 职场技能 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">职场技能</text>
        <view class="more-link" @click="viewMoreCourses('skill')">
          <text>查看更多</text>
          <uni-icons type="arrowright" size="14" color="#999"></uni-icons>
        </view>
      </view>
      
      <view class="course-grid">
        <view class="course-item" v-for="(course, index) in skillCourses" :key="index" @click="viewCourseDetail(course)">
          <image class="course-image" :src="course.image" mode="aspectFill"></image>
          <view class="course-title">{{ course.title }}</view>
          <view class="course-meta">
            <text class="course-price" v-if="course.price > 0">¥{{ course.price }}</text>
            <text class="course-free" v-else>免费</text>
            <text class="course-students">{{ course.students }}人在学</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 行业认证 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">行业认证</text>
        <view class="more-link" @click="viewMoreCourses('certification')">
          <text>查看更多</text>
          <uni-icons type="arrowright" size="14" color="#999"></uni-icons>
        </view>
      </view>
      
      <view class="certification-list">
        <view class="certification-item" v-for="(cert, index) in certifications" :key="index" @click="viewCertDetail(cert)">
          <image class="cert-logo" :src="cert.logo" mode="aspectFit"></image>
          <view class="cert-info">
            <view class="cert-title">{{ cert.title }}</view>
            <view class="cert-desc">{{ cert.description }}</view>
            <view class="cert-meta">
              <text class="cert-level">{{ cert.level }}</text>
              <text class="cert-students">{{ cert.students }}人报名</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 我的学习 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">我的学习</text>
        <view class="more-link" @click="viewMyCourses">
          <text>全部</text>
          <uni-icons type="arrowright" size="14" color="#999"></uni-icons>
        </view>
      </view>
      
      <view class="my-courses" v-if="myCourses.length > 0">
        <view class="my-course-item" v-for="(course, index) in myCourses" :key="index" @click="continueLearning(course)">
          <image class="course-image" :src="course.image" mode="aspectFill"></image>
          <view class="course-info">
            <view class="course-title">{{ course.title }}</view>
            <view class="progress-bar">
              <view class="progress-inner" :style="{ width: course.progress + '%' }"></view>
            </view>
            <view class="course-progress">学习进度 {{ course.progress }}%</view>
          </view>
          <view class="continue-btn">继续学习</view>
        </view>
      </view>
      
      <view class="empty-learning" v-else>
        <image src="/static/img/icons/empty-course.png" mode="aspectFit"></image>
        <text>暂无学习记录</text>
        <button class="explore-btn" @click="exploreRecommend">探索课程</button>
      </view>
    </view>
    
    <!-- 筛选弹窗 -->
    <uni-popup ref="filterPopup" type="bottom">
      <view class="filter-popup">
        <view class="popup-header">
          <text>课程筛选</text>
          <view class="close-btn" @click="hideFilterPopup">×</view>
        </view>
        
        <view class="filter-section">
          <view class="section-title">类型</view>
          <view class="filter-options">
            <view class="option" 
              v-for="(option, index) in typeFilters" 
              :key="index" 
              :class="{ active: filters.type === option.value }"
              @click="selectTypeFilter(option.value)">
              {{ option.label }}
            </view>
          </view>
        </view>
        
        <view class="filter-section">
          <view class="section-title">价格</view>
          <view class="filter-options">
            <view class="option" 
              v-for="(option, index) in priceFilters" 
              :key="index"
              :class="{ active: filters.price === option.value }"
              @click="selectPriceFilter(option.value)">
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
      searchText: '',
      activeTag: 0,
      filters: {
        type: '',
        price: ''
      },
      categoryTags: [
        { name: '推荐', value: 'recommend' },
        { name: '技能培训', value: 'skill' },
        { name: '职业素养', value: 'professional' },
        { name: '安全教育', value: 'safety' },
        { name: '岗位技能', value: 'job' },
        { name: '认证课程', value: 'certification' }
      ],
      typeFilters: [
        { label: '全部', value: '' },
        { label: '视频课程', value: 'video' },
        { label: '图文教程', value: 'article' },
        { label: '直播课程', value: 'live' }
      ],
      priceFilters: [
        { label: '全部', value: '' },
        { label: '免费', value: 'free' },
        { label: '付费', value: 'paid' }
      ],
      featuredCourse: {
        id: '1',
        title: '零工岗位操作安全培训',
        description: '学习各类零工岗位的安全操作规范，提高工作安全意识，减少工作风险。',
        image: '/static/img/training/safety.jpg',
        lessons: 8,
        students: 1256,
        price: 0,
        tags: ['安全教育', '必学']
      },
      recommendCourses: [
        {
          id: '2',
          title: '外卖配送技能提升',
          image: '/static/img/training/delivery.jpg',
          lessons: 6,
          students: 892,
          price: 0
        },
        {
          id: '3',
          title: '客户服务与沟通技巧',
          image: '/static/img/training/service.jpg',
          lessons: 10,
          students: 756,
          price: 29.9
        },
        {
          id: '4',
          title: '零工权益保障课程',
          image: '/static/img/training/rights.jpg',
          lessons: 4,
          students: 620,
          price: 0
        }
      ],
      skillCourses: [
        {
          id: '5',
          title: '高效时间管理',
          image: '/static/img/training/time.jpg',
          lessons: 5,
          students: 438,
          price: 19.9
        },
        {
          id: '6',
          title: '职场沟通与协作',
          image: '/static/img/training/communication.jpg',
          lessons: 8,
          students: 526,
          price: 39.9
        },
        {
          id: '7',
          title: '面试技巧精讲',
          image: '/static/img/training/interview.jpg',
          lessons: 6,
          students: 782,
          price: 0
        },
        {
          id: '8',
          title: '职业规划指导',
          image: '/static/img/training/career.jpg',
          lessons: 12,
          students: 345,
          price: 49.9
        }
      ],
      certifications: [
        {
          id: 'cert1',
          title: '快递员职业技能等级认证',
          description: '国家邮政局认可的快递员职业技能等级认证，提升就业竞争力。',
          logo: '/static/img/certification/delivery.png',
          level: '初级/中级/高级',
          students: 432
        },
        {
          id: 'cert2',
          title: '餐饮服务食品安全认证',
          description: '餐饮行业从业人员必备的食品安全认证，提高就业机会。',
          logo: '/static/img/certification/food.png',
          level: '基础级',
          students: 685
        }
      ],
      myCourses: [
        {
          id: '1',
          title: '零工岗位操作安全培训',
          image: '/static/img/training/safety.jpg',
          progress: 75,
          lastLesson: '第6课：紧急情况处理'
        }
      ]
    }
  },
  methods: {
    searchCourses() {
      console.log('搜索课程:', this.searchText)
      // 实际应用中应调用API进行搜索
      uni.showToast({
        title: '搜索功能开发中',
        icon: 'none'
      })
    },
    
    selectTag(index) {
      this.activeTag = index
    },
    
    viewMoreCourses(category) {
      uni.navigateTo({
        url: `/pages/training/courseList?category=${category}`
      })
    },
    
    viewCourseDetail(course) {
      uni.navigateTo({
        url: `/pages/training/courseDetail?id=${course.id}`
      })
    },
    
    viewCertDetail(cert) {
      uni.navigateTo({
        url: `/pages/training/certificationDetail?id=${cert.id}`
      })
    },
    
    viewMyCourses() {
      uni.navigateTo({
        url: '/pages/training/myCourses'
      })
    },
    
    continueLearning(course) {
      uni.navigateTo({
        url: `/pages/training/learning?id=${course.id}`
      })
    },
    
    exploreRecommend() {
      this.activeTag = 0
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },
    
    showFilterPopup() {
      this.$refs.filterPopup.open()
    },
    
    hideFilterPopup() {
      this.$refs.filterPopup.close()
    },
    
    selectTypeFilter(value) {
      this.filters.type = value
    },
    
    selectPriceFilter(value) {
      this.filters.price = value
    },
    
    resetFilters() {
      this.filters = {
        type: '',
        price: ''
      }
    },
    
    applyFilters() {
      console.log('应用筛选:', this.filters)
      this.hideFilterPopup()
      
      // 实际应用中应调用API获取筛选结果
      uni.showToast({
        title: '筛选已应用',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss">
.training-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  
  .search-bar {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #FFFFFF;
    
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
  
  .category-tags {
    white-space: nowrap;
    padding: 20rpx 30rpx;
    background-color: #FFFFFF;
    border-top: 1rpx solid #F5F5F5;
    
    .tag {
      display: inline-block;
      padding: 10rpx 30rpx;
      margin-right: 20rpx;
      font-size: 26rpx;
      color: #666;
      background-color: #F5F5F5;
      border-radius: 30rpx;
      
      &.active {
        background-color: #4CAF50;
        color: #FFFFFF;
      }
    }
  }
  
  .section {
    margin-top: 20rpx;
    background-color: #FFFFFF;
    padding: 20rpx 0;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30rpx;
      margin-bottom: 20rpx;
      
      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        position: relative;
        padding-left: 20rpx;
        
        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 8rpx;
          width: 6rpx;
          height: 28rpx;
          background-color: #4CAF50;
          border-radius: 3rpx;
        }
      }
      
      .more-link {
        display: flex;
        align-items: center;
        
        text {
          font-size: 26rpx;
          color: #999;
          margin-right: 6rpx;
        }
      }
    }
    
    .course-list {
      padding: 0 30rpx;
    }
    
    .featured-course {
      display: flex;
      background-color: #F9F9F9;
      border-radius: 12rpx;
      overflow: hidden;
      margin-bottom: 30rpx;
      
      .course-image {
        width: 240rpx;
        height: 180rpx;
      }
      
      .course-info {
        flex: 1;
        padding: 20rpx;
        
        .course-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 10rpx;
        }
        
        .course-meta {
          display: flex;
          margin-bottom: 10rpx;
          
          .meta-item {
            display: flex;
            align-items: center;
            margin-right: 20rpx;
            
            text {
              font-size: 24rpx;
              color: #999;
              margin-left: 6rpx;
            }
          }
        }
        
        .course-tags {
          display: flex;
          
          .tag {
            font-size: 22rpx;
            color: #4CAF50;
            background-color: rgba(76, 175, 80, 0.1);
            padding: 4rpx 12rpx;
            border-radius: 4rpx;
            margin-right: 10rpx;
          }
        }
      }
    }
    
    .course-grid {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -10rpx;
      
      .course-item {
        width: calc(50% - 20rpx);
        margin: 0 10rpx 20rpx;
        background-color: #FFFFFF;
        border-radius: 12rpx;
        overflow: hidden;
        box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
        
        .course-image {
          width: 100%;
          height: 200rpx;
        }
        
        .course-title {
          font-size: 26rpx;
          font-weight: bold;
          color: #333;
          margin: 16rpx;
          height: 72rpx;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .course-meta {
          display: flex;
          justify-content: space-between;
          padding: 0 16rpx 16rpx;
          
          .course-price {
            font-size: 26rpx;
            font-weight: bold;
            color: #FF5722;
          }
          
          .course-free {
            font-size: 26rpx;
            color: #4CAF50;
          }
          
          .course-students {
            font-size: 22rpx;
            color: #999;
          }
        }
      }
    }
    
    .certification-list {
      padding: 0 30rpx;
      
      .certification-item {
        display: flex;
        background-color: #FFFFFF;
        border-radius: 12rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
        
        .cert-logo {
          width: 100rpx;
          height: 100rpx;
          margin-right: 20rpx;
        }
        
        .cert-info {
          flex: 1;
          
          .cert-title {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 10rpx;
          }
          
          .cert-desc {
            font-size: 24rpx;
            color: #666;
            margin-bottom: 10rpx;
            line-height: 1.4;
          }
          
          .cert-meta {
            display: flex;
            justify-content: space-between;
            
            .cert-level {
              font-size: 24rpx;
              color: #FF9800;
            }
            
            .cert-students {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
      }
    }
    
    .my-courses {
      padding: 0 30rpx;
      
      .my-course-item {
        display: flex;
        align-items: center;
        background-color: #FFFFFF;
        border-radius: 12rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
        
        .course-image {
          width: 120rpx;
          height: 90rpx;
          border-radius: 8rpx;
          margin-right: 20rpx;
        }
        
        .course-info {
          flex: 1;
          
          .course-title {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 10rpx;
          }
          
          .progress-bar {
            width: 100%;
            height: 8rpx;
            background-color: #F5F5F5;
            border-radius: 4rpx;
            margin-bottom: 10rpx;
            
            .progress-inner {
              height: 100%;
              background-color: #4CAF50;
              border-radius: 4rpx;
            }
          }
          
          .course-progress {
            font-size: 24rpx;
            color: #999;
          }
        }
        
        .continue-btn {
          padding: 10rpx 20rpx;
          background-color: #4CAF50;
          color: #FFFFFF;
          font-size: 24rpx;
          border-radius: 30rpx;
        }
      }
    }
    
    .empty-learning {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 50rpx 0;
      
      image {
        width: 200rpx;
        height: 200rpx;
        margin-bottom: 20rpx;
      }
      
      text {
        font-size: 28rpx;
        color: #999;
        margin-bottom: 30rpx;
      }
      
      .explore-btn {
        width: 240rpx;
        height: 70rpx;
        line-height: 70rpx;
        background-color: #4CAF50;
        color: #FFFFFF;
        font-size: 28rpx;
        border-radius: 35rpx;
      }
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