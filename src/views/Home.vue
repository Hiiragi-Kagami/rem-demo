<template>
  <div class="home">
    <CustomTopBar></CustomTopBar>
    <van-tabs v-model="activeIndex" sticky line-width="0.4rem" @click="tabOnClick">
      <van-tab v-for="(item,index) in menuCategoryArray" :title="item.title" :key="index">
        <van-list v-model="item.loading" :finished="item.finished" v-if='index===activeIndex' finished-text="没有更多了" @load="onLoad(item,index)">
          <div class="video-list">
          <!-- van-tab一旦用了v-for就有bug,不能正常切换,需要自己v-if设定显示,v-if在上面 -->
            <VideoItem class='video-list-item' v-for="(videoItem,videoIndex) in item.videoList" :videoInfo="videoItem" :key="videoIndex"></VideoItem>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import CustomTopBar from 'components/context/CustomTopBar.vue'
import VideoItem from 'components/context/VideoItem.vue'
export default {
  name: 'Home',
  components: { CustomTopBar, VideoItem },
  data () {
    return {
      menuCategoryArray: [],
      activeIndex: 0
    }
  },
  async created () {
    // 请求菜单数据并赋值
    const res = await this.$http({ method: 'get', url: '/category' })
    // 往字段里新加一个videoList,用于存放各个菜单的数据.以及请求页码和数量
    this.menuCategoryArray = res.data.map((item, index) => {
      item.videoList = []
      // 页码参数
      item.page = 0
      item.pagesize = 10
      // van-list组件要用,让各个tab独立开来
      item.loading = false
      item.finished = false
      return item
    })
    // 触发第一个标签即首页的点击事件
    this.tabOnClick(0)
  },
  methods: {
    // 请求视频
    async getVideoList (params, categoryId) {
      const res = await this.$http({ method: 'get',
        url: '/detail/' + categoryId,
        params: params
      })
      return res
    },
    // name即v-model绑定的值,即索引(在tab无name属性情况下)
    async tabOnClick (name, title) {
      const categoryId = this.menuCategoryArray[name]._id
      const params = {
        'page': this.menuCategoryArray[name].page,
        'pagesize': this.menuCategoryArray[name].pagesize
      }
      const res = await this.getVideoList(params, categoryId)
      console.log(res)
      if (res.status !== 200) {
        return this.$toast('请求失败')
      }
      this.menuCategoryArray[name].videoList = res.data
    },
    // 下拉加载事件
    async onLoad (item) {
      const categoryId = item._id
      const params = {
        'page': item.page++,
        'pagesize': item.pagesize
      }
      const res = await this.getVideoList(params, categoryId)
      if (res.status !== 200) {
        return this.$toast('请求失败')
      }
      if (res.data.length === 0) {
        item.finished = true
        return
      }
      item.videoList.push(...res.data)
      item.loading = false
    }
  }
}
</script>

<style scoped lang="less">
  .video-list {
    display: flex;
    flex-flow:row wrap;
    .video-list-item {
      width: 40%;
      margin:0 5%;
    }
  }
</style>
