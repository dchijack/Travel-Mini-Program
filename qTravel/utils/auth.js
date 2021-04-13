/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */

const Auth = {}

Auth.user = function() {
    return qq.getStorageSync('user');
}

Auth.token = function() {
    return qq.getStorageSync('token');
}

Auth.check = function() {
    let user = Auth.user()
    let token = Auth.token()
    if (user && Date.now() < qq.getStorageSync('expired_in') && token) {
        console.log('access_token过期时间：', (qq.getStorageSync('expired_in') - Date.now()) / 1000, '秒');
        return true;
    } else {
        return false;
    }
}

Auth.login = function() {
    return new Promise(function(resolve, reject) {
        qq.login({
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
    qq.removeStorageSync('user')
    qq.removeStorageSync('token')
    qq.removeStorageSync('expired_in')
    return true
}

Auth.getUserInfo = function(){
    return new Promise(function(resolve, reject) {
		Auth.login().then(data => {
			let args = {}
			args.code = data.code;
			qq.getUserInfo({
				success: function (res) {
					//console.log(res);
					args.iv = encodeURIComponent(res.iv);
					args.encryptedData = encodeURIComponent(res.encryptedData);
					resolve(args);
				},
				fail: function (err) {
					reject(err);
				}
			});
		})
    });
}

module.exports = Auth