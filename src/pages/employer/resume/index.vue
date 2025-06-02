<template>
    <view class="resume-container">
        <employer-navbar title="雇员简历">
            <template #right>
                <view class="filter-btn" @tap="showFilter">
                    <text class="cuIcon-filter"></text>
                </view>
            </template>
        </employer-navbar>
        
        <!-- 页面内容 -->
        <view class="content" style="margin-top: 90rpx;">
            <!-- 绿色背景头部 -->
            <view class="header-bg">
                <!-- 搜索栏 -->
                <view class="search-bar">
                    <view class="search-input">
                        <text class="cuIcon-search text-gray"></text>
                        <input type="text" placeholder="搜索您想找的工作类型" confirm-type="search" v-model="searchText"></input>
                    </view>
                    <button class="search-btn" @tap="search">搜索</button>
                </view>
                
                <!-- 筛选条件选择 -->
                <view class="filter-tabs">
                    <view class="filter-item" @tap="showFilterPopup('age')">
                        <text>{{getFilterLabel('age')}}</text>
                        <text class="cuIcon-unfold"></text>
                    </view>
                    <view class="filter-item" @tap="showFilterPopup('education')">
                        <text>{{getFilterLabel('education')}}</text>
                        <text class="cuIcon-unfold"></text>
                    </view>
                </view>
                
                <!-- 分类图标 -->
                <view class="category-icons">
                    <view class="category-item" 
                          v-for="(category, index) in categories" 
                          :key="index" 
                          @tap="selectCategory(category)"
                          :class="{'active': filter.jobType === category.skills}">
                        <view class="category-icon">
                            <image :src="category.icon" mode="aspectFit"></image>
                        </view>
                        <text class="category-name">{{category.name}}</text>
                    </view>
                </view>
            </view>
            
            <!-- 零工列表 -->
            <view class="worker-list">
                <view class="worker-item" v-for="(item, index) in filteredResumeList" :key="index" @tap="goToDetail(item)">
                    <!-- 基本信息区域 -->
                    <view class="worker-basic-info">
                        <view class="worker-avatar">
                            <image :src="item.avatar" mode="aspectFill"></image>
                        </view>
                        <view class="worker-main">
                            <view class="worker-name-row">
                                <text class="worker-name">{{item.name}}</text>
                                <text class="worker-gender">{{item.gender}}</text>
                                <text class="worker-age">{{item.age}}岁</text>
                            </view>
                            <view class="worker-tags">
                                <text class="tag education">{{item.education}}</text>
                                <text class="tag" v-if="item.rating > 0">
                                    <text class="cuIcon-favor text-yellow"></text>
                                    {{item.rating.toFixed(1)}}
                                </text>
                                <text class="tag" v-if="item.certificationCount > 0">
                                    <text class="cuIcon-roundcheckfill text-green"></text>
                                    已认证
                                </text>
                                <text class="tag" v-if="item.hasInsurance">
                                    <text class="cuIcon-safe text-blue"></text>
                                    已投保
                                </text>
                            </view>
                        </view>
                        <view class="worker-price">
                            <text class="price">¥{{item.hourlyRate}}</text>
                            <text class="unit">/小时</text>
                        </view>
                    </view>

                    <!-- 详细信息区域 -->
                    <view class="worker-detail-info">
                        <view class="info-row">
                            <view class="info-item">
                                <text class="cuIcon-location"></text>
                                <text>{{item.location}}</text>
                            </view>
                            <view class="info-item">
                                <text class="cuIcon-work"></text>
                                <text>{{item.jobType}}</text>
                            </view>
                        </view>
                        <view class="info-row">
                            <view class="info-item" v-if="item.jobsCompleted > 0">
                                <text class="cuIcon-check"></text>
                                <text>已完成{{item.jobsCompleted}}份工作</text>
                            </view>
                            <view class="info-item" v-if="item.availability">
                                <text class="cuIcon-time"></text>
                                <text>{{item.availability}}</text>
                            </view>
                        </view>
                        <view class="info-row" v-if="item.description">
                            <view class="info-item description">
                                <text class="cuIcon-titles"></text>
                                <text>{{item.description}}</text>
                            </view>
                        </view>
                    </view>

                    <!-- 操作按钮区域 -->
                    <view class="worker-actions">
                        <button class="action-btn bg-red" @tap.stop="recommendJob(item)">推单记录</button>
                        <button class="action-btn bg-blue" @tap.stop="forwardJob(item)">推单给他</button>
                        <button class="action-btn bg-orange" @tap.stop="evaluate(item)">查看评价</button>
                    </view>
                </view>
                
                <!-- 加载状态 -->
                <view class="cu-load" :class="loadingStatus"></view>
            </view>
        </view>
        
        <!-- 底部导航栏 -->
        <employer-tabbar current-tab="resume"></employer-tabbar>
    </view>
