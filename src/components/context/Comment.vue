<template>
    <div class="comment">
      <div class="comment-title">
        <div>评论&nbsp;({{commentContentArray.commentNum}})</div>
        <div class="comment-input-wrapper">
          <div class="user-icon">
            <img v-if="userIconUrl" :src="userIconUrl" @click="$router.push('/user')">
            <img v-else src="~assets/image/icon/userIconDefault.jpg" @click="$router.push('/login')">
          </div>
          <div class="comment-input">
            <input ref='commentInputRef' type="text" v-model='commentModel.comment_content' placeholder="输入你的评论">
          </div>
          <div class="comment-btn" @click="comment">
            发表
          </div>
        </div>
      </div>
      <div class="comment-content">
        <CommentItem v-for="(item,index) in commentContentArray" :commentContentObject="item" :key="index" @commentSecond="commentSecond"></CommentItem>
      </div>
    </div>
</template>

<script>
import CommentItem from 'components/context/CommentItem.vue'
export default {
  name: 'Comment',
  data () {
    return {
      userIconUrl: '',
      commentModel: {
        comment_content: '',
        comment_date: '',
        parent_id: null,
        article_id: 0
      }
    }
  },
  props: {
    commentContentArray: {
      type: Array
    }
  },
  watch: {
    // 如果Array值变了,则重制parents_id为null,发表后id重制为null并不能解决以下问题,点击回复后立马父级跳转页面,此时parents_id并没有重制为null.
    commentContentArray: {
      immediate: true,
      handler: function () {
        this.commentModel.parent_id = null
      }
    }
  },
  components: {
    CommentItem
  },
  created () {
    this.getUserIconUrl()
  },
  methods: {
    // 没用vuex.所以麻烦点
    async getUserIconUrl () {
      const res = await this.$http({ method: 'get', url: '/user/' + window.sessionStorage.getItem('userId') })
      if (res.status !== 200) {
        this.$toast('请求用户头像失败')
      } else {
        this.userIconUrl = res.data[0].user_img
      }
    },
    // 发布评论
    async comment () {
      // 还可以对内容格式校验,这里就不做了
      const dateNow = new Date()
      this.commentModel.comment_date = (dateNow.getMonth() + 1).toString().padStart(2, '0') + '-' + dateNow.getDate().toString().padStart(2, '0')
      this.commentModel.article_id = this.commentContentArray.articleId
      const res = await this.$http({ method: 'post', url: '/comment_post/' + window.sessionStorage.getItem('userId'), data: this.commentModel })
      // 这里不做res的判断,后台返回值不统一,有点问题
      this.$emit('refreshComment')
      // 重制commentModel
      this.commentModel.parent_id = null
      console.log(res)
    },
    // 二级及之后的评论的发布,需要从底层传值来修改发布评论要传的参数,可以用事件总线完成,不过这里就用递归循环发送事件子传父来完成.传入的参数是回复的那条评论的comment_id(即作为新评论parent_id)
    async commentSecond (articleId) {
      console.log('最外层,可以聚焦操作了' + articleId)
      this.commentModel.parent_id = articleId
      this.$refs.commentInputRef.focus()
    }
  }
}
</script>

<style scoped lang="less">
  .comment-title {
    margin: 0.1rem;
    .comment-input-wrapper {
      height: 0.5rem;
      display: flex;
      align-items: center;
      .user-icon {
        margin: 0.1rem 0;
        margin-right: 0.1rem;
        width: 0.3rem;
        height: 0.3rem;
        overflow: hidden;
        border-radius: 50%;
        img {
          width: 100%;
        }
      }
      .comment-input {
        line-height: 0.3rem;
        width: 50%;
        background-color: rgb(245,244,245);
        border-radius: 10px;
        padding-left: 0.05rem;
        input {
          background-color: transparent;
        }
      }
      .comment-btn {
        background-color: #fb7299;
        color: white;
        line-height: 0.3rem;
        padding: 0 0.1rem;
        margin-left: 0.1rem;
        border-radius: 10px;
      }
    }
  }
</style>
