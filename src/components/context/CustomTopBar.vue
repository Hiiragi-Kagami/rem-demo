<template>
  <div class="custom-top-bar">
    <!-- 实际上无40% -->
    <MTopBar leftWidth="40%" rightWidth="40%">
      <template #left>
        <div class="custom-left">
          <img class="left-icon" src="~assets/image/icon/bilibiliIcon.png" @click="if($route.path!=='/home'){$router.push('/home')}">
        </div>
      </template>
      <template #center>
          <div class="custom-center">
            <div class="search">
              <i class="fa fa-search"></i>
              <input type="text">
            </div>
          </div>
      </template>
      <template #right>
        <div class="custom-right">
          <div class="user-icon">
            <img v-if="userIconUrl" :src="userIconUrl" @click="if($route.path!=='/user'){$router.push('/user')}">
            <img v-else src="~assets/image/icon/userIconDefault.jpg" @click="$router.push('/login')">
          </div>
          <van-button class="app-button" type="info">下载app</van-button>
        </div>
    </template>
    </MTopBar>
  </div>
</template>

<script>
import MTopBar from 'components/common/MTopBar'
export default {
  name: 'CustomTopBar',
  data () {
    return {
      userIconUrl: ''
    }
  },
  async created () {
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
    }
  },
  components: {
    MTopBar
  }
}
</script>

<style scoped lang="less">
  .custom-left {
    display: flex;
    justify-content: center;
    align-items: center;
    .left-icon {
      width: 100%;
    }
  }
  .custom-center {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .search {
      font-size: 10px;
      height: 60%;
      display: flex;
      flex-grow: 1;
      justify-content: center;
      align-items: center;
      i {
        font-size: 0.2rem;
        margin:0 5px;
      }
      input {
        height: 80%;
      }
    }
  }
  .custom-right {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    // 该组件是border-box
    .app-button {
      height: 80%;
      padding: 0.05rem 0;
      font-size:0.1rem;
      border-radius: 4px;
      flex: 1;
      margin-right: 0.1rem;
    }
    .user-icon {
      width: 0.3rem;
      height: 0.3rem;
      overflow: hidden;
      border-radius: 50%;
      margin-right:0.1rem ;
      img {
        width: 100%
      }
    }
  }
</style>
