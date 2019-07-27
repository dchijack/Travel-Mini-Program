/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
const API = require('./utils/base')

App({
    onLaunch(options) {
        API.login();
        if (swan.canIUse('showFavoriteGuide')) {
            swan.showFavoriteGuide({
                type: 'bar',
                content: '一键添加到我的小程序',
                success(res) {
                    console.log('添加成功：', res);
                },
                fail(err) {
                    console.log('添加失败：', err);
                }
            });
        }
    },
    onShow(options) {
        this.globalData.user = API.getUser();
    },
    onHide() {
        // do something when hide
    },
    globalData: {
        user: ''
    }
});
