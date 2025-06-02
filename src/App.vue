<script>
import Vue from 'vue'

export default {
	onLaunch: function () {
		console.log('App Launch');

		// 检查用户登录状态
		const token = uni.getStorageSync('token');
		if (token) {
			// 已登录，获取用户信息
			this.getUserInfo();
		}

		// 获取设备系统信息，配置ColorUI
		uni.getSystemInfo({
			success: e => {
				// #ifndef MP
				this.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					this.CustomBar = e.statusBarHeight + 50;
				} else {
					this.CustomBar = e.statusBarHeight + 45;
				};
				// #endif
				// #ifdef MP-WEIXIN
				this.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				this.Custom = custom;
				this.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif
				// #ifdef MP-ALIPAY
				this.StatusBar = e.statusBarHeight;
				this.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif

				// 将系统信息挂载到Vue全局
				Vue.prototype.StatusBar = this.StatusBar;
				Vue.prototype.CustomBar = this.CustomBar;
			}
		})
	},
	onShow: function () {
		console.log('App Show');
	},
	onHide: function () {
		console.log('App Hide');
	},
	methods: {
		getUserInfo() {
			// 模拟获取用户信息
			const userInfo = {
				avatar: '/static/img/default-avatar.png',
				name: '张小明',
				certification: '已认证护工',
				applicationCount: 12,
				favoriteCount: 5,
				certificationCount: 3,
				hasInsurance: true,
				hasNewCourse: true
			};

			// 存储到全局状态
			this.$store.commit('setUserInfo', userInfo);
		}
	}
};
</script>

<style lang="scss">
/* 引入ColorUI样式 */
@import "colorui/main.css";
@import "colorui/icon.css";
@import "colorui/animation.css";

/*每个页面公共css */
page {
	--primary-color: #1976D2;
	--success-color: #4CAF50;
	--warning-color: #FF9800;
	--danger-color: #FF5722;
	--info-color: #607D8B;

	font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
		Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
		sans-serif;
	background-color: #F5F5F5;
	font-size: 28rpx;
	color: #333333;
	box-sizing: border-box;
}

/* 去除按钮默认边框 */
button {
	padding: 0;
	margin: 0;
	background-color: transparent;
	line-height: normal;
	font-size: inherit;
	color: inherit;

	&::after {
		border: none;
	}
}

/* 输入框透明背景 */
input {
	background-color: transparent;
}

/* 去除滚动条 */
::-webkit-scrollbar {
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
}

/* 自定义渐变绿色背景 */
.bg-gradient-green {
	background-image: linear-gradient(to right, #4CAF50, #8BC34A) !important;
	color: #FFFFFF !important;
}

/* 顶部导航栏统一样式 */
.cu-custom .cu-bar {
	background-color: #4CAF50;
	color: #FFFFFF;
}

.cu-custom .cu-bar.bg-gradient-green {
	background-image: linear-gradient(to right, #4CAF50, #8BC34A) !important;
}

.cu-custom .cu-bar .content {
	color: #FFFFFF;
	font-weight: bold;
}
</style>
