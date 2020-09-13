<template>
    <div class="user">
      <CustomTopBar></CustomTopBar>
      <!-- 头部背景图 -->
      <div class="top-backimg">
        <img src="//s1.hdslb.com/bfs/static/jinkela/mstation-h5/asserts/bannerTop_new.png">
      </div>
      <!-- 上层用户信息 -->
      <div class="user-info-top">
        <div class="user-icon">
          <img v-if="userObject.user_img" :src="userObject.user_img" @click="$router.push('/userEdit')">
          <img v-else src="~assets/image/icon/userIconDefault.jpg" @click="$router.push('/userEdit')">
        </div>
        <div class="user-detail">
          <div class="user-detail-item">
            <div>8</div>
            <div>粉丝</div>
          </div>
          <span class="spilt"></span>
          <div class="user-detail-item">
            <div>8</div>
            <div>关注</div>
          </div>
          <span class="spilt"></span>
          <div class="user-detail-item">
            <div>8</div>
            <div>获赞</div>
          </div>
          <div class="user-edit-btn" @click="$router.push('/userEdit')">
            编辑资料
          </div>
        </div>
      </div>
      <!-- 下层用户信息 -->
      <div class="user-info-bottom">
        <div class="user-name">{{userObject.name}}</div>
        <div class="user-introduce" v-if="userObject.desc">
          <span class="user-introduce-content">123456</span>
          <span class="expand-btn" @click="expandBtnClick">{{expandBtnValue}}</span>
          <div class="expand-content" :class="{show:expandIsShow}">
            <van-tag plain type="primary">数据</van-tag>
          </div>
        </div>
        <div class="user-introduce" v-else>
          这个人很神秘,啥都没写
        </div>
      </div>
      <!-- 动态,视频标签 -->
      <div class="nav-bar">
        <span class="nav-bar-item">动态</span>
        <span class="nav-bar-item">视频</span>
      </div>
    </div>
</template>

<script>
import CustomTopBar from 'components/context/CustomTopBar.vue'
export default {
  name: 'User',
  components: { CustomTopBar },
  data () {
    return {
      expandBtnValue: '展开',
      expandIsShow: false,
      userObject: {}
    }
  },
  created () {
    this.getUserObject()
  },
  methods: {
    expandBtnClick () {
      // 切换展开按钮显示文本
      this.expandBtnValue = this.expandBtnValue === '展开' ? '收起' : '展开'
      this.expandIsShow = !this.expandIsShow
    },
    async getUserObject () {
      const res = await this.$http({ method: 'get', url: '/user/' + window.sessionStorage.getItem('userId') })
      if (res.status !== 200) {
        this.$toast('请求用户信息失败')
      } else {
        this.userObject = res.data[0]
      }
    }
  }
}
</script>

<style scoped lang="less">
  .top-backimg {
    overflow: hidden;
    height: 1rem;
    img {
      width: 100%;
    }
  }
  .user-info-top {
    display: flex;
    position: relative;
    .user-icon {
      position: absolute;
      top:-0.1rem;
      left: 0.1rem;
      width: 0.84rem;
      height: 0.84rem;
      overflow: hidden;
      border-radius: 50%;
      img {
        width: 100%;
      }
    }
    .user-detail {
      flex-grow: 1;
      display: flex;
      align-items: center;
      flex-flow: row wrap;
      .user-detail-item {
        width: 20%;
        margin: 0.1rem 0;
        text-align: center;
        &:first-of-type {
          margin-left: 35%;
        }
      }
      .spilt {
        width: 0.01rem;
        height: 0.25rem;
        background: #e7e7e7;
      }
      .user-edit-btn {
        line-height: 0.28rem;
        border-radius: 0.05rem;
        width: 60%;
        background: #fff;
        border: 1px solid #fb7299;
        color: #fb7299;
        margin-left: 35%;
        text-align: center;
      }
    }
  }
  .user-info-bottom {
    margin-left: 0.1rem;
    .user-name {
      font-size: 0.21rem;
      margin-top: 0.18rem;
      margin-bottom: 0.1rem;
    }
    .user-introduce {
      margin: 0.1rem 0;
      color: #999;
      font-size:0.12rem;
      .expand-btn {
        float: right;
        margin-right: 0.1rem;
        color: #1389bf;
      }
      .expand-content {
        height: 0;
        overflow: hidden;
        margin-top: 0.04rem;
        margin-left: 0.04rem;
        transition: height 0.2s;
      }
      .show {
        height: 0.24rem;
      }
    }
  }
  .nav-bar {
    border-top: 0.01rem solid #e7e7e7;
    border-bottom: 0.01rem solid #e7e7e7;
    .nav-bar-item {
      display: inline-block;
      margin: 0.1rem;
    }
  }
</style>
