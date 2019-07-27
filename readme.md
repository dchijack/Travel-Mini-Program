# WordPress Travel Mini Program

> 标签：旅游、笔记、博客

基于 WordPress Mini Program API 插件创建的 WordPress 小程序之 Travel 主题，包括微信小程序及 QQ 小程序。虽然说是旅游类型，但是同样也适用于日记类型小程序，博客类型小程序。

# WordPress Mini Program API 插件

由 丸子小程序团队 基于 WordPress REST 创建小程序应用 API 数据接口。免费开源，实现 WordPress 连接小程序应用数据。插件地址：[点击这里访问](https://github.com/dchijack/wp-mini-program)

# WordPress Travel Mini Program 说明

1. 分别有微信小程序前端、 QQ 小程序前端和百度智能小程序前端
2. weTravel 为微信小程序前端，qTravel 为 QQ 小程序前端， beTravel 为百度智能小程序前端

## 安装指南

1. 点击 Clone or download 下拉选择 Download ZIP 或者[点击这里](https://github.com/dchijack/Travel-Mini-Program/releases)下载源码包

2. 解压压缩包后, 打开 weTravel / qTravel / beTravel 文件夹 utils 目录下的 base.js

3. 修改 base.js 里的 **const API_HOST = '你的域名'**  // 注意，域名需要填写协议，比如 https://cxcat.com

4. 登录微信公众号小程序后台 - 开发 - 服务器配置 ，把你的域名加入 request 域名

5. 登录网站后台, 在仪表盘下方的小程序设置里，填写上对应的 AppID 和 AppScret

6. 然后使用微信开发者工具导入 weTravel 目录进行开发调试, 使用 QQ 小程序开发者工具导入 qTravel 目录进行开发调试，使用百度开发者工具导入 beTravel 目录进行开发调试

## 预览截图

![小程序截图](https://github.com/dchijack/Travel-Mini-Program/blob/master/screenshot/20190722154321.jpg)

![小程序截图](https://github.com/dchijack/Travel-Mini-Program/blob/master/screenshot/20190722154328.jpg)

![小程序截图](https://github.com/dchijack/Travel-Mini-Program/blob/master/screenshot/20190722154336.jpg)

![小程序截图](https://github.com/dchijack/Travel-Mini-Program/blob/master/screenshot/20190722154402.jpg)

![小程序截图](https://github.com/dchijack/Travel-Mini-Program/blob/master/screenshot/20190722154355.jpg)

![小程序截图](https://github.com/dchijack/Travel-Mini-Program/blob/master/screenshot/20190722154348.jpg)

## 小程序体验

使用微信扫描下方二维码

![微信小程序](https://github.com/dchijack/Travel-Mini-Program/blob/master/screenshot/wechat-mini-program.jpeg)

使用手机 QQ 扫描下方二维码

![QQ小程序](https://github.com/dchijack/Travel-Mini-Program/blob/master/screenshot/qq-mini-program.jpeg)

## 关注公众号

关注微信公众号 WordPressTalk

![微信公众号二维码](https://github.com/dchijack/WP-REST-API/blob/master/qrcode.jpg)

## 讨论交流群

由于讨论交流群已经满了 100 人, 无法扫描二维码加入，可以扫描下方二维码添加好友，由群主拉入群。添加好友时，请注明：开源

![二维码](https://github.com/dchijack/Travel-Mini-Program/blob/master/screenshot/20190723104521.jpg)