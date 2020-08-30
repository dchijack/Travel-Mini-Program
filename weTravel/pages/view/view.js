/**
 * WordPres WeMedia Mini Program
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/WordPress-WeMedia-Mini-Program
 * 技术博客： https://www.imahui.com
 */
// pages/view/view.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.url != null) {
			let url = decodeURIComponent(options.url)
			if (url.indexOf('*') != -1) {
				url = url.replace("*", "?")
			}
			this.setData({
				url: url
			})
		} else {
      wx.showModal({
        title: '提示',
        content: '业务域名不能为空，请检查',
        success: response => {
          console.log(response)
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      })
    }
  },
  onShareAppMessage: function () {
    return {
			title: '邀你一起阅读文章，快来围观一下！',
			path: '/pages/view/view?url=' + this.data.url
		}
  }
})