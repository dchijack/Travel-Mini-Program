/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
const API = require('../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: [],
    page:1,
    indicatorDots: !1,
    autoplay: !0,
    interval: 3e3,
    currentSwiper: 0,
    navBarHeight: wx.getSystemInfoSync().statusBarHeight,
    placeHolder: '输入你想知道的内容...',
    autoFocus: false,
    inputEnable: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this;
    wx.getSystemInfo({
      success: function (a) {
        that.setData({
          isIphoneX: a.model.match(/iPhone X/gi)
        });
      }
    });
    this.getStickyPosts();
    this.getPostList();
    this.getCategories();
    this.getSiteInfo();
  },

  getSiteInfo: function() {

    API.getSiteInfo().then(res => {
      this.setData({
        siteInfo: res
      })
    })
  },

  onInput: function(e) {
    this.setData({
      searchKey: e.detail.value
    })
  },

  currentChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current
    });
  },

  getCategories: function() {
    API.getCategories().then(res => {
      this.setData({
        category: res
      })
    })
  },
  getStickyPosts: function() {
    API.getStickyPosts().then(res => {
      this.setData({
        stickyPost: res
      })
    })
  },
  goClassfication:function(){
    wx.switchTab({
      url: '/pages/category/category',
    })
  },

  getPostList: function(args) {
    API.getPostsList(args).then(res => {
      let args = {}
      if (res.length < 10) {
        this.setData({
          isLastPage: true,
          loadtext: '到底啦',
          showloadmore: false
        })
      }
      if (this.data.isPull) {
        args.posts = [].concat(this.data.posts, res)
        args.page = this.data.page + 1
      } else if (this.data.isBottom) {
        args.posts = [].concat(this.data.posts, res)
        args.page = this.data.page + 1
      } else {
        args.posts = [].concat(this.data.posts, res)
        args.page = this.data.page + 1
      }
      this.setData(args)
    })
    
  },

  goClassByid: function (e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/list/list?id=' + id,
    })
  },

  goArticleDetail: function(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },

  onConfirm:function(e){
  console.log(e);
  let s=e.detail.value;
  wx.navigateTo({
    url: '/pages/list/list?s='+s,
  })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  onClear:function(){
    this.setData({
      searchKey:'',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      posts:[],
      page:1,
    })
    this.getPostList({
      page: this.data.page
    });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.isLastPage) {
      this.getPostList({
        page:this.data.page
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that=this;
    return {
      title:that.data.siteInfo.name ,
      path: '/pages/index/index'
    }

  }
})