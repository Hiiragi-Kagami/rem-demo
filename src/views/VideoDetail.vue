<template>
  <div class="video-detail">
    <CustomTopBar></CustomTopBar>
    <div class="video" v-if="videoDetailObject">
      <video controls="controls" :src="videoDetailObject.content"></video>
      <div class="video-info-1">
        <span class="video-category">
          {{videoDetailObject.category.title}}
        </span>
        <span class="video-title">
          {{videoDetailObject.name}}
        </span>
      </div>
      <div class="video-info-2">
        <!-- userinfo可能不存在,后台失误? -->
        <span v-if="videoDetailObject.userinfo">{{videoDetailObject.userinfo.name}}</span>
        <span v-else>不详用户</span>
        <span>187.6万观看</span>
        <span>1.8万弹幕</span>
        <span>{{videoDetailObject.date}}</span>
      </div>
      <div class="video-function">
        <span><i class="fa fa-star"></i>点赞</span>
        <span @click="collectionToggle" :class="{isCollection:isCollection}"><i class="fa fa-star"></i>收藏</span>
        <span><i class="fa fa-star"></i>缓存</span>
        <span><i class="fa fa-star"></i>清晰度</span>
      </div>
    </div>
    <div class="video-recommend-list">
      <VideoItem class='video-recommend-list-item' v-for="(videoItem,videoIndex) in recommendArray" :videoInfo="videoItem" :key="videoIndex"></VideoItem>
    </div>
    <!-- 这里的评论数据传递了两层 -->
    <Comment v-if="commentArray" :commentContentArray="commentArray" @refreshComment="getCommentArray()"></Comment>
  </div>
</template>

<script>
import CustomTopBar from 'components/context/CustomTopBar.vue'
import VideoItem from 'components/context/VideoItem.vue'
import Comment from 'components/context/Comment.vue'
export default {
  name: 'VideoDetail',
  data () {
    return {
      videoDetailObject: null,
      recommendArray: null,
      commentArray: null,
      isCollection: null
    }
  },
  components: {
    Comment,
    VideoItem,
    CustomTopBar
  },
  async created () {
    await this.getVideoDetail()
    this.getRecommendArray()
    this.getCommentArray()
    this.getCollectionStatus()
  },
  async beforeRouteUpdate (to, from, next) {
    // 跳转后再执行,否则路由动态参数还没变
    next()
    await this.getVideoDetail()
    this.getRecommendArray()
    this.getCommentArray()
    this.getCollectionStatus()
  },
  methods: {
    async getVideoDetail () {
      const res = await this.$http({ method: 'get', url: '/article/' + this.$route.query.video_id })
      if (res.status !== 200) {
        return this.$toast('请求详情页失败')
      }
      this.videoDetailObject = res.data.length === 0 ? null : res.data[0]
    },
    async getRecommendArray () {
      const res = await this.$http({ method: 'get', url: '/commend' })
      if (res.status !== 200) {
        return this.$toast('请求推荐页失败')
      }
      this.recommendArray = res.data
    },
    async getCommentArray () {
      const res = await this.$http({ method: 'get', url: '/comment/' + this.$route.query.video_id })
      if (res.status !== 200) {
        return this.$toast('请求评论失败')
      }
      // 该属性用于记录评论总数.遍历方法的时候会加在里面
      res.data.num = 0
      this.commentArray = this.resetCommentArray(res.data, null, [])
      this.commentArray.commentNum = res.data.num
      console.log(this.videoDetailObject)
      // 不用commentArray里各项的article_id是防止里面没有一条消息的情况.
      this.commentArray.articleId = this.videoDetailObject.id
      console.log(this.commentArray)
    },
    async getCollectionStatus () {
      const res = await this.$http({ method: 'get', url: '/collection/' + window.sessionStorage.getItem('userId'), params: { article_id: this.$route.query.video_id } })
      //不验证了,直接赋值
      this.isCollection=res.data.success
    },
    async collectionToggle () {
      const res = await this.$http({ method: 'post', url: '/collection/' + window.sessionStorage.getItem('userId'), data: { article_id: this.$route.query.video_id } })
      console.log(res)
      if (res.status !== 200) {
        return this.$toast(res.data.msg)
      }
      this.$toast(res.data.msg)
      this.isCollection = !this.isCollection
    },
    // 递归方法,将评论array修改为评论tree(数组里的对象还有个对象),便于嵌套遍历,同时也获得所有评论数量,第一个参数是需要改造的评论数组,第二个则是当前判断通过的评论ID,用于传入下层作为父级判断,第三个参数是返回的改造后的数据.
    resetCommentArray (commentArray, temp, resultArray) {
      for (let i = 0; i < commentArray.length; i++) {
        // 当parent_id===null(第一次的temp),和parent_id===commentArray[i].comment_id时(第二次开始的temp),执行
        if (commentArray[i].parent_id === temp || Number(commentArray[i].parent_id) === temp) {
          // 只有一开始传的是空数组,之后传的都是对象.
          if (resultArray instanceof Array) {
            resultArray.push(this.resetCommentArray(commentArray, commentArray[i].comment_id, commentArray[i]))
            commentArray.num++
          } else {
            // 若是第一次添加,需给该属性child设[]初值
            if (!resultArray.child) {
              resultArray.child = []
            }
            resultArray.child.push(this.resetCommentArray(commentArray, commentArray[i].comment_id, commentArray[i]))
            commentArray.num++
          }
        }
      }
      return resultArray
    }
  }

}
</script>

<style scoped lang="less">
  .video {
    width: 100%;
    video {
      width: 100%;
    }
    .video-info-1 {
      margin: 0.15rem;
      .video-category {
        color: #fb7299;
        padding: 0.05rem 0.1rem;
        background-color: #f4f4f4;
        border-radius: 0.1rem;
        font-size: 0.1rem;
      }
      .video-title {
        display: inline-block;
        width: 2.7rem;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin: 0 0.1rem;
        vertical-align: middle;
      }
    }
    .video-info-2 {
      margin: 0.15rem;
      font-size: 0.1rem;
      color: #999;
      span {
        margin: 0 0.1rem;
        &:first-of-type {
          color:black;
        }
      }
    }
    .video-function {
      margin: 0.15rem;
      font-size: 0.1rem;
      color: #999;
      span {
        margin: 0 0.1rem;
        &:first-of-type {
          margin-left: 0;
        }
        &:last-of-type {
          float: right;
          margin-right: 0;
        }
        i {
          font-size: 0.2rem;
          vertical-align: middle;
          margin:0 0.05rem;
        }
      }
      .isCollection {
        color:hotpink;
      }
    }
  }
  .video-recommend-list {
    display: flex;
    flex-flow:row wrap;
    .video-recommend-list-item {
      width: 40%;
      margin:0 5%;
    }
  }
</style>