</template>

<script>
import EmployerNavbar from '@/components/employer-navbar.vue'
import EmployerTabbar from '@/components/employer-tabbar.vue'
import IdentitySwitch from '@/components/identity-switch.vue'
import API from '@/api/index.js'

export default {
    components: {
        EmployerNavbar,
        EmployerTabbar,
        IdentitySwitch
    },
    data() {
        return {
            searchText: '',
            filter: {},
            categories: [
                { id: 1, name: '家政服务', icon: '/static/img/category/1.png', skills: '保洁,家政' },
                { id: 2, name: '物流配送', icon: '/static/img/category/2.png', skills: '物流,配送' },
                { id: 3, name: '制造业', icon: '/static/img/category/3.png', skills: '制造,工厂' },
                { id: 4, name: '医疗陪诊', icon: '/static/img/category/4.png', skills: '医疗,陪诊' },
                { id: 5, name: '餐饮服务', icon: '/static/img/category/5.png', skills: '餐饮,厨师' },
                { id: 6, name: '搬运装卸', icon: '/static/img/category/6.png', skills: '搬运,装卸' },
                { id: 7, name: '保洁服务', icon: '/static/img/category/7.png', skills: '保洁,清洁' },
                { id: 8, name: '专业技工', icon: '/static/img/category/8.png', skills: '技工,维修' },
                { id: 9, name: '临时工', icon: '/static/img/category/9.png', skills: '临时,兼职' },
                { id: 10, name: '更多服务', icon: '/static/img/category/10.png', skills: '其他' }
            ],
            filterOptions: {
                age: [
                    { label: '不限', value: '' },
                    { label: '18-25岁', value: '18-25' },
                    { label: '26-35岁', value: '26-35' },
                    { label: '36-45岁', value: '36-45' },
                    { label: '46-55岁', value: '46-55' },
                    { label: '55岁以上', value: '55+' }
                ],
                education: [
                    { label: '不限', value: '' },
                    { label: '初中及以下', value: '初中及以下' },
                    { label: '高中/中专', value: '高中' },
                    { label: '大专', value: '大专' },
                    { label: '本科及以上', value: '本科及以上' }
                ]
            },
            resumeList: [],
            loadingStatus: 'loading',
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            isLoadingMore: false
        }
    },
    computed: {
        filteredResumeList() {
            if (!this.filter || Object.keys(this.filter).length === 0) {
                return this.resumeList;
            }
            
            return this.resumeList.filter(resume => {
                let isMatch = true;
                
                // 年龄过滤
                if (this.filter.age) {
                    const ageRange = this.filter.age.split('-');
                    if (ageRange.length === 2) {
                        const min = parseInt(ageRange[0]);
                        const max = parseInt(ageRange[1]);
                        isMatch = isMatch && resume.age >= min && resume.age <= max;
                    } else if (this.filter.age === '55+') {
                        isMatch = isMatch && resume.age > 55;
                    }
                }
                
                // 学历过滤
                if (this.filter.education && resume.education !== this.filter.education) {
                    isMatch = false;
                }
                
                // 工种过滤
                if (this.filter.jobType && resume.jobType !== this.filter.jobType) {
                    isMatch = false;
                }
                
                // 区域过滤
                if (this.filter.location && !resume.location.includes(this.filter.location)) {
                    isMatch = false;
                }
                
                return isMatch;
            });
        }
    },
    onLoad() {
        this.loadResumeList();
    },
    methods: {
        loadResumeList(loadMore = false) {
            if (loadMore && this.currentPage >= this.totalPages) {
                this.loadingStatus = 'nomore';
                return;
            }
            
            this.loadingStatus = 'loading';
            
            if (!loadMore) {
                this.currentPage = 1;
            }
            
            const params = {
                page: this.currentPage,
                limit: this.pageSize
            };
            
            if (this.searchText && this.searchText.trim()) {
                params.search = this.searchText.trim();
            }
            
            if (this.filter.age) {
                params.age = this.filter.age;
            }
            if (this.filter.education) {
                params.education = this.filter.education;
            }
            if (this.filter.jobType) {
                params.skills = this.filter.jobType;
            }
            if (this.filter.location) {
                params.location = this.filter.location;
            }
            
            API.getWorkerList(params).then(response => {
                if (response && response.data && response.data.records) {
                    const workers = response.data.records || [];
                    this.totalPages = response.data.totalPage || 1;
                    
                    const formattedWorkers = workers.map(worker => {
                        return {
                            id: worker.id,
                            name: worker.fullName || '零工用户',
                            avatar: worker.extraProperties?.avatar || '/static/img/default-avatar.png',
                            age: worker.age || 0,
                            gender: worker.gender === 'male' ? '男' : worker.gender === 'female' ? '女' : '未知',
                            education: worker.education || '学历未知',
                            jobType: worker.skills || '无技能信息',
                            location: '厦门市',
                            lastActive: this.formatTimeAgo(worker.updatedAt),
                            description: worker.experience || '',
                            rating: worker.rating || 0,
                            certificationCount: worker.certificationCount || 0,
                            jobsCompleted: worker.jobsCompleted || 0,
                            hasInsurance: worker.hasInsurance === 'yes',
                            hourlyRate: worker.hourlyRate || 0,
                            availability: worker.availability || '时间未知'
                        };
                    });
                    
                    if (loadMore) {
                        this.resumeList = [...this.resumeList, ...formattedWorkers];
                    } else {
                        this.resumeList = formattedWorkers;
                    }
                    
                    if (this.currentPage >= this.totalPages || formattedWorkers.length === 0) {
                        this.loadingStatus = 'nomore';
                    } else {
                        this.loadingStatus = 'loadmore';
                    }
                    
                    if (loadMore && formattedWorkers.length > 0) {
                        this.currentPage++;
                    }

                    if (!loadMore && formattedWorkers.length === 0) {
                        uni.showToast({
                            title: '暂无符合条件的零工',
                            icon: 'none'
                        });
                    }
                } else {
                    if (!loadMore) {
                        this.showExampleData();
                    }
                    this.loadingStatus = 'nomore';
                    
                    uni.showToast({
                        title: '获取数据失败',
                        icon: 'none'
                    });
                }
            }).catch(error => {
                console.error('获取零工列表失败', error);
                uni.showToast({
                    title: '获取列表失败',
                    icon: 'none'
                });
                if (!loadMore) {
                    this.showExampleData();
                }
                this.loadingStatus = 'nomore';
            }).finally(() => {
                this.isLoadingMore = false;
                uni.stopPullDownRefresh();
            });
        },
        
        // 从经验描述中提取工作年限
        extractWorkYears(experience) {
            if (!experience) return 0;
            const match = experience.match(/(\d+)年/);
            return match ? parseInt(match[1]) : 0;
        },
        
        // 格式化时间为"多久前"的形式
        formatTimeAgo(dateStr) {
            try {
                const date = new Date(dateStr);
                const now = new Date();
                const diffMs = now - date;
                
                // 转换为分钟
                const diffMins = Math.floor(diffMs / (1000 * 60));
                
                if (diffMins < 60) {
                    return `${diffMins}分钟前`;
                }
                
                const diffHours = Math.floor(diffMins / 60);
                if (diffHours < 24) {
                    return `${diffHours}小时前`;
                }
                
                const diffDays = Math.floor(diffHours / 24);
                if (diffDays < 30) {
                    return `${diffDays}天前`;
                }
                
                const diffMonths = Math.floor(diffDays / 30);
                return `${diffMonths}月前`;
                
            } catch (e) {
                return '未知时间';
            }
        },
        
        // 显示示例数据
        showExampleData() {
            this.resumeList = [
                {
                    id: '1',
                    name: '张明',
                    avatar: '/static/img/default-avatar.png',
                    age: 28,
                    gender: '男',
                    education: '烹饪学校毕业',
                    jobType: '厨师、中餐、西餐',
                    workYears: 5,
                    location: '厦门市',
                    lastActive: '昨天',
                    description: '5年餐饮行业工作经验，擅长中西餐制作',
                    rating: 4.8,
                    certificationCount: 3,
                    jobsCompleted: 20,
                    hasInsurance: true,
                    hourlyRate: 50,
                    availability: '周一至周五 9:00-18:00'
                },
                {
                    id: '2',
                    name: '李红',
                    avatar: '/static/img/default-avatar.png',
                    age: 35,
                    gender: '女',
                    education: '高中',
                    jobType: '保洁、家政',
                    workYears: 3,
                    location: '厦门市',
                    lastActive: '3小时前',
                    description: '3年家政服务经验，擅长家居清洁和整理',
                    rating: 4.5,
                    certificationCount: 2,
                    jobsCompleted: 15,
                    hasInsurance: true,
                    hourlyRate: 35,
                    availability: '全天'
                },
                {
                    id: '3',
                    name: '王强',
                    avatar: '/static/img/default-avatar.png',
                    age: 32,
                    gender: '男',
                    education: '初中',
                    jobType: '搬运、装卸',
                    workYears: 8,
                    location: '厦门市',
                    lastActive: '5天前',
                    description: '8年物流行业经验，体力好',
                    rating: 4.7,
                    certificationCount: 1,
                    jobsCompleted: 25,
                    hasInsurance: true,
                    hourlyRate: 45,
                    availability: '全天'
                }
            ]
        },
        
        search() {
            console.log('搜索内容:', this.searchText);
            // 清空筛选条件
            this.filter = {};
            // 加载搜索结果
            this.loadResumeList(false);
        },
        
        // 获取筛选条件的显示文本
        getFilterLabel(type) {
            if (!this.filter[type]) {
                return type === 'age' ? '年龄' : '学历';
            }
            
            const options = this.filterOptions[type];
            const selected = options.find(option => option.value === this.filter[type]);
            return selected ? selected.label : '';
        },
        
        showFilterPopup(type) {
            uni.showActionSheet({
                itemList: this.filterOptions[type].map(item => item.label),
                success: res => {
                    const selectedOption = this.filterOptions[type][res.tapIndex];
                    if (selectedOption.value === '') {
                        // 如果选择"不限"，则删除该筛选条件
                        delete this.filter[type];
                    } else {
                        // 否则更新筛选条件
                        this.filter[type] = selectedOption.value;
                    }
                    // 应用筛选后刷新列表
                    this.loadResumeList(false);
                }
            });
        },
        
        selectCategory(category) {
            // 如果点击的是当前选中的分类，则取消选择
            if (this.filter.jobType === category.skills) {
                delete this.filter.jobType;
            } else {
                this.filter.jobType = category.skills;
            }
            this.loadResumeList(false);
        },
        
        goToDetail(resume) {
            uni.navigateTo({
                url: `/pages/employer/resume/detail?id=${resume.id}`
            });
        },
        
        recommendJob(worker) {
            uni.showToast({
                title: '推单记录',
                icon: 'none'
            });
        },
        
        forwardJob(worker) {
            uni.showToast({
                title: '推单给他',
                icon: 'none'
            });
        },
        
        evaluate(worker) {
            uni.showToast({
                title: '查看评价',
                icon: 'none'
            });
        },
        
        showFilter() {
            // 显示筛选面板
            uni.showToast({
                title: '筛选功能开发中',
                icon: 'none'
            })
        }
    },
    // 下拉刷新
    onPullDownRefresh() {
        this.loadResumeList(false);
    },
    
    // 上拉加载更多
    onReachBottom() {
        if (this.loadingStatus === 'loadmore' && !this.isLoadingMore) {
            this.isLoadingMore = true;
            this.loadResumeList(true);
        }
    }
}
</script>

