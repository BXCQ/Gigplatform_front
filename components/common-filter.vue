<template>
  <view class="filter-container">
    <!-- 筛选标题栏 -->
    <view class="cu-bar bg-white solid-bottom" @tap="toggleShowFilter">
      <view class="filter-title">
        <text>{{ title }}</text>
        <view class="cuIcon-triangledownfill" :class="showFilter ? 'rotate180' : ''"></view>
      </view>
    </view>
    
    <!-- 筛选内容 -->
    <view class="filter-content bg-white" v-if="showFilter">
      <scroll-view scroll-y class="filter-scroll">
        <view class="padding-sm" v-for="(section, sectionIndex) in filterOptions" :key="sectionIndex">
          <view class="text-bold text-black padding-bottom-xs">{{ section.title }}</view>
          <view class="cu-tag-group">
            <view 
              class="cu-tag" 
              :class="[isOptionSelected(section.key, option.value) ? 'bg-green light' : 'line-gray']" 
              v-for="(option, optionIndex) in section.options" 
              :key="optionIndex"
              @tap="selectOption(section.key, option.value)"
            >
              {{ option.label }}
            </view>
          </view>
        </view>
      </scroll-view>
      
      <view class="cu-bar bg-white solid-top">
        <view class="action margin-0 flex flex-1">
          <button class="cu-btn line-gray round shadow margin-right-sm flex-1" @tap="resetFilter">重置</button>
          <button class="cu-btn bg-green round shadow flex-1" @tap="confirmFilter">确定</button>
        </view>
      </view>
    </view>
    
    <!-- 遮罩层 -->
    <view class="cu-modal" :class="showFilter ? 'show' : ''" @tap="toggleShowFilter"></view>
  </view>
</template>

<script>
export default {
  name: 'common-filter',
  props: {
    title: {
      type: String,
      default: '筛选'
    },
    filterOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showFilter: false,
      selectedOptions: {},
      confirmedOptions: null
    }
  },
  created() {
    // 初始化已选项
    this.filterOptions.forEach(section => {
      if (section.key) {
        this.selectedOptions[section.key] = section.defaultValue || null
      }
    })
  },
  methods: {
    toggleShowFilter() {
      this.showFilter = !this.showFilter
      
      // 如果关闭筛选，恢复到上次确认的选项
      if (!this.showFilter && this.confirmedOptions) {
        this.selectedOptions = JSON.parse(JSON.stringify(this.confirmedOptions))
      }
    },
    isOptionSelected(key, value) {
      return this.selectedOptions[key] === value
    },
    selectOption(key, value) {
      // 如果已经选中则取消选中
      if (this.selectedOptions[key] === value) {
        this.selectedOptions[key] = null
      } else {
        this.selectedOptions[key] = value
      }
    },
    resetFilter() {
      // 重置所有选项
      this.filterOptions.forEach(section => {
        if (section.key) {
          this.selectedOptions[section.key] = null
        }
      })
    },
    confirmFilter() {
      // 保存确认后的选项
      this.confirmedOptions = JSON.parse(JSON.stringify(this.selectedOptions))
      this.showFilter = false
      
      // 将选中结果发送给父组件
      this.$emit('filter-change', this.selectedOptions)
    }
  }
}
</script>

<style lang="scss">
.filter-container {
  position: relative;
  z-index: 100;
  
  .filter-title {
    display: flex;
    align-items: center;
    justify-content: center;
    
    text {
      font-size: 28rpx;
      margin-right: 8rpx;
    }
    
    .rotate180 {
      transform: rotate(180deg);
      transition: transform 0.3s;
    }
    
    .cuIcon-triangledownfill {
      font-size: 24rpx;
      transition: transform 0.3s;
    }
  }
  
  .filter-content {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 110;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
    
    .filter-scroll {
      max-height: 600rpx;
    }
    
    .cu-tag-group {
      display: flex;
      flex-wrap: wrap;
      
      .cu-tag {
        margin: 10rpx 20rpx 10rpx 0;
      }
    }
  }
}
</style> 