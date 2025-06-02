<template>
    <view class="category-jobs-container">
        <!-- 自定义导航栏 -->
        <cu-custom isBack @back="customBackHandler">
            <block slot="content">{{ categoryName }}</block>
        </cu-custom>

        <!-- 搜索栏 -->
        <view class="search-bar">
            <view class="search-input">
                <image class="search-icon" src="/static/img/icons/search.png" mode="aspectFit"></image>
                <input type="text" :placeholder="`搜索${categoryName}相关职位`" confirm-type="search" v-model="keyword"
                    @confirm="search" />
            </view>
            <button class="search-btn" @click="search">搜索</button>
        </view>

        <!-- 筛选条件 -->
        <view class="filter-section">
            <view class="filter-item" @click="showFilterPopup('gender')">
                <text>{{ genderFilter || '男女不限' }}</text>
                <image src="/static/img/icons/arrow-down.png" mode="aspectFit"
                    style="width: 24rpx; height: 24rpx; margin-left: 4rpx;"></image>
            </view>
            <view class="filter-item" @click="showFilterPopup('price')">
                <text>{{ priceFilter || '价格' }}</text>
                <image src="/static/img/icons/arrow-down.png" mode="aspectFit"
                    style="width: 24rpx; height: 24rpx; margin-left: 4rpx;"></image>
            </view>
            <view class="filter-item" @click="showFilterPopup('region')">
                <text>{{ regionFilter || '区域' }}</text>
                <image src="/static/img/icons/arrow-down.png" mode="aspectFit"
                    style="width: 24rpx; height: 24rpx; margin-left: 4rpx;"></image>
            </view>
        </view>

        <!-- 任务列表 -->
        <scroll-view scroll-y class="job-list" refresher-enabled @refresherrefresh="onRefresh"
            :refresher-triggered="isRefreshing">
            <view class="job-item" v-for="(job, index) in jobList" :key="index" @click="viewJobDetail(job)">
                <view class="job-header">
                    <image class="job-icon" :src="job.icon" mode="aspectFit"></image>
                    <text class="job-title">{{ job.title }}</text>
                    <text class="price">{{ job.salary }}</text>
                </view>

                <view class="job-info">
                    <text>{{ job.gender }}</text>
                </view>

                <view class="job-type">
                    <text>{{ job.jobType }}</text>
                </view>

                <view class="job-address">
                    <text>直接联系：{{ job.contact }}</text>
                </view>

                <view class="job-time">
                    <text>{{ job.startTime }}</text>
                    <text class="work-period">工作时间</text>
                    <text>{{ job.endTime }}</text>
                </view>

                <button class="apply-btn" @click.stop="applyJob(job)">申请接单</button>
            </view>

            <view class="empty-state" v-if="jobList.length === 0">
                <image src="/static/img/icons/empty.png" mode="aspectFit"></image>
                <text>暂无{{ categoryName }}相关职位</text>
            </view>
        </scroll-view>

        <!-- 筛选弹窗 -->
        <uni-popup ref="filterPopup" type="bottom">
            <view class="filter-popup">
                <view class="filter-header">
                    <text>筛选</text>
                    <text class="close-btn" @click="closeFilterPopup">关闭</text>
                </view>

                <view class="filter-content" v-if="currentFilterType === 'gender'">
                    <view class="filter-option" :class="{ active: genderFilter === '男女不限' }"
                        @click="selectFilter('gender', '男女不限')">
                        <text>男女不限</text>
                    </view>
                    <view class="filter-option" :class="{ active: genderFilter === '男' }"
                        @click="selectFilter('gender', '男')">
                        <text>男</text>
                    </view>
                    <view class="filter-option" :class="{ active: genderFilter === '女' }"
                        @click="selectFilter('gender', '女')">
                        <text>女</text>
                    </view>
                </view>

                <view class="filter-content" v-if="currentFilterType === 'price'">
                    <view class="filter-option" :class="{ active: priceFilter === '' }"
                        @click="selectFilter('price', '')">
                        <text>不限</text>
                    </view>
                    <view class="filter-option" :class="{ active: priceFilter === '200元/天以下' }"
                        @click="selectFilter('price', '200元/天以下')">
                        <text>200元/天以下</text>
                    </view>
                    <view class="filter-option" :class="{ active: priceFilter === '200-300元/天' }"
                        @click="selectFilter('price', '200-300元/天')">
                        <text>200-300元/天</text>
                    </view>
                    <view class="filter-option" :class="{ active: priceFilter === '300元/天以上' }"
                        @click="selectFilter('price', '300元/天以上')">
                        <text>300元/天以上</text>
                    </view>
                </view>

                <view class="filter-content" v-if="currentFilterType === 'region'">
                    <view class="filter-option" :class="{ active: regionFilter === '' }"
                        @click="selectFilter('region', '')">
                        <text>不限</text>
                    </view>
                    <view class="filter-option" :class="{ active: regionFilter === '思明区' }"
                        @click="selectFilter('region', '思明区')">
                        <text>思明区</text>
                    </view>
                    <view class="filter-option" :class="{ active: regionFilter === '湖里区' }"
                        @click="selectFilter('region', '湖里区')">
                        <text>湖里区</text>
                    </view>
                    <view class="filter-option" :class="{ active: regionFilter === '集美区' }"
                        @click="selectFilter('region', '集美区')">
                        <text>集美区</text>
                    </view>
                    <view class="filter-option" :class="{ active: regionFilter === '海沧区' }"
                        @click="selectFilter('region', '海沧区')">
                        <text>海沧区</text>
                    </view>
                    <view class="filter-option" :class="{ active: regionFilter === '同安区' }"
                        @click="selectFilter('region', '同安区')">
                        <text>同安区</text>
                    </view>
                    <view class="filter-option" :class="{ active: regionFilter === '翔安区' }"
                        @click="selectFilter('region', '翔安区')">
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
import API from '@/api/index.js'

