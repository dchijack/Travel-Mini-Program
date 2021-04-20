// pages/detail/detail.js
/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
const API = require('../../utils/api')
const WxParse = require('../../wxParse/wxParse')
const app = getApp()
let isFocusing = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    page: 1,
    audio: '',
    detail:'',
    textNum: 0,
    comments: [],
    isPlaying: false,
    placeholder: '输入评论',
    user: app.globalData.user
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    tt.getSystemInfo({
      success: function (a) {
        that.setData({
          isIphoneX: a.model.match(/iPhone X/gi)
        })
      }
    })
    if( options.id ) {
      this.setData({
        id: options.id
      })
      this.getPostsbyID(options.id)
    }
    this.getAdvert()
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
    let user = API.getUser()
		if( user ) {
			this.setData({
				user: user
			})
		}
    this.audioCtx = tt.createInnerAudioContext()
		this.audioCtx.onEnded(() => {
			if(this.data.isPlaying) {
				this.setData({isPlaying:false})
			}
    })
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
    if(this.data.isPlaying) {
			this.audioCtx.stop()
		}
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      detail: '',
      comments: []
    })
    this.getPostsbyID(this.data.id)
    this.getComments()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isLastPage) {
      this.getComments();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.detail.title.rendered,
      path: '/pages/detail/detail?id=' + this.data.detail.id,
      imageUrl: this.data.detail.meta.thumbnail
    }
  },

  getPostsbyID: function(id) {
    let that = this;
    API.getPostsbyID(id).then(res => {
      that.setData({
        id: id,
        detail: res
      })
      WxParse.wxParse('article', 'html', res.content.rendered, this, 5);
      if (res.comments != 0) {
        this.getComments()
      }
    })
    .catch(err => {
      console.log(err)
    })
  },

  getAdvert: function() {
    API.detailAdsense().then(res => {
      //console.log(res)
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

  getComments: function() {
    API.getComments({
      id: this.data.id,
      page: this.data.page
    }).then(res => {
      let data = {}
      if (res.length < 10) {
        this.setData({
          isLastPage: true,
          loadtext: '到底啦',
          showloadmore: false
        })
      }
      if (this.data.isBottom) {
        data.comments = [].concat(this.data.comments, res)
        data.page = this.data.page + 1
      } else {
        data.comments = [].concat(this.data.comments, res)
        data.page = this.data.page + 1
      }
      this.setData(data)
    })
  },

  bindFavTap: function(e) {
    //console.log(e)
    let args = {}
    let detail = this.data.detail
    args.id = detail.id
    API.fav(args).then(res => {
      //console.log(res)
      if (res.status === 200) {
        detail.isfav = true
        this.setData({
          detail: detail,
        })
        tt.showToast({
          title: '加入收藏!',
          icon: 'success',
          duration: 900,
        })
      } else if (res.status === 202) {
        detail.isfav = false
        this.setData({
          detail: detail,
        })
        tt.showToast({
          title: '取消收藏!',
          icon: 'success',
          duration: 900,
        })
      } else {
        tt.showModal({
          title: '温馨提示',
          content: '数据出错, 建议清除缓存重新尝试',
          success: response => {
            tt.removeStorageSync('user')
            tt.removeStorageSync('token')
            tt.removeStorageSync('expired_in')
          }
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },

  bindLikeTap: function(e) {
    //console.log(e)
    let args = {}
    let detail = this.data.detail
    args.id = detail.id
    API.like(args).then(res => {
      //console.log(res)
      if (res.status === 200) {
        detail.islike = true
        this.setData({
          detail: detail,
        })
        tt.showToast({
          title: '谢谢点赞!',
          icon: 'success',
          duration: 900,
        })
      } else if (res.status === 202) {
        detail.islike = false
        this.setData({
          detail: detail,
        })
        tt.showToast({
          title: '取消点赞!',
          icon: 'success',
          duration: 900,
        })
      } else {
        tt.showModal({
          title: '温馨提示',
          content: '数据出错, 建议清除缓存重新尝试',
          success: response => {
            tt.removeStorageSync('user')
            tt.removeStorageSync('token')
            tt.removeStorageSync('expired_in')
          }
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },

  addComment: function(e) {
    //console.log(e)
    let args = {}
    let that = this
    args.id = this.data.detail.id
    args.content = this.data.content
    args.parent = this.data.parent
    args.formid = e.detail.formId
    if (!this.data.user) {
      tt.showModal({
        title: '提示',
        content: '必须授权登录才可以评论',
        success: function(res) {
          if (res.confirm) {
            that.getProfile();
          }
        }
      })
    } else if (args.content.length === 0) {
      tt.showModal({
        title: '提示',
        content: '评论内容不能为空'
      })
    } else {
      API.addComment(args).then(res => {
        //console.log(res)
        if (res.status === 200) {
          that.setData({
            page: 1,
            showTextarea: false,
            content: "",
            comments: [],
            placeholder: "",
            focus: false
          })
          setTimeout(function() {
            tt.showModal({
              title: '温馨提示',
              content: res.message
            })
          }, 900)
          if (!that.data.isComments) {
            that.setData({
              isComments: true,
              placeholder: ''
            })
          }
          that.getComments()
        } else if (res.status === 500) {
          tt.showModal({
            title: '提示',
            content: '评论失败，请稍后重试。'
          })
        } else {
          tt.showModal({
            title: '提示',
            content: '必须授权登录才可以评论',
            success: function(res) {
              if (res.confirm) {
                that.getProfile();
              }
            }
          })
        }
      })
      .catch(err => {
        console.log(err)
        tt.showModal({
          title: '提示',
          content: '评论失败，请稍后重试。'
        })
      })
    }
  },

  replyComment: function(e) {
    //console.log(e)
    isFocusing = true
    let parent = e.currentTarget.dataset.parent
    let reply = e.currentTarget.dataset.reply
    this.setData({
      focus: true,
      isReply: true,
      parent: parent,
      placeholder: " 回复 " + reply + ":"
    })
  },

  getProfile: function() {
    tt.showLoading({
      title: '正在登录...',
    })
    API.getProfile().then(res => {
        //console.log(res)
        this.setData({
          user: res
        })
        tt.hideLoading()
      })
      .catch(err => {
        console.log(err)
        tt.hideLoading()
      })
  },

  onRepleyFocus: function(e) {
    isFocusing = false
    console.log('onRepleyFocus', isFocusing)
    if (!this.data.focus) {
      this.setData({
        focus: true
      })
    }
  },

  onReplyBlur: function(e) {
    var that = this;
    if (!that.data.focus) {
      const text = e.detail.value.trim();
      if (text === '') {
        that.setData({
          parent: "0",
          placeholder: "评论...",
          commentdate: ""
        });
      }
    } else {
      that.setData({
        placeholder: "不说算了，口亨",
        focus: false
      })
    }
    //console.log(isFocusing)
  },

  bindInputContent: function(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        content: e.detail.value,
        textNum: e.detail.value.length,
        iscanpublish: true
      })
    } else {
      this.setData({
        iscanpublish: false
      })
    }
  },

  tapcomment: function(e) {
    var self = this;
    let id = e.currentTarget.id;
    if (id) {
      this.setData({
        id: id,
        showTextarea: true
      })
    } else {
      this.setData({
        showTextarea: true
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

  bindBack: function() {
    tt.navigateBack()
  },

  bindCopyLink: function(link) {
    tt.setClipboardData({
      data: link,
      success: function (res) {
        tt.getClipboardData({
          success: function (res) {
            tt.showToast({
              title: '复制链接',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },

  wxParseTagATap: function(e) {
    let that = this
    let domain = API.getHost()
	  let link = e.currentTarget.dataset.src
	  let appid = e.currentTarget.dataset.appid
	  let type = e.currentTarget.dataset.type
    let path = e.currentTarget.dataset.path
    if( typeof (type) != 'undefined' ) {
      if( type == 'miniprogram' && typeof (appid) != 'undefined' && appid.length > 0  ) {
        let app = ""
        if( appid.indexOf('|') != -1 ) {
          let apps = appid.split("|")
          for (var i=0;i<apps.length;i++) {
            if( apps[i].indexOf('tt') == 0 ) {
              app = apps[i]
              break
            }
          }
        } else if( appid.indexOf('tt') == 0 ) {
          app = appid
        }
        if(app) {
          if( typeof (path) != 'undefined' && path.length > 0 ) {
            tt.navigateToMiniProgram({
              appId: app.replace("tt-", ""),
              path: path
            })
          } else {
            tt.navigateToMiniProgram({
              appId: app.replace("tt-", "")
            })
          }
        } else {
          that.bindCopyLink(link)
        }
      } else if( type == 'webview' ) {
        tt.reLaunch({
          url: '/pages/view/view?url=' + link
        })
      } else if( type == 'document' ) {
        that.bindCopyLink(link)
      } else if( type == 'page' && typeof (path) != 'undefined' && path.length > 0 ) {
        tt.reLaunch({
					url: path
				})
      } else {
        that.bindCopyLink(link)
      }
    } else {
      if( /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(link) ) {
        tt.previewImage({
          current: link,
          urls: [link]
        })
      } else if(/\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/.test(link)) {
        that.bindCopyLink(link)
      } else if( link.indexOf(domain.replace("https", "")) != -1 ) {
        let slug = link.substring(link.lastIndexOf("/") + 1)
        let id = slug.substring(0, slug.lastIndexOf("."))
        if( slug.lastIndexOf(".") != -1 && /^[\d|\.]*$/.test(id) ) {
					tt.reLaunch({
						url: '/pages/detail/detail?id=' + id
					})
        } else {
          that.bindCopyLink(link)
        }
      } else {
        that.bindCopyLink(link)
      }
    }
  },

  bindLikeComment: function (e) {
		let that = this
		let id = e.currentTarget.id
		let index = e.currentTarget.dataset.index
		API.markComment({id:id}).then(res => {
			if (res.status == 200) {
				that.data.comments[index].islike = true
				that.data.comments[index].likes += 1
				that.setData({
					comments: that.data.comments
				})
			} else if (res.status == 202) {
				that.data.comments[index].islike = false
				that.data.comments[index].likes -= 1
				that.setData({
					comments: that.data.comments
				})
			}
		})
		.catch(err => {
			tt.showToast({
				title: err.message,
				duration: 1000
			})
		})
	},

  wxParseAudioPlay: function(e) {
    let audio = e.currentTarget.dataset.src
    if( !audio ) {
      tt.showToast({
        title: '获取音频错误',
      })
    } else {
      if( this.data.isPlaying && this.data.audio ) {
        if( this.data.audio == audio ) {
          this.audioCtx.pause()
          this.setData({
            isPlaying: false
          })
        } else {
          this.audioCtx.stop()
          this.audioCtx.src = audio
          this.audioCtx.play()
          this.setData({
            audio: audio,
            isPlaying: true
          })
        }
      } else {
        this.audioCtx.src = audio
        this.audioCtx.play()
        this.setData({
          audio: audio,
          isPlaying: true
        })
      }
    }
  },

  bindAudioPlay: function() {
    if( this.data.isPlaying ) {
      this.audioCtx.pause()
      this.setData({
        isPlaying: false
      })
    }
  }

})