// pages/detail/detail.js
const API = require('../../utils/api')
const WxParse = require('../../wxParse/wxParse')
const app = getApp()
let isFocusing = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments: [],
    page: 1,
    placeholder: '输入评论',
    textNum: 0,
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
    this.getPostsbyID(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getPostsbyID: function(id) {
    let that = this;
    API.getPostsbyID(id).then(res => {
      that.setData({
        id: id,
        detail: res,
        isLike: res.islike,
        isfav: res.isfav,
      })
      WxParse.wxParse('article', 'html', res.content.rendered, this, 5);
      if (res.comments != 0) {
        this.getComments()
      }
    })
  },

  getComments: function() {
    API.getComments({
      id: this.data.id,
      page: this.data.page
    }).then(res => {
      if (res.length < 10) {
        this.setData({
          isLastPage: true,
          loadtext: '到底啦',
          showloadmore: false
        })
      }
      let data = {}
      if (this.data.isReply) {
        this.setData({
          comments: []
        })
        data.comments = [].concat(this.data.comments, res)
        data.page = this.data.page + 1
      } else if (this.data.isBottom) {
        data.comments = [].concat(this.data.comments, res)
        data.page = this.data.page + 1
      } else {
        data.comments = [].concat(this.data.comments, res)
        data.page = this.data.page + 1
      }
      this.setData(data)
    })

  },
  // 发表评论
  addComment: function(e) {
    console.log(e)
    let that = this;
    let content = e.detail.value.inputComment
    let formid = e.detail.formId
    this.setData({
      formid: formid,
      content: content
    })
    if (!this.data.user) {
      wx.showModal({
        title: '提示',
        content: '必须授权登录才可以评论',
        success: function(res) {
          if (res.confirm) {
            that.getProfile();
          }
        }
      })
    } else if (content.length === 0) {
      wx.showModal({
        title: '提示',
        content: '评论内容不能为空'
      })
    } else {
      API.addComment(this.data).then(res => {
          console.log(res)
          if (res.status === 200) {
            this.setData({
              page: 1,
              showTextarea: false,
              content: "",
              comments: [],
              placeholder: "",
              isFocus: false,
              modalTarget: ''
            })
            setTimeout(function() {
              wx.showToast({
                title: '发布成功，审核后方可显示',
                icon: 'success',
                duration: 900,
              })
            }, 900)
            if (!this.data.isComments) {
              this.setData({
                isComments: true,
                placeholder: '',
                modalTarget: ''
              })
            }
            this.getComments()
          } else if (res.status === 500) {
            wx.showModal({
              title: '提示',
              content: '评论失败，请稍后重试。'
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '必须授权登录才可以评论'
            })
          }
        })
        .catch(err => {
          console.log(err)
          wx.showModal({
            title: '提示',
            content: '评论失败，请稍后重试。'
          })
        })
    }
  },

  // 收藏文章
  bindFavTap: function(e) {
    //console.log(e)
    let args = {}
    args.id = e.currentTarget.id
    API.fav(args).then(res => {
        //console.log(res)
        if (res.status === 200) {
          this.setData({
            isfav: true,
          })
          wx.showToast({
            title: '加入收藏!',
            icon: 'success',
            duration: 900,

          })
        } else if (res.status === 202) {
          this.setData({
            isfav: false,
          })
          wx.showToast({
            title: '取消收藏!',
            icon: 'success',
            duration: 900,
          })
        } else {
          wx.showToast({
            title: '数据出错!',
            icon: 'success',
            duration: 900,
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  },

  bindLikeTap: function(e) {
    let args = {}
    let that = this;
    args.id = e.currentTarget.id
    API.like(args).then(res => {
        if (res.status === 200) {
          wx.showToast({
            title: '谢谢点赞!',
            icon: 'success',
            duration: 900,
          })
          that.setData({
            isLike: true
          })
        } else if (res.status === 202) {
          that.setData({
            isLike: false
          })
          wx.showToast({
            title: '取消点赞!',
            icon: 'success',
            duration: 900,
          })
        } else {
          wx.showToast({
            title: '数据出错!',
            icon: 'success',
            duration: 900,
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  },

  onReplyBlur: function(e) {
    var self = this;
    if (!self.data.focus) {
      const text = e.detail.value.trim();
      if (text === '') {
        self.setData({
          parentID: "0",
          placeholder: "评论...",
          userid: "",
          toFromId: "",
          commentdate: ""
        });
      }

    } else {
      self.setData({
        placeholder: "不说算了，口亨",
        focus: false,
      })
    }

    console.log(isFocusing);
  },

  tapcomment: function(e) {
    var self = this;
    let id = e.currentTarget.id;
    if (id) {
      this.setData({
        id: id,
        showTextarea: true,
      })
    } else {
      this.setData({
        showTextarea: true,
      })
    }

    setTimeout(function() {
      self.setData({
        focus: true
      });
    }, 100);
  },

  closeCommentary: function() {
    this.setData({
      showTextarea: false
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let user = app.globalData.user
    if (!user) {
      user = '';
    }
    this.setData({
      user: user,
    })
  },

  getUserInfoFun: function(e) {
    console.log(e);
    if (e.detail.errMsg == "getUserInfo:ok") {
      this.getProfile();
      wx.setStorageSync('user', e.detail)
      this.setData({
        user: true,
      })
    } else {
      return
    }


  },

  getProfile: function(e) {
    console.log(e);
    API.getProfile().then(res => {
        console.log(res)
        this.setData({
          user: res
        })
      })
      .catch(err => {
        console.log(err)
        wx.hideLoading()
      })
  },

  onRepleyFocus: function(e) {
    isFocusing = false
    console.log('onRepleyFocus', isFocusing)
    if (!this.data.isFocus) {
      this.setData({
        isFocus: true
      })
    }
  },

  replyComment: function(e) {
    console.log(e)
    isFocusing = true
    let parent = e.currentTarget.dataset.parent
    let reply = e.currentTarget.dataset.reply
    this.setData({
      isFocus: true,
      isReply: true,
      parent: parent,
      modalTarget: 'comment',
      placeholder: " 回复 " + reply + ":",
    })
  },

  bindWordLimit: function(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        textNum: e.detail.value.length,
        iscanpublish: true,
      })
    } else {
      this.setData({
        iscanpublish: false,
      })
    }

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
      comments: [],
      page: 1,
    })
    this.getComments();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.isLastPage) {
      this.getComments();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this;
    return {
      title: that.data.detail.title.rendered,
      path: '/pages/detail/detail?id=' + that.data.detail.id,
      imageUrl: that.data.detail.meta.thumbnail
    }
  }
})