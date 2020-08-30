<!--pages/twitter/twitter.qml-->
<block qq:if="{{posts}}">
  <view class="custom-card">
    <block qq:for="{{posts}}" qq:key="id" qq:for-item="item" qq:for-index="i">
      <block qq:if="{{i%5==0}}">
        <view class="custom-item" id="{{item.id}}" bindtap="bindPosts">
          <view class="title">{{item.title.rendered}}</view>
          <view class="content">
            <image src="{{item.meta.thumbnail?item.meta.thumbnail:'../../images/default.jpg'}}" mode="aspectFill"></image>
            <view class="desc">
              <view class='text-content'>{{item.excerpt.rendered}}</view>
              <view>
                <view class="custom-tag custom-fl">{{item.meta.author}}</view>
                <view class="custom-tag custom-fr">{{item.time}}</view>
              </view>
            </view>
          </view>
        </view>
        <!--cu-card首篇结束-->
        <view class="advert" qq:if="{{advert.type == 'unit'}}">
          <ad unit-id="{{advert.code}}"></ad>
        </view>
      </block>
      <block qq:else>
        <view class="custom-item" id="{{item.id}}" bindtap="bindPosts">
          <view class="title">{{item.title.rendered}}</view>
          <view class="content">
            <image src="{{item.meta.thumbnail?item.meta.thumbnail:'../../images/default.jpg'}}" mode="aspectFill"></image>
            <view class="desc">
              <view class='text-content'>{{item.excerpt.rendered}}</view>
              <view>
                <view class="custom-tag custom-fl">{{item.meta.author}}</view>
                <view class="custom-tag custom-fr">{{item.time}}</view>
              </view>
            </view>
          </view>
        </view>
      </block>
    </block>  
  </view>
  <!--cu-card列表结束-->
</block>