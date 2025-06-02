import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
    userType: 'employee', // 用户类型：employee（零工），employer（雇主）
    hasNewMessage: false,
    location: {
      longitude: 0,
      latitude: 0,
      address: '厦门市',
      district: '思明区'
    }
  },
  mutations: {
    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    // 切换用户类型
    toggleUserType(state, type) {
      state.userType = type
    },
    // 设置消息状态
    setMessageStatus(state, status) {
      state.hasNewMessage = status
    },
    // 设置位置信息
    setLocation(state, location) {
      state.location = location
    }
  },
  actions: {
    // 获取用户位置
    getUserLocation({ commit }) {
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: 'gcj02',
          success: function(res) {
            commit('setLocation', {
              longitude: res.longitude,
              latitude: res.latitude,
              address: '厦门市',
              district: '思明区'
            })
            resolve(res)
          },
          fail: function(err) {
            reject(err)
          }
        })
      })
    }
  }
}) 