<style lang="scss">
.resume-container {
    min-height: 100vh;
    background-color: #F5F5F5;
    
    .filter-btn {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        text {
            font-size: 40rpx;
            color: #333333;
        }
    }
}

.header-bg {
    background-color: #8BC34A;
    background-size: cover;
    padding: 40rpx 30rpx;
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    
    .header-title {
        color: #FFFFFF;
        font-size: 36rpx;
        font-weight: bold;
        margin-bottom: 30rpx;
        text-align: center;
    }
    
    .search-bar {
        display: flex;
        margin-bottom: 20rpx;
        
        .search-input {
            flex: 1;
            background-color: #FFFFFF;
            border-radius: 40rpx;
            padding: 10rpx 20rpx;
            display: flex;
            align-items: center;
            
            .cuIcon-search {
                margin-right: 10rpx;
                font-size: 36rpx;
            }
            
            input {
                flex: 1;
                height: 60rpx;
            }
        }
        
        .search-btn {
            width: 120rpx;
            height: 80rpx;
            background-color: #FFFFFF;
            border-radius: 40rpx;
            margin-left: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            color: #8e44ad;
        }
    }
    
    .filter-tabs {
        display: flex;
        justify-content: space-around;
        margin-bottom: 30rpx;
        
        .filter-item {
            display: flex;
            align-items: center;
            color: #FFFFFF;
            font-size: 26rpx;
            padding: 0 30rpx;
            
            text {
                max-width: 120rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .cuIcon-unfold {
                margin-left: 6rpx;
            }
        }
    }
    
    .category-icons {
        display: flex;
        flex-wrap: wrap;
        background-color: #fff;
        padding: 20rpx 10rpx;
        margin: 20rpx;
        border-radius: 16rpx;
        
        .category-item {
            width: 20%;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20rpx;
            position: relative;
            
            &.active {
                .category-icon {
                    background-color: rgba(139, 195, 74, 0.1);
                    border: 2rpx solid #8BC34A;
                }
                
                .category-name {
                    color: #8BC34A;
                }
                
                &::after {
                    content: '';
                    position: absolute;
                    bottom: -10rpx;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40rpx;
                    height: 4rpx;
                    background-color: #8BC34A;
                    border-radius: 2rpx;
                }
            }
            
            .category-icon {
                width: 80rpx;
                height: 80rpx;
                margin-bottom: 10rpx;
                border-radius: 50%;
                padding: 15rpx;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #f5f5f5;
                
                image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }
            
            .category-name {
                font-size: 24rpx;
                color: #333;
                transition: all 0.3s;
                text-align: center;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}

.worker-list {
    padding: 20rpx;
    
    .worker-item {
        background-color: #FFFFFF;
        border-radius: 20rpx;
        padding: 30rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

        .worker-basic-info {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20rpx;

            .worker-avatar {
                width: 100rpx;
                height: 100rpx;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 20rpx;
                flex-shrink: 0;

                image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .worker-main {
                flex: 1;
                margin-right: 20rpx;

                .worker-name-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10rpx;

                    .worker-name {
                        font-size: 32rpx;
                        font-weight: bold;
                        color: #333;
                        margin-right: 15rpx;
                    }

                    .worker-gender, .worker-age {
                        font-size: 26rpx;
                        color: #666;
                        margin-right: 15rpx;
                    }
                }

                .worker-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10rpx;

                    .tag {
                        display: inline-flex;
                        align-items: center;
                        padding: 4rpx 12rpx;
                        background-color: #f5f5f5;
                        border-radius: 6rpx;
                        font-size: 24rpx;
                        color: #666;

                        &.education {
                            background-color: #e8f5e9;
                            color: #4caf50;
                        }

                        .cuIcon-favor, .cuIcon-roundcheckfill, .cuIcon-safe {
                            margin-right: 4rpx;
                            font-size: 24rpx;
                        }
                    }
                }
            }

            .worker-price {
                text-align: right;
                flex-shrink: 0;

                .price {
                    font-size: 36rpx;
                    font-weight: bold;
                    color: #ff5722;
                }

                .unit {
                    font-size: 24rpx;
                    color: #999;
                }
            }
        }

        .worker-detail-info {
            border-top: 1rpx solid #f5f5f5;
            padding-top: 20rpx;
            margin-bottom: 20rpx;

            .info-row {
                display: flex;
                margin-bottom: 15rpx;

                &:last-child {
                    margin-bottom: 0;
                }

                .info-item {
                    display: flex;
                    align-items: center;
                    font-size: 26rpx;
                    color: #666;
                    margin-right: 30rpx;

                    &:last-child {
                        margin-right: 0;
                    }

                    &.description {
                        flex: 1;
                        margin-right: 0;
                    }

                    .cuIcon-location, .cuIcon-work, .cuIcon-check, .cuIcon-time, .cuIcon-titles {
                        font-size: 28rpx;
                        color: #4169e1;
                        margin-right: 8rpx;
                    }
                }
            }
        }

        .worker-actions {
            display: flex;
            gap: 20rpx;
            margin-top: 20rpx;

            .action-btn {
                flex: 1;
                height: 70rpx;
                line-height: 70rpx;
                font-size: 26rpx;
                border-radius: 35rpx;
                color: #FFFFFF;
                padding: 0;
                text-align: center;

                &.bg-red {
                    background-color: #ff5722;
                }

                &.bg-blue {
                    background-color: #2196f3;
                }

                &.bg-orange {
                    background-color: #ff9800;
                }
            }
        }
    }
}

.tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background-color: #FFFFFF;
    display: flex;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 999;
}

.tabbar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.tabbar-icon {
    width: 56rpx;
    height: 56rpx;
    margin-bottom: 4rpx;
}

.tabbar-item text {
    font-size: 24rpx;
    color: #666666;
}

.tabbar-item.active text {
    color: #4169E1;
}

// 加载状态样式
.cu-load {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20rpx auto;
    font-size: 28rpx;
    color: #999;
    padding: 20rpx 0;
    
    &.loading::after {
        content: "";
        width: 40rpx;
        height: 40rpx;
        display: block;
        background-color: transparent;
        border: 6rpx solid #8BC34A;
        border-top-color: transparent;
        border-radius: 50%;
        animation: cuLoading 1s infinite linear;
        margin-right: 20rpx;
    }
    
    &.over::before {
        content: "";
        width: 200rpx;
        height: 1rpx;
        background-color: rgba(0, 0, 0, 0.1);
        display: block;
        margin-right: 20rpx;
    }
    
    &.over::after {
        content: "";
        width: 200rpx;
        height: 1rpx;
        background-color: rgba(0, 0, 0, 0.1);
        display: block;
        margin-left: 20rpx;
    }
    
    &.nomore::before {
        content: "";
        width: 200rpx;
        height: 1rpx;
        background-color: rgba(0, 0, 0, 0.1);
        display: block;
        margin-right: 20rpx;
    }
    
    &.nomore::after {
        content: "";
        width: 200rpx;
        height: 1rpx;
        background-color: rgba(0, 0, 0, 0.1);
        display: block;
        margin-left: 20rpx;
    }
}

@keyframes cuLoading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style> 