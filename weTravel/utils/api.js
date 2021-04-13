/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */

const API = require('./base')

// 小程序基本信息
const getSiteInfo = function(data) {
	return API.get('/wp-json/mp/v1/setting', data);
}

// 置顶文章
const getStickyPosts = function(data) {
	return API.get('/wp-json/mp/v1/posts/sticky', data);
}

// 文章列表
const getPostsList = function(data) {
	return API.get('/wp-json/wp/v2/posts', data, { token:true });
}

// 文章详情
const getPostsbyID = function(id){
	return API.get('/wp-json/wp/v2/posts/'+id, {}, { token:true });   
}

// 页面列表
const getPagesList = function(data){
	return API.get('/wp-json/wp/v2/pages', data);   
}

// 页面详情
const getPageByID = function(id){
	return API.get('/wp-json/wp/v2/pages/'+id);   
}

// 分类列表
const getCategories = function(data){
	return API.get('/wp-json/wp/v2/categories?orderby=id&order=asc', data);
}

// 分类信息
const getCategoryByID = function(id){
	return API.get('/wp-json/wp/v2/categories/'+id);   
}

// 标签列表
const getTags = function(data){
	return API.get('/wp-json/wp/v2/tags?orderby=id&order=asc', data);   
}

// 标签信息
const getTagByID = function(id){
	return API.get('/wp-json/wp/v2/tags/'+id);   
}

// 随机文章
const getRandPosts = function(data){
	return API.get('/wp-json/mp/v1/posts/rand', data);   
}

// 相关文章
const getRelatePosts = function(data){
	return API.get('/wp-json/mp/v1/posts/relate', data);   
}

// 热门阅读
const getMostViewsPosts = function(data){
	return API.get('/wp-json/mp/v1/posts/most?meta=views', data);   
}

// 热门收藏
const getMostFavPosts = function(data){
	return API.get('/wp-json/mp/v2/posts/most?meta=favs', data);   
}

// 热门点赞
const getMostLikePosts = function(data){
	return API.get('/wp-json/mp/v2/posts/most?meta=likes', data);   
}

// 热门评论
const getMostCommentPosts = function(data){
	return API.get('/wp-json/mp/v2/posts/most?meta=comments', data);   
}

// 最新评论
const getRecentCommentPosts = function(data){
	return API.get('/wp-json/mp/v1/posts/comment', data);   
}

// 文章评论
const getComments = function(data) {
	return API.get('/wp-json/mp/v1/comments', data);
}

// 注销登录
const Loginout = function() {
	return API.logout();
}

// 收藏文章
const fav = function(data) {
	return API.post('/wp-json/mp/v1/comments?type=fav', data, { token: true });
}

// 点赞文章
const like = function(data) {
	return API.post('/wp-json/mp/v1/comments?type=like', data, { token: true });
}

// 收藏列表
const getFavPosts = function(data) {
	return API.get('/wp-json/mp/v1/posts/comment?type=fav', data, { token: true });
}

// 点赞列表
const getLikePosts = function(data) {
	return API.get('/wp-json/mp/v1/posts/comment?type=like', data, { token: true });
}

// 评论列表
const getCommentsPosts = function(data) {
	return API.get('/wp-json/mp/v1/posts/comment?type=comment', data, { token: true });
}

// 发布评论
const addComment = function(data) {
	return API.post('/wp-json/mp/v1/comments?type=comment', data, { token: true });
}

// 订阅消息
const subscribeMessage = function(data) {
  return API.post('/wp-json/mp/v1/subscribe', data, { token: true });
}

// 小程序码
const getCodeImg = function(data) {
	return API.post('/wp-json/mp/v1/qrcode', data, { token: false });
}

// 导航菜单
const getMenuSetting = function(data) {
	return API.get('/wp-json/mp/v1/menu', data);
}

// 首页广告
const indexAdsense = function(data) {
	return API.get('/wp-json/mp/v1/advert/wechat?type=index', data);
}

// 列表广告
const listAdsense = function(data) {
	return API.get('/wp-json/mp/v1/advert/wechat?type=list', data);
}

// 详情广告
const detailAdsense = function(data) {
	return API.get('/wp-json/mp/v1/advert/wechat?type=detail', data);
}

// 页面广告
const pageAdsense = function(data) {
	return API.get('/wp-json/mp/v1/advert/wechat?type=page', data);
}

// 推文列表(需要安装小艾公众号插件)
const getTwitterPosts = function(data) {
	return API.get('/wp-json/wp/v2/tweets', data);
}

// 推文详情(需要安装小艾公众号插件)
const getTwitterDetail = function(id) {
	return API.get('/wp-json/wp/v2/tweets/' + id, {}, {
		token: true
	});
}

// 评论点赞
const markComment = function (args) {
	return API.post('/wp-json/mp/v1/comments/mark', args, {
		token: true,
	})
}

API.getSiteInfo					    = getSiteInfo
API.getStickyPosts			    	= getStickyPosts
API.getPostsList				    = getPostsList
API.getPostsbyID				    = getPostsbyID
API.getPagesList				    = getPagesList
API.getPageByID					    = getPageByID
API.getCategories				    = getCategories
API.getCategoryByID			    	= getCategoryByID
API.getTags						    = getTags
API.getTagByID					    = getTagByID
API.getRandPosts				    = getRandPosts
API.getRelatePosts				  	= getRelatePosts
API.getMostViewsPosts		  		= getMostViewsPosts
API.getMostFavPosts				  	= getMostFavPosts
API.getMostLikePosts			  	= getMostLikePosts
API.getMostCommentPosts				= getMostCommentPosts
API.getRecentCommentPosts			= getRecentCommentPosts
API.getComments					    = getComments
API.fav							    = API.guard(fav)
API.getFavPosts					    = API.guard(getFavPosts)
API.like						    = API.guard(like)
API.getLikePosts				    = API.guard(getLikePosts)
API.getCommentsPosts			  	= API.guard(getCommentsPosts)
API.addComment					    = API.guard(addComment)
API.subscribeMessage        		= API.guard(subscribeMessage)
API.getCodeImg					    = getCodeImg
API.Loginout					    = Loginout
API.getMenuSetting				  	= getMenuSetting
API.indexAdsense				    = indexAdsense
API.listAdsense					    = listAdsense
API.detailAdsense				    = detailAdsense
API.pageAdsense					    = pageAdsense
API.getTwitterPosts         		= getTwitterPosts
API.getTwitterDetail        		= getTwitterDetail
API.markComment             		= API.guard(markComment)

module.exports = API