// pages/category/category.js
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
    category: '',
    isBottom: false,
    isLastPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategories();
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
    this.bindPageInfo()
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
      page: 1,
      category: '',
      isBottom: false
    })
    this.getCategories()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      isBottom: true
    })
    if(!this.data.isLastPage) {
      this.getCategories({page:this.data.page})
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getCategories: function () {
    API.getCategories().then(res => {
      let args = {}
      if (res.length < 10) {
        this.setData({
          isLastPage: true
        })
      }
      if (this.data.isBottom) {
        swan.showToast({
          title: '加载下一页',
          icon: 'loading',
          duration: 1000
        })
        args.category = [].concat(this.data.category, res)
        args.page = this.data.page + 1
      } else {
        args.category = res
        args.page = this.data.page + 1
      }
      this.setData(args)
      swan.stopPullDownRefresh()
    })
    .catch(err => {
      console.log(err)
      swan.stopPullDownRefresh()
    })
  },

  bindCateByID: function (e) {
    let id = e.currentTarget.id;
    swan.navigateTo({
      url: '/pages/list/list?id=' + id,
    })
  },

  bindPageInfo: function() {
    API.getSiteInfo().then(res => {
      swan.setPageInfo({
        title: '分类目录 - ' + res.name,
        keywords:res.keywords,
        description:res.description,
        image: 'https://cxcat.com/wp-content/uploads/2019/09/2019091022383071.jpg',
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
  }
})