<template>
    <div class="comment-item-second">
      <div class="comment-item-second-top">
        <div class="comment-second-title">
          <div class="user-icon-wrapper">
            <!-- 这里的user_img可能为null -->
            <img v-if='commentContentObject.userinfo.user_img' :src="commentContentObject.userinfo.user_img">
            <img v-else src="~assets/image/icon/userIconDefault.jpg">
          </div>
          <div class="user-name">{{commentContentObject.userinfo.name}}</div>
          <div class="comment-date">{{commentContentObject.comment_date}}</div>
        </div>
        <div class="comment-second-content" v-if="isSecond">
          {{commentContentObject.comment_content}}
        </div>
        <div class="comment-second-content" v-else>
          回复&nbsp;<span>@{{commentContentObject.parent_user_info.name}}</span>:{{commentContentObject.comment_content}}
        </div>
        <div class="comment-response-btn" @click="transmitCommentId(commentContentObject.comment_id)">回复</div>
      </div>
      <!-- 准备组件递归 -->
      <div class="comment-item-second-bottom" v-if="commentContentObject.child">
        <CommentItemSecond :commentContentObject="item" v-for="(item,index) in commentContentObject.child" :key="index" @transmitCommentId="transmitCommentId"></CommentItemSecond>
      </div>
    </div>
</template>

<script>
export default {
  name: 'CommentItemSecond',
  props: {
    commentContentObject: {
      type: Object
    },
    // 若为true则用来表示为二级评论用
    isSecond: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 递归
    transmitCommentId (commentId) {
      this.$emit('transmitCommentId', commentId)
    }
  }
}
</script>

<style scoped lang="less">
  .comment-item-second-top {
    position: relative;
    .comment-second-title {
      display: flex;
      padding: 0.1rem;
      font-size: 0.15rem;
      color: #999;
      .user-icon-wrapper {
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .user-name {
        margin-left: 0.1rem;
      }
      .comment-date {
        margin-left:auto;
      }
    }
    .comment-second-content {
      padding: 0 0.1rem 0.1rem 0.5rem;
      font-size: 0.15rem;
      word-break:break-all;
      span {
        color: dodgerblue;
      }
    }
    .comment-response-btn {
      color: dodgerblue;
      position: absolute;
      top: 0.45rem;
      right: 0.1rem;
    }
  }
</style>
