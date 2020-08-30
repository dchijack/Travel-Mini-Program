// pages/twitter/detail.js
/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
const API = require('../../utils/api')
const app = getApp()
let isFocusing = false

Page({

	/**
	* 页面的初始数据
	*/
	data: {
		id: 0,
		page: 1,
		user: '',
		detail: '',
		textCount: 0,
		comments: [],
		placeholder: '输入评论'
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		this.setData({
			id: options.id
		})
		this.getAdvert()
		this.getTwitterDetail(options.id)
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
		if (app.globalData.user) {
			this.setData({
				user: app.globalData.user
			})
		}
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
			detail: '',
			comments: []
		})
		this.getTwitterDetail(this.data.id)
		this.getComments()
	},

	/**
	* 页面上拉触底事件的处理函数
	*/
	onReachBottom: function () {
		if (!this.data.isLastPage) {
			this.getComments()
		}
	},

	/**
	* 用户点击右上角分享
	*/
	onShareAppMessage: function () {
		return {
			title: this.data.detail.title.rendered,
			imageUrl: this.data.detail.meta.thumbnail
		}
	},

	/**
	 * 用户点击右上角分享至朋友圈
	 */
	onShareTimeline: function () {
		return {
			title: this.data.detail.title.rendered,
			imageUrl: this.data.detail.meta.thumbnail
		}
	},
	  
	/**
	 * 用户点击右上角添加到收藏
	 */
	onAddToFavorites: function () {
		return {
			title: this.data.detail.title.rendered,
			imageUrl: this.data.detail.meta.thumbnail
		}
	},

	getTwitterDetail: function (id) {
		API.getTwitterDetail(id).then(res => {
			console.log(res)
			let args = {}
			args.detail = res
			this.setData(args)
			if(res.comments != 0) {
				this.getComments()
			}
			qq.stopPullDownRefresh()
		})
		.catch(err => {
			console.log(err)
			qq.stopPullDownRefresh()
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
					isLastPage: true
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
			qq.showModal({
				title: '提示',
				content: '必须授权登录才可以评论',
				success: function(res) {
					if (res.confirm) {
						that.getProfile();
					}
				}
			})
		} else if (args.content.length === 0) {
			qq.showModal({
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
						qq.showModal({
							title: '温馨提示',
							content: res.message
						})
					}, 900)
					if (!showTextarea.data.isComments) {
						showTextarea.setData({
							isComments: true,
							placeholder: ''
						})
					}
					that.getComments()
				} else if (res.status === 500) {
					qq.showModal({
						title: '提示',
						content: '评论失败，请稍后重试。'
					})
				} else {
					qq.showModal({
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
				qq.showModal({
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
		qq.showLoading({
			title: '正在登录...',
		})
		API.getProfile().then(res => {
			//console.log(res)
			this.setData({
				user: res
			})
			qq.hideLoading()
		})
		.catch(err => {
			console.log(err)
			qq.hideLoading()
		})
	},
	
	onRepleyFocus: function(e) {
		isFocusing = false
		console.log('onRepleyFocus', isFocusing)
		if (!this.data.isFocus) {
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

	bindComment: function (e) {
		let that = this;
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
		setTimeout(function () {
			that.setData({
				isFocus: true
			});
		}, 100);
	},
	
	bindOutComment: function () {
		this.setData({
			showTextarea: false
		});
	},

	bindCountText: function (e) {
		if (e.detail.value.length > 0) {
			this.setData({
				content: e.detail.value,
				textCount: e.detail.value.length,
				iscanpublish: true
			})
		} else {
			this.setData({
				iscanpublish: false,
			})
		}
	},

	bindReplyComment: function (e) {
		let parent = e.currentTarget.dataset.parent
		let reply = e.currentTarget.dataset.reply
		this.setData({
			isFocus: true,
			isReply: true,
			parent: parent,
			showTextarea: true,
			placeholder: " 回复 " + reply + ":"
		})
	},

	bindCopyLink: function(e) {
		let link = e.currentTarget.dataset.link
		qq.setClipboardData({
			data: link,
			success: function (res) {
				qq.getClipboardData({
					success: function (res) {
						qq.showToast({
							title: '复制链接',
							icon: 'success',
							duration: 2000
						})
					}
				})
			}
		})
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
			qq.showToast({
				title: err.message,
				icon: 'loading',
				duration: 1000
			})
		})
	}

})