export default {
    data() {
        return {
            categoryId: null,
            categoryName: '',
            keyword: '',
            isRefreshing: false,
            jobList: [],
            genderFilter: '',
            priceFilter: '',
            regionFilter: '',
            currentFilterType: '',
            currentPage: 1,
            pageSize: 10,
            hasMore: true,
            isLoading: false
        }
    },
    onLoad(options) {
        if (options.id) {
            this.categoryId = options.id
            this.categoryName = options.name || '分类工作'
            // 设置导航栏标题
            uni.setNavigationBarTitle({
                title: this.categoryName
            })
            // 加载工作列表
            this.loadJobList()
        }
    },
    methods: {
        async loadJobList() {
            if (this.isLoading) return
            this.isLoading = true

            // 显示加载中
            uni.showLoading({
                title: '加载中...'
            })
            
            try {
                // 调用API获取工作列表
                const response = await API.getJobsByCategory(this.categoryId, {
                    page: this.currentPage,
                    size: this.pageSize
                })

                if (response?.code === 0 && response?.data) {
                    const jobData = response.data
                    // 处理返回的数据
                    const formattedJobs = jobData.records.map(job => ({
                        id: job.id,
                        title: job.title,
                        icon: job.icon || "/static/img/category/housekeeping.png",
                        salary: `${job.salary}元/天`,
                        gender: job.genderRequirement || '男女不限',
                        jobType: this.categoryName,
                        contact: job.contact || job.location,
                        startTime: this.formatDate(job.startTime),
                        endTime: this.formatDate(job.endTime),
                        urgent: job.urgent,
                        hotJob: job.hotJob
                    }))

                    if (this.currentPage === 1) {
                        this.jobList = formattedJobs
                    } else {
                        this.jobList = [...this.jobList, ...formattedJobs]
                    }
                    
                    this.hasMore = jobData.records.length === this.pageSize
                } else {
                    throw new Error(response?.message || '获取数据失败')
                }
            } catch (error) {
                console.error('获取工作列表失败', error)
                uni.showToast({
                    title: '获取列表失败，显示示例数据',
                    icon: 'none'
                })
                this.showExampleData()
            } finally {
                uni.hideLoading()
                this.isLoading = false
            }
        },

        // 格式化日期
        formatDate(dateStr) {
            if (!dateStr) return ''
            const date = new Date(dateStr)
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            return `${hours}:${minutes}\n${year}/${month}/${day}`
        },
        
        // 显示示例数据
        showExampleData() {
            this.jobList = [
                {
                    id: 1,
                    title: "保洁",
                    icon: "/static/img/category/housekeeping.png",
                    salary: "4500元/月",
                    gender: "男女不限",
                    jobType: this.categoryName,
                    contact: "18959200015, 香林北二路2号(4#厂房)...",
                    startTime: "00:00\n2025/05/07",
                    endTime: "00:00\n2025/05/14",
                    urgent: true,
                    hotJob: true
                },
                {
                    id: 2,
                    title: "保洁",
                    icon: "/static/img/category/housekeeping.png",
                    salary: "3000元/月",
                    gender: "男女不限",
                    jobType: this.categoryName,
                    contact: "厦门市思明区仙岳路189号金帝花园A栋",
                    startTime: "00:00\n2025/04/30",
                    endTime: "00:00\n2025/05/01",
                    urgent: false,
                    hotJob: true
                },
                {
                    id: 3,
                    title: "工厂保洁员",
                    icon: "/static/img/category/housekeeping.png",
                    salary: "3000元/月",
                    gender: "男女不限",
                    jobType: this.categoryName,
                    contact: "集贤路1999号",
                    startTime: "00:00\n2025/04/30",
                    endTime: "00:00\n2025/05/30",
                    urgent: true,
                    hotJob: false
                }
            ]
        },

        // 搜索处理
        search() {
            this.currentPage = 1
            this.loadJobList()
        },

        // 下拉刷新
        onRefresh() {
            this.isRefreshing = true
            this.currentPage = 1
            this.loadJobList()
            setTimeout(() => {
                this.isRefreshing = false
            }, 1000)
        },

        // 加载更多
        loadMore() {
            if (!this.hasMore || this.isLoading) return
            this.currentPage++
            this.loadJobList()
        },

        // 应用筛选
        applyFilter() {
            this.closeFilterPopup()
            this.currentPage = 1
            this.loadJobList()
        },

        // 重置筛选
        resetFilter() {
            if (this.currentFilterType === 'gender') {
                this.genderFilter = ''
            } else if (this.currentFilterType === 'price') {
                this.priceFilter = ''
            } else if (this.currentFilterType === 'region') {
                this.regionFilter = ''
            }
        },
        viewJobDetail(job) {
            uni.navigateTo({
                url: `/pages/jobDetail/jobDetail?id=${job.id}`
            })
        },
        applyJob(job) {
            uni.showModal({
                title: '申请确认',
                content: `确定申请"${job.title}"职位吗？`,
                success: (res) => {
                    if (res.confirm) {
                        uni.showToast({
                            title: '申请成功',
                            icon: 'success'
                        })
                    }
                }
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
            if (type === 'gender') {
                this.genderFilter = value
            } else if (type === 'price') {
                this.priceFilter = value
            } else if (type === 'region') {
                this.regionFilter = value
            }
        }
    }
}
</script>

<style lang="scss">
.category-jobs-container {
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

    .job-list {
        padding: 0 20rpx;
        height: calc(100vh - 240rpx);

        .job-item {
            background-color: #FFFFFF;
            padding: 24rpx;
            margin-bottom: 20rpx;
            border-radius: 16rpx;
            box-shadow: 0 4rpx 16rpx 0 rgba(0, 0, 0, 0.08);

            .job-header {
                display: flex;
                align-items: center;
                margin-bottom: 20rpx;

                .job-icon {
                    width: 40rpx;
                    height: 40rpx;
                    margin-right: 10rpx;
                }

                .job-title {
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #333;
                    flex: 1;
                }

                .price {
                    font-size: 28rpx;
                    color: #FF9800;
                    font-weight: bold;
                }
            }

            .job-info {
                font-size: 26rpx;
                color: #666;
                margin-bottom: 16rpx;
            }

            .job-type {
                font-size: 26rpx;
                color: #4CAF50;
                margin-bottom: 16rpx;
            }

            .job-address {
                font-size: 26rpx;
                color: #666;
                margin-bottom: 16rpx;
            }

            .job-time {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20rpx;

                text {
                    font-size: 24rpx;
                    color: #666;
                    text-align: center;
                    white-space: pre-line;
                }

                .work-period {
                    background-color: #F5F5F5;
                    padding: 6rpx 16rpx;
                    border-radius: 8rpx;
                    font-size: 22rpx;
                    color: #999;
                }
            }

            .apply-btn {
                width: 100%;
                height: 80rpx;
                line-height: 80rpx;
                background-color: #4CAF50;
                color: #FFFFFF;
                border-radius: 40rpx;
                font-size: 28rpx;
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