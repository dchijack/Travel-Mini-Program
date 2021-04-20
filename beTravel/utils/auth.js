/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */

const Auth = {}

Auth.user = function() {
    return swan.getStorageSync('user');
}

Auth.token = function() {
    return swan.getStorageSync('token');
}

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

Auth.login = function() {
    return new Promise(function(resolve, reject) {
        if( swan.canIUse('getLoginCode') ) {
            swan.getLoginCode({
                success: function(res){
                    resolve(res);
                },
                fail: function(err) {
                    reject(err);
                }
            });
        } else {
            swan.login({
                success: function(res) {
                    resolve(res);
                },
                fail: function(err) {
                    reject(err);
                }
            });
        }
    });
}

Auth.logout = function() {
    swan.removeStorageSync('user')
    swan.removeStorageSync('token')
    swan.removeStorageSync('expired_in')
    return true
}

Auth.getUserProfile = function(e) {
    return new Promise(function(resolve, reject) {
        if( e.detail.encryptedData && e.detail.iv ) {
            let args = {}
            args.iv = encodeURIComponent( e.detail.iv )
			args.encryptedData = encodeURIComponent( e.detail.encryptedData )
            resolve(args);
        } else {
            swan.getSystemInfo({
                success: p => {
                    reject(e)
                    swan.hideLoading()
                    if( p.platform == 'devtools' ) {
                        swan.showModal({
                            title: '温馨提示',
                            content: '当前为开发工具环境,请使用手机预览调试'
                        })
                    }
                }
            })
        }
    });
}

Auth.getUserInfo = function(e) {
    return new Promise(function(resolve, reject) {
		Auth.getUserProfile(e).then(ret => {
            let args = {}
            args.iv = ret.iv;
			args.encryptedData = ret.encryptedData;
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
			swan.hideLoading()
		})
    });
}

module.exports = Auth