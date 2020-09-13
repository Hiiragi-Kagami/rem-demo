// 该组件宽为100%,高为auto
<template>
    <div class="video-item">
      <div class="video-item-detail-wrapper" @click="$router.push({
      path: '/videoDetail',
      query: {
        video_id: videoInfo.id
      }
      })">
        <img :src="videoInfo.img">
        <div class="comment-play">
          <div class="play"><i class="fa fa-play"></i>1234</div>
          <div class="comment">{{videoInfo.commentlen?videoInfo.commentlen:'0'}}</div>
        </div>
        <div class="name">{{videoInfo.name}}</div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'VideoItem',
  props: {
    videoInfo: {
      type: Object
    }
  }
}
</script>

<style scoped lang="less">
.video-item-detail-wrapper {
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  align-items: center;
  .comment-play {
    font-size: 0.1rem;
    position: absolute;
    width: 80%;
    top:0.75rem;
    display: flex;
    justify-content: space-around;
    padding: 0 10%;
    .play {
      margin-right: auto;
      i {
        margin-right: 0.05rem;
      }
    }
  }
  img {
    width: 100%;
    height: 0.95rem;
  }
  .name {
    margin:0.1rem 0;
  }
}
</style>
