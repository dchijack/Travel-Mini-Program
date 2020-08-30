<!--index.qml-->
<view class="page {{isIphoneX?'iphone-x':''}}">
  <view class="banner">
    <image class="banner-bg" mode="widthFix" src="{{siteInfo && siteInfo.cover ? siteInfo.cover : 'https://cloud-minapp-16269.cloud.ifanrusercontent.com/tangzhi_banner_v4.jpg'}}"></image>
    <view class="banner-info" style="top: {{navBarHeight+150}}rpx">
      <view class="banner-title">
        <view class="banner-title_text">{{siteInfo.name}}</view>
      </view>
      <view class="banner-brief">{{siteInfo.description}}</view>
    </view>
    <view class="index-search container-class">
      <view class="search-icon icon-class"></view>
      <input bindconfirm="onConfirm" bindinput="onInput" class="search-input input-class" confirmType="search" focus="{{autoFocus}}" placeholder="{{placeHolder}}" placeholderClass="search-input-placeholder" value="{{searchKey}}" qq:if="{{inputEnable}}"></input>
      <view class="search-input" qq:else>{{placeHolder}}</view>
      <image bindtap="onClear" class="close-btn" src="https://cloud-minapp-16269.cloud.ifanrusercontent.com/product-image-close.svg" qq:if="{{searchKey}}"></image>
    </view>

  </view>
  <view class="tab-content">
    <view class="index">
      <view class="index_label" style="margin-top: 80rpx" qq:if="{{posts.length>0}}">
        <view class="index_label_title">为你精选</view>
        <view class="index_label_bg"></view>
        <view class="index_label_more">
          <view bindtap="bindCateByID" class="category" id="{{item.id}}" qq:for="{{category}}" qq:key="item" qq:if="{{index < 2}}">{{item.name}}</view>
          <image bindtap="bindCateList" src="../../images/more.png" style="width: 26rpx;height: 24rpx;padding: 30rpx 15rpx"></image>
        </view>
      </view>
      <view class="index_article" qq:if="{{posts.length>0}}">
        <block qq:for="{{posts}}" qq:for-index="i" qq:key="id">
          <block qq:if="{{i%5 == 0}}">
            <view bindtap="bindDetail" id="{{item.id}}">
              <view style="position: relative;height: 380rpx">
                <image mode="aspectFill" class="index_article_cover" src="{{item.meta.thumbnail}}"></image>
                <view class="index_article_during">
                  <text>{{item.category[0].name}}</text>
                </view>
              </view>
              <view class="index_article_title">{{item.title.rendered}}</view>
              <view class="index_article_desc">{{item.excerpt.rendered}}</view>
            </view>
            <view class="advert" qq:if="{{advert.type == 'unit'}}">
              <ad unit-id="{{advert.code}}"></ad>
            </view>
          </block>
          <block qq:else>
            <view bindtap="bindDetail" id="{{item.id}}">
              <view style="position: relative;height: 380rpx">
                <image mode="aspectFill" class="index_article_cover" src="{{item.meta.thumbnail}}"></image>
                <view class="index_article_during">
                  <text>{{item.category[0].name}}</text>
                </view>
              </view>
              <view class="index_article_title">{{item.title.rendered}}</view>
              <view class="index_article_desc">{{item.excerpt.rendered}}</view>
            </view>
          </block>
        </block>
      </view>
      <view class="last_text" qq:if="{{isLastPage&&posts.length>0}}">已经到底啦~</view>
      <view class="last_text" qq:if="{{!isLastPage&&posts.length>0}}">努力加载中...</view>
    </view>
  </view>
</view>