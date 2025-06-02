<template>
  <view class="job-type-container">
    <!-- 自定义导航栏 -->
    <view class="cu-custom">
      <view class="cu-bar fixed bg-white" style="height:90rpx;">
        <navigator class="action" open-type="navigateBack" delta="1">
          <text class="cuIcon-back"></text>
        </navigator>
        <view class="content">工种选择</view>
        <view class="action">
          <button class="cu-btn bg-white" @tap="resetSelection">重置</button>
        </view>
      </view>
    </view>
    
    <!-- 主要类别列表 -->
    <view class="main-categories">
      <scroll-view scroll-y class="category-list">
        <view 
          class="category-item" 
          v-for="(category, index) in categories" 
          :key="index"
          :class="{active: currentCategoryIndex === index}"
          @tap="selectCategory(index)"
        >
          <text>{{category.name}}</text>
        </view>
      </scroll-view>
    </view>
    
    <!-- 子类别展示区 -->
    <view class="sub-categories">
      <view class="sub-category-grid">
        <view 
          class="sub-category-item" 
          v-for="(item, index) in currentSubCategories" 
          :key="index"
          :class="{selected: selectedTypes.includes(item)}"
          @tap="toggleSelection(item)"
        >
          <text>{{item}}</text>
        </view>
      </view>
    </view>
    
    <!-- 底部确认按钮 -->
    <view class="bottom-actions">
      <button class="confirm-btn" @tap="confirmSelection">确定</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentCategoryIndex: 0,
      selectedTypes: [],
      categories: [
        {
          name: '建筑装修',
          subCategories: ['装修工', '油漆/修缮', '水电工', '木工', '泥工', '搬运工', '普工']
        },
        {
          name: '农时帮工',
          subCategories: ['种植', '采摘', '农机操作', '养殖']
        },
        {
          name: '其他',
          subCategories: ['传单派发', '促销员', '临时工']
        },
        {
          name: '网约配送',
          subCategories: ['外卖配送', '快递配送', '代驾']
        },
        {
          name: '家庭保洁',
          subCategories: ['日常保洁', '深度保洁', '家电清洗', '开荒保洁']
        },
        {
          name: '仓库管理',
          subCategories: ['仓库整理', '库存盘点', '分拣员', '包装工']
        },
        {
          name: '假期兼职',
          subCategories: ['节假日兼职', '寒暑假工', '周末兼职']
        }
      ]
    }
  },
  computed: {
    currentSubCategories() {
      return this.categories[this.currentCategoryIndex].subCategories
    }
  },
  methods: {
    // 选择主分类
    selectCategory(index) {
      this.currentCategoryIndex = index
    },
    
    // 切换选择状态
    toggleSelection(item) {
      const index = this.selectedTypes.indexOf(item)
      if (index === -1) {
        this.selectedTypes.push(item)
      } else {
        this.selectedTypes.splice(index, 1)
      }
    },
    
    // 重置选择
    resetSelection() {
      this.selectedTypes = []
    },
    
    // 确认选择
    confirmSelection() {
      if (this.selectedTypes.length === 0) {
        uni.showToast({
          title: '请至少选择一个工种',
          icon: 'none'
        })
        return
      }
      
      // 将选择结果传回发布页面
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      
      if (prevPage) {
        // 更新上一页的数据
        prevPage.$vm.formData.jobType = this.selectedTypes.join('、')
        
        uni.navigateBack({
          delta: 1
        })
      }
    }
  }
}
</script>

<style lang="scss">
.job-type-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 90rpx;
  background-color: #F5F5F5;
  
  .main-categories {
    width: 200rpx;
    position: absolute;
    left: 0;
    top: 90rpx;
    bottom: 120rpx;
    background-color: #F2F2F2;
    
    .category-list {
      height: 100%;
      
      .category-item {
        height: 100rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        color: #666666;
        text-align: center;
        padding: 0 20rpx;
        position: relative;
        
        &.active {
          background-color: #FFFFFF;
          color: #4169E1;
          font-weight: bold;
          
          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 8rpx;
            background-color: #4169E1;
          }
        }
      }
    }
  }
  
  .sub-categories {
    position: absolute;
    left: 200rpx;
    right: 0;
    top: 90rpx;
    bottom: 120rpx;
    background-color: #FFFFFF;
    padding: 20rpx;
    
    .sub-category-grid {
      display: flex;
      flex-wrap: wrap;
      
      .sub-category-item {
        width: calc(33.33% - 20rpx);
        height: 80rpx;
        margin: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2rpx solid #EEEEEE;
        border-radius: 10rpx;
        font-size: 28rpx;
        color: #666666;
        
        &.selected {
          background-color: #E7F1FF;
          color: #4169E1;
          border-color: #4169E1;
        }
      }
    }
  }
  
  .bottom-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120rpx;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 30rpx;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .confirm-btn {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      background-color: #4169E1;
      color: #FFFFFF;
      font-size: 30rpx;
      border-radius: 40rpx;
    }
  }
}
</style> 