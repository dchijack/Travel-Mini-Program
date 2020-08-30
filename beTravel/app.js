/**
 * Date : 2019.12.01
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
const API = require('./utils/base.js')

App({

  onLaunch: function () {
    API.login();
    if(swan.canIUse('showFavoriteGuide')) {
      swan.showFavoriteGuide({
          type: 'tip',
          content: '关注小程序，下次使用更便捷。'
      })
    }
    // 获取系统状态栏信息
    swan.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.CustomBar = e.platform == 'android' ? e.statusBarHeight + 50 : e.statusBarHeight + 45;
      }
    })
  },

  onShow: function () {
    this.globalData.user = API.getUser();
  },

  globalData: {
    user: '',
    StatusBar: '',
    CustomBar: ''
  }

})