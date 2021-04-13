/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */

const Auth = {}

Auth.user = function() {
    return wx.getStorageSync('user');
}

Auth.token = function() {
    return wx.getStorageSync('token');
}

Auth.check = function() {
    let user = Auth.user()
    let token = Auth.token()
    if (user && Date.now() < wx.getStorageSync('expired_in') && token) {
        console.log('access_token过期时间：', (wx.getStorageSync('expired_in') - Date.now()) / 1000, '秒');
        return true;
    } else {
        return false;
    }
}

Auth.login = function() {
    return new Promise(function(resolve, reject) {
        wx.login({
            success: function(res) {
                resolve(res);
            },
            fail: function(err) {
                reject(err);
            }
        });
    });
}

Auth.logout = function() {
    wx.removeStorageSync('user')
    wx.removeStorageSync('token')
    wx.removeStorageSync('expired_in')
    return true
}

Auth.getUserProfile = function( ) {
    return new Promise(function(resolve, reject) {
        wx.getUserProfile({
            desc: "用于完善会员基本信息",
            success: function(res){
                let args = {}
                args.iv = encodeURIComponent(res.iv);
                args.encryptedData = encodeURIComponent(res.encryptedData);
                resolve(args);
            },
            fail: function(err) {
                reject(err);
            }
        });
    });
}

Auth.getUserInfo = function(){
    return new Promise(function(resolve, reject) {
		Auth.getUserProfile().then(res => {
            let args = {}
            args.iv = res.iv;
			args.encryptedData = res.encryptedData;
            Auth.login().then(res => {
                args.code = res.code
                resolve(args);
            })
            .catch(err => {
                reject(err);
            })
        })
        .catch(err => {
            console.log(err)
			wx.hideLoading()
		})
    });
}

module.exports = Auth