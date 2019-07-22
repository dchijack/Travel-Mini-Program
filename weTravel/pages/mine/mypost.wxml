<view class="tab-content">
  <view class="index">
    <view class="index_label">
      <view class="index_label_title">{{category}}</view>
      <view class="index_label_bg"></view>
    </view>
    <view class="index_video">
      <view bindtap="goArticleDetail" id="{{item.id}}" wx:if="{{posts.length>0}}" wx:for="{{posts}}" wx:key="item">
        <view style="position: relative;height: 380rpx">
          <image mode="aspectFill" class="index_video_cover" src="{{item.meta.thumbnail}}"></image>
          <view class="index_video_during">
            <image src="../../images/cate.png" style="width: 20rpx;height: 20rpx"></image>
            <text>{{item.category[0].name}}</text>
          </view>
        </view>
        <view class="index_video_title">{{item.title.rendered}}</view>
        <view class="index_video_desc">{{item.excerpt.rendered}}</view>
      </view>
      <view wx:if="{{isLoadAll&&posts.length==0}}">
        暂无内容
      </view>
    </view>

    <view class="last_text" wx:if="{{isLoadAll&&videos.length>0}}">已经到底啦~</view>
    <view class="last_text" wx:if="{{!isLoadAll&&videos.length>0}}">努力加载中...</view>
  </view>

</view>