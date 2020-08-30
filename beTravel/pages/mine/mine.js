/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
// pages/mine/mine.js
const API = require('../../utils/api')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user = app.globalData.user
    if (!user) {
      user = '';
    }
    this.setData({
      user: user,
    })
    this.getPageInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getPageInfo: function() {
    API.getSiteInfo().then(res => {
      swan.setPageInfo({
				title: '个人中心 - ' + res.name,
				keywords: res.keywords,
				description: res.description,
				image: 'https://cxcat.com/wp-content/uploads/2019/10/2019101511214592.jpg',
				success: function () {
					console.log('小程序 Web 化信息设置成功');
				},
				fail: function (err) {
					console.log('小程序 Web 化信息设置失败', err);
				}
			})
    })
    .catch(err => {
      console.log(err)
    })
  },

  getProfile: function (e) {
    if(app.globalData.user){
      this.setData({user: app.globalData.user})
    } else {
      swan.showLoading({
        title: '正在登录!',
        mask: true
      })
      if(e.detail.encryptedData) {
        let args = {}
        let that = this
        args.iv = encodeURIComponent(e.detail.iv)
        args.encryptedData = encodeURIComponent(e.detail.encryptedData)
        swan.login({
          success: function(res) {
            swan.hideLoading()
            args.code = res.code
            API.getProfile(args).then(res => {
              console.log(res)
              API.storageUser(res)
              that.setData({user:res.user})
            })
            .catch(err => {
              console.log(err)
            })
          },
          fail: function(err) {
            reject(err)
            swan.hideLoading()
          }
        })
      } else {
        swan.getSystemInfo({
          success: e => {
            //console.log(e)
            swan.hideLoading()
            if(e.platform == 'devtools') {
              swan.showModal({
                title: '提示',
                content: '请使用手机预览调试'
              })
            }
          }
        })
      }
    }
  },

  bindHandler: function(e) {
    let url=e.currentTarget.dataset.url;
    swan.navigateTo({
      url: url,
    })
  },

  loginOut: function() {
    API.Loginout()
    swan.clearStorageSync();
    swan.showToast({
      title: '清除完毕',
    })
  }
})