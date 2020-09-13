//这个组件是渲染一级评论的,二级(且二级和后续的有点小区别)及以后需要再做个组件做递归
<template>
  <div class="comment-item">
    <div class="comment-item-left">
      <div class="user-icon-wrapper">
        <!-- 这里的user_img可能为null -->
        <img v-if='commentContentObject.userinfo.user_img' :src="commentContentObject.userinfo.user_img">
        <img v-else src="~assets/image/icon/userIconDefault.jpg">
      </div>
    </div>
    <div class="comment-item-right">
      <div class="comment-title">
        <div class="user-name">{{commentContentObject.userinfo.name}}</div>
        <div class="comment-date">{{commentContentObject.comment_date}}</div>
      </div>
      <div class="comment-content">
        {{commentContentObject.comment_content}}
      </div>
      <div class="comment-response-btn" @click="transmitCommentId(commentContentObject.comment_id)">回复</div>
      <!-- 渲染二级评论 -->
      <div v-if="commentContentObject.child" class="comment-item-second-wrapper">
        <CommentItemSecond v-for="(item,index) in commentContentObject.child" :commentContentObject="item" :isSecond="true" :key="index" @transmitCommentId="transmitCommentId">
        </CommentItemSecond>
      </div>
    </div>
  </div>
</template>

<script>
import CommentItemSecond from 'components/context/CommentItemSecond.vue'
export default {
  name: 'CommentItem',
  components: { CommentItemSecond },
  props: {
    // 对象(包括数组函数?)的默认值为null,且传入null也会接收,不会报错,所以当commentContent为null时,有些场景需要v-if取消显示,然而该数据只是作为一个v-for遍历的数组,所以就算为null也不会报错
    commentContentObject: {
      type: Object
    }
  },
  methods: {
    transmitCommentId (commentId) {
      this.$emit('commentSecond', commentId)
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  display: flex;
  flex-flow:row nowrap;
  border-bottom: 1px solid #e7e7e7;
  margin:0.15rem;
  .comment-item-left {
    width: 10%;
    .user-icon-wrapper {
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 0.05rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .comment-item-right {
    width: 90%;
    position: relative;
    .comment-title {
      display: flex;
      font-size: 0.15rem;
      color: #999;
      .user-name {
        margin-left: 0.2rem;
        flex-grow: 1;
      }
      .comment-date {
        margin-right: 0.1rem;
      }
    }
    .comment-content {
      width: 80%;
      padding: 0.1rem 0;
      margin: 0 10%;
      font-size: 0.15rem;
      word-break:break-all;
    }
    .comment-response-btn {
      color: dodgerblue;
      position: absolute;
      top: 0.25rem;
      right: 0.1rem;
    }
  }
}
</style>
