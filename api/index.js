// api/index.js

// 后端 API 的基础URL，请根据实际情况修改
const BASE_URL = 'https://lgpt.ybyq.wang/api'; // 修改为您的域名

/**
 * 封装 uni.request 实现通用请求处理
 * @param {Object} options - uni.request 的配置项
 * @returns {Promise}
 */
const request = (options) => {
	return new Promise((resolve, reject) => {
		// 可以在这里添加通用的请求头，例如 token
		const header = {
			...options.header,
			'Authorization': uni.getStorageSync('token') || '',
			'Content-Type': 'application/json'
		};

		uni.showLoading({
			title: '加载中...'
		});

		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: header,
			success: (res) => {
				if (res.statusCode === 200) {
					// 根据后端返回的数据结构调整
					if (res.data.success || res.data.code === 200 || res.data.code === 0) { // 假设后端成功状态
						resolve(res.data);
					} else {
						uni.showToast({
							title: res.data.message || '请求失败',
							icon: 'none'
						});
						reject(res.data);
					}
				} else {
					uni.showToast({
						title: `网络错误 ${res.statusCode}`,
						icon: 'none'
					});
					reject(res);
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '请求失败，请检查网络',
					icon: 'none'
				});
				reject(err);
			},
			complete: () => {
				uni.hideLoading();
			}
		});
	});
};

