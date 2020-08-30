<!--pages/detail/detail.qml-->
<import src="../../wxParse/wxParse.qml" />

<view class="topic-detail">
  <view class="article-info" qq:if="{{detail}}">
    <text class="title">{{detail.title.rendered}}</text>
    <view class="article-info__category">
      <i class="cuIcon-form icons"></i>
      <text class="category">{{detail.category[0].name}}</text>
      <i class="cuIcon-time icons"></i>
      <text class="time">{{detail.date}}</text>
    </view>
  </view>
  <view class="article-info" qq:else>
    <view class="title" style='width:420rpx;height:40rpx;background:#f3f3f3'></view>
    <view class="article-info__category">
      <image class="avator" style='background:#f3f3f3' src="{{detail.author.avatar}}"></image>
      <text class="category" style='width:100rpx;height:40rpx;background:#f3f3f3'>{{detail.author.name}}</text>
      <i></i>
      <text class="time" style='width:100rpx;height:40rpx;background:#f3f3f3'>{{detail.time}}</text>
    </view>
  </view>
  <view id="entry-content" qq:if="{{article.nodes}}" class="entry-content clearfix">
    <template is="wxParse" data="{{wxParseData:article.nodes}}" />
  </view>
  <view id="entry-content" qq:else class="entry-content clearfix">
    <view style='padding-top:20rpx' qq:for="article" qq:key="index">
      <view style='width:690rpx;height:40rpx;background:#f3f3f3'></view>
      <view style='width:690rpx;height:250rpx;background:#f3f3f3;margin-top:20rpx'></view>
    </view>
  </view>
  <view class="advert" qq:if="{{advert.type == 'unit'}}">
    <ad unit-id="{{advert.code}}"></ad>
  </view>
  <view class="topic-title-wrapper" id="comment">
    <view class="topic-title">话题讨论</view>
    <view class="onlooker-amount relative">
      <text>邀请好友参与讨论 </text>
      <text class="onlooker-arrow">>></text>
      <button open-type='share' class="userLogin"></button>
    </view>
  </view>
  <view class="commentdata">
    <view class="listnodata" qq:if="{{comments.length==0}}">
      <image class="nodataimg" lazyLoad="false" mode="aspectFit|aspectFill|widthFix" src="../../images/message.png"></image>
      <view class="nodatatext">
        <text decode="{{true}}" space="{{true}}">&nbsp;&nbsp;&nbsp;</text>还没有评论，快来抢沙发吧！</view>
    </view>
    <view class="comment-reply">
      <view class="comment-reply-item" bindtap="replyComment" id="{{detail.id}}" data-parent="{{item.id?item.id:0}}" data-reply="{{item.author.name}}" data-formId="{{item.formId}}" qq:for="{{comments}}" qq:for-item="item" qq:key="{{id}}">
        <view class="comment-header">
          <view class="comment-header-left">
            <image class="comment-avatar" src="{{item.author.avatar}}"></image>
            <view class="comment-user-date">
              <text>{{item.author.name}}</text>
              <text>{{item.date}}</text>
            </view>
          </view>
          <view class="comment-header-right relative">
            <text class="{{item.islike ? 'cuIcon-appreciatefill' : 'cuIcon-appreciate'}}"> {{item.likes ? item.likes : 0}}</text>
            <button qq:if="{{!user}}" class="userLogin" open-type="getUserInfo" bindgetuserinfo="getProfile"></button>
            <button qq:else class="userLogin" id="{{item.id}}" data-index="{{index}}" bindtap="bindLikeComment"></button>
          </view>
        </view>
        <view class="comment-content" bindtap="replyComment" data-id="{{item.id}}" data-reply="{{item.author.name}}" data-parent="{{item.id?item.id:0}}" data-userid="{{item.userid}}" data-formId="{{item.formId}}" data-commentdate="{{item.date}}">
          <text bindtap="replay" data-id="{{item.id}}" data-name="{{item.author_name}}" data-userid="{{item.userid}}" data-formId="{{item.formId}}" data-commentdate="{{item.date}}"></text> {{item.content}}
          <view class="{{item.images.length==1?'images-list':'image-list'}}">
            <image mode="widthFix" data-url="{{image}}" data-urls="{{item.images}}" catchtap='openimage' class="comment-image" src="{{image}}" qq:for="{{item.images}}" qq:for-item="image" qq:key="key"></image>
          </view>
        </view>
        <!-- 一级回复 -->
        <view class="replay-content" qq:for="{{item.reply}}" qq:key="itemid1" qq:for-index="idx" qq:for-item="item1">
          <view class="replay-user" catchtap="replyComment" data-id="{{item1.id}}" data-reply="{{item1.author.name}}" data-parent="{{item1.id?item1.id:0}}" data-userid="{{item1.userid}}" data-formId="{{item1.formId}}" data-commentdate="{{item1.date}}">
            <text style="font-weight:bold;"> {{item1.author.name}} </text>:{{item1.content}}
          </view>
          <!-- 二级回复 -->
          <view qq:for="{{item1.reply}}" qq:key="itemid2" qq:for-index="idx" qq:for-item="item2">
            <view class="replay-user" catchtap="replyComment" data-id="{{item2.id}}" data-reply="{{item2.author.name}}" data-userid="{{item2.userid}}" data-formId="{{item2.formId}}" data-commentdate="{{item2.date}}">
              <text style="font-weight:bold;"> {{item2.author.name}} </text> 回复 {{item1.author.name}}:{{item2.content}}
            </view>
            <!-- 三级回复 -->
            <view qq:for="{{item2.reply}}" qq:key="itemid3" qq:for-index="idx" qq:for-item="item3">
              <view class="replay-user" catchtap="replyComment" data-id="{{item3.id}}" data-reply="{{item3.author.name}}" data-userid="{{item3.userid}}" data-formId="{{item3.formId}}" data-commentdate="{{item3.date}}">
                <text style="font-weight:bold;"> {{item3.author.name}} </text> 回复 {{item2.author.name}}:{{item3.content}}
              </view>
              <!-- 四级回复 -->
              <view qq:for="{{item3.reply}}" qq:key="itemid4" qq:for-index="idx" qq:for-item="item4">
                <view class="replay-user">
                  <text style="font-weight:bold;"> {{item4.author.name}} </text> 回复 {{item3.author.name}}:{{item4.content}}
                </view>
              </view>
              <!-- 四级回复 -->
            </view>
            <!-- 三级回复  -->
          </view>
          <!-- 二级回复 -->
        </view>
        <!-- 一级回复  -->
        <view class="comment-footer">
          <view style="height:1px;background:#f1f1f1;margin-right:20rpx"></view>
        </view>
      </view>
    </view>
  </view>

  <view class="bottom" qq:if="{{!showTextarea}}">
    <form catchsubmit="formSubmit" report-submit="true">
      <view class="bottom-bar {{isIphoneX?'bottom-bar-iphonex':''}} {{newsItem.forbidcomment?'forbid-comment':''}}">
        <image bindtap="bindBack" class="bottom-btn bottom-back" src="../../images/back.png"></image>
        <view class="bottom-btn bottom-text relative" style="width:260rpx">
          <text>{{placeholder}}</text>
          <button qq:if="{{!user}}" class="userLogin" bindgetuserinfo="getProfile" open-type="getUserInfo"></button>
          <button qq:else class="userLogin" bindtap="tapcomment"></button>
        </view>
        <view class="bottom-btn bottom-comment-container relative">
          <image class="bottom-comment" src="{{detail.isfav?'../../images/collected.png':'../../images/collect.png'}}"></image>
          <button qq:if="{{!user}}" class="userLogin" bindgetuserinfo="getProfile" open-type="getUserInfo"></button>
          <button qq:else class="userLogin" bindtap="bindFavTap" id="{{detail.id}}" ></button>
        </view>
        <view class="bottom-btn bottom-comment-container">
          <image class="bottom-btn bottom-fav" src="{{detail.islike?'../../images/liked.png':'../../images/like.png'}}"></image>
          <button qq:if="{{!user}}" class="userLogin" bindgetuserinfo="getProfile" open-type="getUserInfo"></button>
          <button qq:else class="userLogin" bindtap="bindLikeTap" id="{{detail.id}}"></button>
        </view>
        <button bindtap="shareClick" class="bottom-btn bottom-share bottom-fav btn-clear-style" plain="true">
          <image src="../../images/share.png"></image>
        </button>
      </view>
    </form>
  </view>
 
  <view class="zan-actionsheet {{isIphoneX?'bottom-bar-iphonex':''}} {{shareshow?'zan-actionsheet--show':''}}">
    <view catchtap="_handleZanActionsheetMaskClick" class="zan-actionsheet__mask" data-close-on-click-overlay="{{closeOnClickOverlay}}" data-component-id="{{componentId}}"></view>
    <view class="zan-actionsheet__container">
        <button catchtap="downloadPrefix" class="zan-btn zan-actionsheet__btn">
            <image class="down-icon" mode="aspectFit" src="../../images/down.svg"></image>
            <text>分享海报图</text>
        </button>
        <button open-type="share" class="zan-btn zan-actionsheet__btn">
            <image class="down-icon" mode="aspectFit" src="../../images/wechat.svg"></image>
            <text>分享给朋友</text>
        </button>
    </view>
  </view>

  <view capture-catch:touchmove class="textareacontent" qq:if="{{showTextarea}}">
    <form catchsubmit="addComment" report-submit="true">
      <view class="textheaders">
        <view bindtap="closeCommentary" class="cancel">取消</view>
        <button qq:if="{{!user}}" class="{{iscanpublish?'publish':'nopublish'}}" bindgetuserinfo="getProfile" open-type="getUserInfo">登录</button>
        <button qq:else form-type="submit" class="{{iscanpublish?'publish':'nopublish'}}">发布</button>
      </view>
      <view class="textareaBox" qq:if="{{showTextarea}}">
        <view class="textareaInput" qq:if="{{!focus}}">{{content}}</view>
        <textarea autoFocus="true" name="inputComment" bindinput="bindInputContent" bindblur="onReplyBlur" bindfocus="onRepleyFocus" class="textareaInput {{focus?'':'hide'}}" fixed="true" focus="{{focus}}" maxlength="1000" placeholder="{{placeholder}}" showConfirmBar="{{false}}" style="height: 286rpx;" value="{{content}}"></textarea>
        <view class="textNum">{{textNum}}/1000</view>
      </view>
    </form>
  </view>
  <view bindtap="closeCommentary" class="pagemake" qq:if="{{showTextarea}}"></view>
</view>
<view class="canvas">
  <canvas canvas-id="prefix" style="width: 600px;height: 970px;"></canvas>
</view>
<view class="widget-bar" qq:if="{{isPlaying}}">
  <view class="widget-playing" bindtap="bindAudioPlay">
    <view class="widget-playing-icon">
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </view>
  </view>
</view>