// pages/twitter/twitter.js
/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
const API = require('../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    posts: [],
    bloginfo: '',
    isBottom: false,
		isLastPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.getSiteInfo()
    this.getAdvert()
    this.getTwitterPosts()
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
			page: 1,
			posts:[],
			isLoading: true
		})
		this.getTwitterPosts()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({isBottom:true})
    if(!this.data.isLastPage) {
			this.getTwitterPosts({page:this.data.page})
		}
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.bloginfo.name + ":" + this.data.bloginfo.description,
      imageUrl: this.data.bloginfo.cover
    }
  },

  /**
	 * 用户点击右上角分享至朋友圈
	 */
	onShareTimeline: function () {
    return {
      title: this.data.bloginfo.name + ":" + this.data.bloginfo.description,
      imageUrl: this.data.bloginfo.cover
    }
  },
  
  /**
   * 用户点击右上角添加到收藏
   */
  onAddToFavorites: function () {
    return {
      title: this.data.bloginfo.name + ":" + this.data.bloginfo.description,
      imageUrl: this.data.bloginfo.cover
    }
  },

  /**
   * 查看详情
   */
  bindPosts: function(e) {
    let  id = e.currentTarget.id
    swan.navigateTo({
      url: '/pages/twitter/detail?id=' + id
    })
  },

  getSiteInfo: function() {
    API.getSiteInfo().then(res => {
      this.setData({
        bloginfo: res
      })
    })
    .catch(err => {
      console.log(err)
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

  getTwitterPosts: function(args) {
    API.getTwitterPosts(args).then(res => {
      //console.log(res)
      let args = {}
      let current = getCurrentPages()
      if(current.length ===1) {
        args.isShare = true
      }
      if(this.data.isBottom) {
        args.isBottom = false
        args.posts = [].concat(this.data.posts, res)
        args.page = this.data.page + 1
        swan.showToast({
          title: '加载下一页',
          icon: 'loading',
          duration: 1000
        })
      } else {
        args.posts = [].concat(this.data.posts, res)
        args.page = this.data.page + 1
      }
      if(res.length < 10) {
        args.isLastPage = true
      }
      this.setData(args)
      swan.stopPullDownRefresh()
    })
    .catch(err => {
      console.log(err)
      this.setData({ isBottom: false })
      swan.stopPullDownRefresh()
    })
  }

})