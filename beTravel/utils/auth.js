/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */

const Auth = {}

/**
 * 获取当前登陆用户的openid
 * @return {string}
 */
Auth.openid = function() {
    const user = Auth.user()
    if (user && user.openid) {
        return user.openid
    } else {
        return ''
    }
}

/**
 * 获取当前登陆用户信息
 * @return {object}
 */
Auth.user = function() {
    return swan.getStorageSync('user');
}

/**
 * 获取token
 * @return {string}
 */
Auth.token = function() {
    return swan.getStorageSync('token');
}

/**
 * 判断token还是否在有效期内
 * @return {boolean}
 */
Auth.check = function() {
    let user = Auth.user()
    let token = Auth.token()
    if (user && Date.now() < swan.getStorageSync('expired_in') && token) {
        console.log('access_token过期时间：', (swan.getStorageSync('expired_in') - Date.now()) / 1000, '秒');
        return true;
    } else {
        return false;
    }
}

/**
 * 登录
 * @return {Promise} 登录信息
 */
Auth.login = function() {
    return new Promise(function(resolve, reject) {
        swan.login({
            success: function(res) {
                //console.log('swan.login.code', res.code);
                resolve(res);
            },

            fail: function(err) {
                reject(err);
            }
        });
    });
}

/**
 * 通过 swan.login 获取code
 * @return code
 */
Auth.code = function(){
    return new Promise(function(resolve, reject) {
        swan.login({
            success: function(res){
                resolve(res.code);
            },

            fail: function(err) {
                reject(err);
            }
        });
    });
}

/**
 * 注销
 * @return {boolean}
 */
Auth.logout = function() {
    swan.removeStorageSync('user')
    swan.removeStorageSync('token')
    swan.removeStorageSync('expired_in')
    return true
}

/**
 * 获取授权登录加密数据
 */
Auth.getUserInfo = function(){
    return new Promise(function(resolve, reject) {
		Auth.code().then(data => {
			let args = {}
			args.code = data;
			swan.getUserInfo({
				success: function (res) {
                    //console.log(res);
                    args.encryptedData = encodeURIComponent(res.data);
                    args.iv = encodeURIComponent(res.iv);
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