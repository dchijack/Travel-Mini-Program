// pages/detail/detail.js
/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
const API = require('../../utils/api')
const bdParse = require('../../bdParse/bdParse')
const app = getApp()
let isFocusing = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    audio: '',
    detail:'',
    textNum: 0,
    comments: [],
    isPlaying: false,
    placeholder: '输入评论'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    swan.getSystemInfo({
      success: function (a) {
        that.setData({
          isIphoneX: a.model.match(/iPhone X/gi)
        })
      }
    })
    this.setData({options:options})
    this.getPostsbyID(options.id)
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
    if(app.globalData.user) {
      this.setData({
        user: app.globalData.user
      })
    }
    this.audioCtx = swan.createInnerAudioContext()
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
    this.getPostsbyID(this.data.options.id)
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
      bdParse.bdParse('article', 'html', res.content.rendered, this,5);
      if (res.comments != 0) {
        this.getComments()
      }
      swan.setPageInfo({
				title:res.smartprogram.title,
				keywords:res.smartprogram.keywords,
				description:res.smartprogram.description,
        image: res.smartprogram.image,
        visit: res.smartprogram.visit,
        comments: res.smartprogram.comments,
        likes: res.smartprogram.likes,
        collects: res.smartprogram.collects,
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
      id: this.data.options.id,
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
        swan.showToast({
          title: '加入收藏!',
          icon: 'success',
          duration: 900,
        })
      } else if (res.status === 202) {
        detail.isfav = false
        this.setData({
          detail: detail,
        })
        swan.showToast({
          title: '取消收藏!',
          icon: 'success',
          duration: 900,
        })
      } else {
        swan.showModal({
          title: '温馨提示',
          content: '数据出错, 建议清除缓存重新尝试',
          success: response => {
            swan.removeStorageSync('user')
            swan.removeStorageSync('token')
            swan.removeStorageSync('expired_in')
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
        swan.showToast({
          title: '谢谢点赞!',
          icon: 'success',
          duration: 900,
        })
      } else if (res.status === 202) {
        detail.islike = false
        this.setData({
          detail: detail,
        })
        swan.showToast({
          title: '取消点赞!',
          icon: 'success',
          duration: 900,
        })
      } else {
        swan.showModal({
          title: '温馨提示',
          content: '数据出错, 建议清除缓存重新尝试',
          success: response => {
            swan.removeStorageSync('user')
            swan.removeStorageSync('token')
            swan.removeStorageSync('expired_in')
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
      swan.showModal({
        title: '提示',
        content: '必须授权登录才可以评论'
      })
    } else if (args.content.length === 0) {
      swan.showModal({
        title: '提示',
        content: '评论内容不能为空'
      })
    } else {
      API.addComment(args).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.setData({
            page: 1,
            showTextarea: false,
            content: "",
            comments: [],
            placeholder: "",
            focus: false
          })
          setTimeout(function() {
            swan.showModal({
              title: '温馨提示',
              content: res.message
            })
          }, 900)
          if (!this.data.isComments) {
            this.setData({
              isComments: true,
              placeholder: ''
            })
          }
          this.getComments()
        } else if (res.status === 500) {
          swan.showModal({
            title: '提示',
            content: '评论失败，请稍后重试。'
          })
        } else {
          swan.showModal({
            title: '提示',
            content: '必须授权登录才可以评论'
          })
        }
      })
      .catch(err => {
        console.log(err)
        swan.showModal({
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

  getProfile: function(e) {
    //console.log(e)
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
              //console.log(res)
              API.storageUser(res)
              that.setData({user:res.user})
            })
            .catch(err => {
              console.log(err)
            })
          },
          fail: function(err) {
            console.log(err)
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
        placeholder: "输入评论",
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
    swan.navigateBack()
  },

  bindCopyLink: function(link) {
    swan.setClipboardData({
      data: link,
      success: function (res) {
        swan.getClipboardData({
          success: function (res) {
            swan.showToast({
              title: '复制链接',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },

  bindOpenDocument: function(link) {
    swan.showLoading({
      title: '正在下载...',
      mask: true
    })
    swan.downloadFile({
      url: link,
      success: function (res) {
        swan.hideLoading()
        let filePath = res.tempFilePath
        swan.showLoading({
          title: '正在打开文档',
          mask: true
        })
        swan.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log(res)
            swan.showToast({
              title: '打开文档成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err)
            swan.showToast({
              title: '打开文档失败',
              icon: 'loading',
              duration: 2000
            })
          },
          complete: function () {
            swan.hideLoading()
          }
        })
      },
      fail: function (err) {
        console.log(err)
        swan.hideLoading()
        this.bindCopyLink(link)
      }
    })
  },

  bdParseTagATap: function(e) {
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
            if( apps[i].indexOf('bd') == 0 ) {
              app = apps[i]
              break
            }
          }
        } else if( appid.indexOf('bd') == 0 ) {
          app = appid
        }
        if( app ) {
          if( typeof (path) != 'undefined' && path.length > 0 ) {
            swan.navigateToMiniProgram({
              appKey: app.replace("bd-", ""),
              path: path
            })
          } else {
            swan.navigateToMiniProgram({
              appKey: app.replace("bd-", "")
            })
          }
        } else {
          that.bindCopyLink(link)
        }
      } else if( type == 'webview' ) {
        swan.reLaunch({
          url: '/pages/view/view?url=' + link
        })
      } else if( type == 'document' ) {
        that.bindOpenDocument(link)
      } else if( type == 'page' && typeof (path) != 'undefined' && path.length > 0 ) {
        swan.reLaunch({
					url: path
				})
      } else {
        that.bindCopyLink(link)
      }
    } else {
      if( /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(link) ) {
        swan.previewImage({
          current: link,
          urls: [link]
        })
      } else if(/\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/.test(link)) {
        that.bindOpenDocument(link)
      } else if( link.indexOf(domain.replace("https", "")) != -1 ) {
        let slug = link.substring(link.lastIndexOf("/") + 1)
        let id = slug.substring(0, slug.lastIndexOf("."))
        if( slug.lastIndexOf(".") != -1 && /^[\d|\.]*$/.test(id) ) {
					swan.reLaunch({
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
    console.log(e)
		let that = this
		let id = e.currentTarget.dataset.id
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
			swan.showToast({
				title: err.message,
				duration: 1000
			})
		})
	},

  wxParseAudioPlay: function(e) {
    let audio = e.currentTarget.dataset.src
    if( !audio ) {
      swan.showToast({
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