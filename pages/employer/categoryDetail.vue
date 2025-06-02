<template>
    <view class="category-detail-container">
        <!-- 自定义导航栏 -->
        <nav-bar :title="category.name" :showBack="true" @back="goBack"></nav-bar>

        <!-- 分类详情卡片 -->
        <view class="category-header-card">
            <view class="category-header">
                <image class="category-icon" :src="category.icon" mode="aspectFit"></image>
                <view class="category-info">
                    <text class="category-name">{{ category.name }}</text>
                    <view class="category-tags">
                        <view class="tag" v-for="(tag, index) in category.tags" :key="index">
                            {{ tag }}
                        </view>
                    </view>
                </view>
            </view>
            <view class="category-count">
                <text>{{ workers.length }}人可雇佣</text>
            </view>
        </view>
        
        <view class="description-card">
            <view class="card-title">岗位描述</view>
            <view class="category-description">
                <text>{{ category.description }}</text>
            </view>
        </view>

        <!-- 筛选栏 -->
        <view class="filter-bar">
            <view class="filter-item" @click="setFilter('recommended')">
                <text :class="{ active: currentFilter === 'recommended' }">推荐</text>
            </view>
            <view class="filter-item" @click="setFilter('nearest')">
                <text :class="{ active: currentFilter === 'nearest' }">距离最近</text>
            </view>
            <view class="filter-item" @click="setFilter('highestRated')">
                <text :class="{ active: currentFilter === 'highestRated' }">评分最高</text>
            </view>
        </view>

        <!-- 工人列表 -->
        <view class="worker-list">
            <view class="worker-card" v-for="(worker, index) in filteredWorkers" :key="index"
                @click="viewWorkerDetail(worker)">
                <view class="worker-top">
                    <image class="worker-avatar" :src="worker.avatar" mode="aspectFill"></image>
                    <view class="worker-info">
                        <view class="worker-name-row">
                            <text class="worker-name">{{ worker.name }}</text>
                            <image v-if="worker.verified" src="/static/img/icons/verified.png" mode="aspectFit"
                                class="verified-icon"></image>
                            <view class="worker-rate">
                                <text>{{ worker.rate }}</text>
                                <text class="rate-unit">/{{ worker.rateUnit }}</text>
                            </view>
                        </view>
                        <view class="worker-meta">
                            <text class="worker-distance">{{ worker.distance }}km</text>
                            <text class="worker-rating">{{ worker.rating }}分</text>
                            <text class="worker-time">{{ worker.workTimes }}</text>
                        </view>
                        <view class="worker-skills">
                            <text v-for="(skill, skillIndex) in worker.skills" :key="skillIndex">{{ skill }}</text>
                        </view>
                    </view>
                </view>

                <view class="action-buttons">
                    <button class="contact-btn" @click.stop="contactWorker(worker)">联系</button>
                    <button class="hire-btn" @click.stop="hireWorker(worker)">雇佣</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            categoryId: null,
            categoryName: '',
            currentFilter: 'recommended',
            category: {
                id: '1',
                name: '美团外卖骑手',
                icon: '/static/img/category/logistics.png',
                description: '提供外卖配送、快递取件等灵活就业机会，时间自由，多劳多得。适合身体健康，有驾驶证和交通工具的人员。',
                tags: ['日结工资', '弹性时间', '高收入', '交通工具']
            },
            workers: [
                {
                    id: '1',
                    name: '张师傅',
                    avatar: '/static/img/default/avatar1.jpg',
                    verified: true,
                    skills: ['熟悉厦门路线', '3年经验'],
                    rate: '5000',
                    rateUnit: '月',
                    distance: '1.2',
                    rating: '4.8',
                    reviewCount: '56',
                    workTimes: '08:00-18:00',
                    status: 'online'
                },
                {
                    id: '2',
                    name: '李师傅',
                    avatar: '/static/img/default/avatar2.jpg',
                    verified: true,
                    skills: ['熟悉厦门路线', '5年经验'],
                    rate: '5000',
                    rateUnit: '月',
                    distance: '3.5',
                    rating: '4.9',
                    reviewCount: '78',
                    workTimes: '08:00-18:00',
                    status: 'online'
                },
                {
                    id: '3',
                    name: '王师傅',
                    avatar: '/static/img/default/avatar3.jpg',
                    verified: false,
                    skills: ['熟悉厦门路线', '1年经验'],
                    rate: '4800',
                    rateUnit: '月',
                    distance: '2.8',
                    rating: '4.5',
                    reviewCount: '23',
                    workTimes: '09:00-19:00',
                    status: 'offline'
                }
            ]
        }
    },
    computed: {
        filteredWorkers() {
            // 根据当前筛选条件返回工人列表
            switch (this.currentFilter) {
                case 'nearest':
                    return [...this.workers].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
                case 'highestRated':
                    return [...this.workers].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
                case 'recommended':
                default:
                    // 推荐算法可以综合考虑评分、距离等因素
                    return this.workers
            }
        }
    },
    onLoad(options) {
        if (options.id) {
            this.categoryId = options.id
        }
        if (options.name) {
            this.categoryName = options.name
            // 更新分类名称
            this.category.name = options.name
        }
        this.loadCategoryDetails()
    },
    methods: {
        goBack() {
            uni.navigateBack({
                delta: 1,
                fail: function() {
                    uni.reLaunch({
                        url: '/pages/employer/index'
                    })
                }
            })
        },
        loadCategoryDetails() {
            // 根据categoryId加载分类详情和工人列表
            // 此处为模拟数据，实际应从服务器获取
            uni.showLoading({
                title: '加载中...'
            })

            setTimeout(() => {
                uni.hideLoading()
            }, 500)
        },
        setFilter(filter) {
            this.currentFilter = filter
        },
        viewWorkerDetail(worker) {
            uni.navigateTo({
                url: `/pages/worker/workerDetail?id=${worker.id}`
            })
        },
        contactWorker(worker) {
            uni.makePhoneCall({
                phoneNumber: '13812345678', // 实际应使用worker.phone
                fail: () => {
                    uni.showToast({
                        title: '拨打电话失败',
                        icon: 'none'
                    })
                }
            })
        },
        hireWorker(worker) {
            uni.showModal({
                title: '雇佣确认',
                content: `确定要雇佣"${worker.name}"吗？`,
                success: (res) => {
                    if (res.confirm) {
                        uni.showToast({
                            title: '邀请已发送',
                            icon: 'success'
                        })
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss">
.category-detail-container {
    min-height: 100vh;
    background-color: #F5F5F5;
    padding-bottom: 50rpx;

    .category-header-card {
        background-color: #FFFFFF;
        padding: 30rpx;
        margin-bottom: 20rpx;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .category-header {
            display: flex;
            align-items: flex-start;
            flex: 1;

            .category-icon {
                width: 80rpx;
                height: 80rpx;
                margin-right: 20rpx;
                padding: 10rpx;
                background-color: #F5F5F5;
                border-radius: 12rpx;
            }

            .category-info {
                flex: 1;

                .category-name {
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 16rpx;
                    display: block;
                }

                .category-tags {
                    display: flex;
                    flex-wrap: wrap;

                    .tag {
                        font-size: 22rpx;
                        color: #666;
                        background-color: #F5F5F5;
                        padding: 6rpx 16rpx;
                        border-radius: 20rpx;
                        margin-right: 12rpx;
                        margin-bottom: 8rpx;
                    }
                }
            }
        }

        .category-count {
            text-align: right;
            background-color: #E8F5E9;
            color: #4CAF50;
            font-size: 24rpx;
            padding: 6rpx 16rpx;
            border-radius: 20rpx;
        }
    }

    .description-card {
        background-color: #FFFFFF;
        padding: 20rpx 30rpx;
        margin-bottom: 20rpx;

        .card-title {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 16rpx;
            position: relative;
            padding-left: 20rpx;
            
            &:before {
                content: '';
                position: absolute;
                left: 0;
                top: 8rpx;
                width: 6rpx;
                height: 24rpx;
                background-color: #4CAF50;
                border-radius: 3rpx;
            }
        }

        .category-description {
            font-size: 26rpx;
            color: #666;
            line-height: 1.6;
        }
    }

    .filter-bar {
        display: flex;
        background-color: #FFFFFF;
        padding: 20rpx 0;
        margin-bottom: 20rpx;

        .filter-item {
            flex: 1;
            display: flex;
            justify-content: center;

            text {
                font-size: 28rpx;
                color: #666;
                padding: 10rpx 20rpx;

                &.active {
                    color: #4CAF50;
                    font-weight: bold;
                    position: relative;

                    &::after {
                        content: '';
                        position: absolute;
                        bottom: -10rpx;
                        left: 30%;
                        width: 40%;
                        height: 4rpx;
                        background-color: #4CAF50;
                    }
                }
            }
        }
    }

    .worker-list {
        padding: 0 20rpx;

        .worker-card {
            background-color: #FFFFFF;
            border-radius: 12rpx;
            padding: 24rpx;
            margin-bottom: 20rpx;
            box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

            .worker-top {
                display: flex;
                margin-bottom: 20rpx;

                .worker-avatar {
                    width: 90rpx;
                    height: 90rpx;
                    border-radius: 50%;
                    margin-right: 20rpx;
                    border: 2rpx solid #F5F5F5;
                }

                .worker-info {
                    flex: 1;

                    .worker-name-row {
                        display: flex;
                        align-items: center;
                        margin-bottom: 8rpx;

                        .worker-name {
                            font-size: 30rpx;
                            font-weight: bold;
                            color: #333;
                            margin-right: 10rpx;
                        }

                        .verified-icon {
                            width: 30rpx;
                            height: 30rpx;
                            margin-right: auto;
                        }

                        .worker-rate {
                            font-size: 30rpx;
                            font-weight: bold;
                            color: #FF5722;

                            .rate-unit {
                                font-size: 22rpx;
                                font-weight: normal;
                                color: #999;
                            }
                        }
                    }

                    .worker-meta {
                        display: flex;
                        margin-bottom: 12rpx;
                        
                        text {
                            font-size: 22rpx;
                            color: #999;
                            margin-right: 20rpx;
                            
                            &:last-child {
                                margin-right: 0;
                            }
                        }
                    }

                    .worker-skills {
                        display: flex;
                        flex-wrap: wrap;

                        text {
                            font-size: 22rpx;
                            color: #666;
                            background-color: #F5F5F5;
                            padding: 6rpx 16rpx;
                            border-radius: 20rpx;
                            margin-right: 12rpx;
                            margin-bottom: 8rpx;
                        }
                    }
                }
            }

            .action-buttons {
                display: flex;

                button {
                    flex: 1;
                    height: 70rpx;
                    font-size: 28rpx;
                    margin: 0 10rpx;
                    border-radius: 35rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .contact-btn {
                    background-color: #F5F5F5;
                    color: #666;
                }

                .hire-btn {
                    background-color: #4CAF50;
                    color: #FFFFFF;
                }
            }
        }
    }
}
</style>