// 导出 API 模块
export default {
	// 用户认证相关
	login: (data) => request({ url: '/auth/login', method: 'POST', data }),
	register: (data) => request({ url: '/auth/register', method: 'POST', data }),
	getUserProfile: () => request({ url: '/users/profile', method: 'GET' }), // 获取当前用户信息

	// 雇主相关 API
	getEmployerProfile: () => request({ url: '/employers/profile', method: 'GET' }), // 获取雇主信息
	updateEmployerProfile: (data) => request({ url: '/employers/profile', method: 'PUT', data }), // 更新雇主信息
	publishJob: (data) => request({ url: '/jobs/create', method: 'POST', data }), // 发布职位
	getEmployerJobs: (params) => request({ url: '/employers/jobs/list', method: 'GET', data: params }), // 获取雇主发布的职位列表
	getEmployerJobDetail: (jobId) => request({ url: `/jobs/detail/${jobId}`, method: 'GET' }), // 获取雇主职位详情
	updateJob: (jobId, data) => request({ url: `/jobs/update/${jobId}`, method: 'PUT', data }), // 更新职位信息
	deleteJob: (jobId) => request({ url: `/jobs/delete/${jobId}`, method: 'DELETE' }), // 删除职位
	getApplicantsForJob: (jobId) => request({ url: `/jobs/applicants/list/${jobId}`, method: 'GET' }), // 获取职位申请人列表
	acceptJobApplicant: (jobId, applicantId) => request({ url: `/jobs/applicants/accept/${jobId}/${applicantId}`, method: 'POST' }), // 接受申请人
	rejectJobApplicant: (jobId, applicantId) => request({ url: `/jobs/applicants/reject/${jobId}/${applicantId}`, method: 'POST' }), // 拒绝申请人

	// 零工/员工相关 API
	getWorkerProfile: () => request({ url: '/workers/profile', method: 'GET' }), // 获取员工信息
	updateWorkerProfile: (data) => request({ url: '/workers/profile/update', method: 'PUT', data }), // 更新员工信息
	getWorkerApplications: (params) => request({ url: '/jobs/my-applications', method: 'GET', data: params }), // 获取我的申请列表
	applyForJob: (jobId, data) => request({ url: `/jobs/apply/${jobId}`, method: 'POST', data }), // 申请职位
	cancelJobApplication: (jobId, applicationId) => request({ url: `/jobs/applications/cancel/${jobId}/${applicationId}`, method: 'POST' }), // 取消申请

	// 通用职位 API
	getJobList: (params) => request({ url: '/jobs/list', method: 'GET', data: params }), // 获取职位列表（搜索、筛选）
	getJobDetail: (jobId) => request({ url: `/jobs/detail/${jobId}`, method: 'GET' }), // 获取职位详情 (通用)
	checkJobApplication: (jobId) => request({ url: `/jobs/check-application/${jobId}`, method: 'GET' }), // 检查是否已申请该工作
	getRecommendedJobs: (params) => request({ url: '/jobs/recommended/list', method: 'GET', data: params }), // 获取推荐职位
	getNearbyJobs: (params) => request({ url: '/jobs/nearby/list', method: 'GET', data: params }), // 获取附近职位
	getLatestJobs: (params) => request({ url: '/jobs/latest/list', method: 'GET', data: params }), // 获取最新职位

	// 零工列表 API
	getWorkerList: (params) => request({ url: '/workers/list', method: 'GET', data: params }), // 获取零工列表（搜索、筛选）
	getWorkerDetail: (workerId) => request({ url: `/workers/detail/${workerId}`, method: 'GET' }), // 获取零工详情

	// 分类/类目 API
	getCategories: () => request({ url: '/categories/list', method: 'GET' }), // 获取所有分类
	getJobsByCategory: (categoryId, params) => request({ url: `/categories/jobs/list/${categoryId}`, method: 'GET', data: params }), // 获取分类下的职位
	getWorkersByCategory: (categoryId, params) => request({ url: `/categories/workers/list/${categoryId}`, method: 'GET', data: params }), // 获取分类下的工人

	// 评价/评论 API
	submitReview: (data) => request({ url: '/reviews/create', method: 'POST', data }), // 提交评价
	getReviewsForJob: (jobId) => request({ url: `/jobs/reviews/list/${jobId}`, method: 'GET' }), // 获取某个工作的评价
	getReviewsForWorker: (workerId) => request({ url: `/workers/reviews/list/${workerId}`, method: 'GET' }), // 获取某个工人的评价
	getReviewsForEmployer: (employerId) => request({ url: `/employers/reviews/list/${employerId}`, method: 'GET' }), // 获取某个雇主的评价

	// 消息通知 API
	getNotifications: (params) => request({ url: '/notifications/list', method: 'GET', data: params }), // 获取通知列表
	markNotificationAsRead: (notificationId) => request({ url: `/notifications/read/${notificationId}`, method: 'POST' }), // 标记通知为已读
	markAllNotificationsAsRead: () => request({ url: '/notifications/read-all', method: 'POST' }), // 标记所有通知为已读

	// 轮播图 API
	getBanners: () => request({ url: '/banners/list', method: 'GET' }), // 获取轮播图列表

	// 用户认证
	sendSmsCode: (phone) => request({ url: '/auth/sms-code/send', method: 'POST', data: { phone } }), // 发送短信验证码
	verifySmsCode: (phone, code) => request({ url: '/auth/sms-code/verify', method: 'POST', data: { phone, code } }), // 验证短信验证码

	// 保险相关
	getInsuranceList: () => request({ url: '/insurances/list', method: 'GET' }), // 获取保险列表
	buyInsurance: (insuranceId, data) => request({ url: `/insurances/purchase/${insuranceId}`, method: 'POST', data }), // 购买保险
	getUserInsurances: () => request({ url: '/users/insurances/list', method: 'GET' }), // 获取用户已购保险

	// 培训相关
	getTrainingList: (params) => request({ url: '/trainings/list', method: 'GET', data: params }), // 获取培训列表
	getTrainingDetail: (trainingId) => request({ url: `/trainings/detail/${trainingId}`, method: 'GET' }), // 获取培训详情
	enrollTraining: (trainingId) => request({ url: `/trainings/enroll/${trainingId}`, method: 'POST' }), // 报名培训

	// 上传文件
	uploadFile: (filePath, name) => {
		return new Promise((resolve, reject) => {
			uni.showLoading({ title: '上传中...' });
			uni.uploadFile({
				url: BASE_URL + '/upload/file', // 上传接口
				filePath: filePath,
				name: name || 'file',
				header: {
					'Authorization': uni.getStorageSync('token') ? 'Bearer ' + uni.getStorageSync('token') : ''
				},
				success: (uploadFileRes) => {
					const data = JSON.parse(uploadFileRes.data);
					// 根据后端返回的数据结构调整
					if (data.success || data.code === 200 || data.code === 0) {
						resolve(data.data || data);
					} else {
						uni.showToast({ title: data.message || '上传失败', icon: 'none' });
						reject(data);
					}
				},
				fail: (err) => {
					uni.showToast({ title: '上传失败', icon: 'none' });
					reject(err);
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		});
	},

	// 获取分类信息
	getCategoryById(id) {
		return request({
			url: `/categories/${id}`,
			method: 'GET'
		});
	},

	// 获取分类下的工作列表
	getJobsByCategory(categoryId, params) {
		return request({
			url: `/categories/jobs/list/${categoryId}`,
			method: 'GET',
			data: params
		});
	},

	// 获取所有分类
	getCategories() {
		return request({
			url: '/categories/list',
			method: 'GET'
		});
	},

	// 获取轮播图
	getBanners() {
		return request({
			url: '/banners/list',
			method: 'GET'
		});
	},

	// 获取最新工作
	getLatestJobs(params) {
		return request({
			url: '/jobs/latest/list',
			method: 'GET',
			data: params
		});
	},

	// 获取附近工作
	getNearbyJobs(params) {
		return request({
			url: '/jobs/nearby/list',
			method: 'GET',
			data: params
		});
	}
};
