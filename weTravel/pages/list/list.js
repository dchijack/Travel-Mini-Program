/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
// pages/list/list.js
const API = require('../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    page: 1,
    posts: [],
    isLoadAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options: options})
    this.getAdvert()
    if (options.id) {
      this.getPostList({
        categories: options.id,
        page: this.data.page
      });
      this.getCategoryByID(options.id);
    }
    if (options.s) {
      this.getPostList({
        search: options.s,
        page: this.data.page
      });
      this.setData({
        category: '关键词“' + options.s + '”的结果'
      })
      wx.setNavigationBarTitle({
        title: '关键词:'+options.s
      })
    }
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
    this.setData({
      page:1,
      posts:[]
    })
    if (this.data.options.id) {
      this.getPostList({
        categories: this.data.options.id
      });
    }
    if (this.data.options.s) {
      this.getPostList({
        search: this.data.options.s
      });
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isLastPage) {
      if (this.data.options.id) {
        this.getPostList({
          categories: this.data.options.id,
          page: this.data.page
        });
      }
      if (this.data.options.s) {
        this.getPostList({
          search: this.data.options.s,
          page: this.data.page
        });
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getCategoryByID: function(id) {
    API.getCategoryByID(id).then(res => {
      this.setData({
        title: res.name
      })
      wx.setNavigationBarTitle({
        title: res.name
      })
    })
    .catch(err => {
      console.log(err)
    })
  },

  getPostList: function(data) {
    API.getPostsList(data).then(res => {
      let args = {}
      if (res.length < 10) {
        this.setData({
          isLastPage: true,
          loadtext: '到底啦',
          showloadmore: false
        })
      }
      if (this.data.isBottom) {
        args.posts = [].concat(this.data.posts, res)
        args.page = this.data.page + 1
      } else {
        args.posts = [].concat(this.data.posts, res)
        args.page = this.data.page + 1
      }
      this.setData(args)
      wx.stopPullDownRefresh()
    })
    .catch(err => {
      console.log(err)
      wx.stopPullDownRefresh()
    })
  },

  getAdvert: function() {
    API.listAdsense().then(res => {
      console.log(res)
      if(res.status === 200) {
        this.setData({
          advert: res.data
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },

  bindDetail: function(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  }

})