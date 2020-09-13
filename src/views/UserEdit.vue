<template>
    <div class="user-edit">
      <div :style="{backgroundColor:'white'}">
        <!-- 加ref是因为这个组件会修改图标,上传图片后需要重新发请求触发刷新这个组件 -->
        <CustomTopBar ref="customTopBar"></CustomTopBar>
      </div>
      <div class="edit-content" @click="showEditDialog">
        <div class="user-icon">
          头像
          <div class="user-icon-wrapper">
            <img v-if="userObject.user_img" :src="userObject.user_img">
            <img v-else src="~assets/image/icon/userIconDefault.jpg">
          </div>
          <!-- 图片上传区域,思路是把上传区域用组件属性size:100vw调大至占满整个宽度(设width没用),因为高度会等比例放大,所以来个容器包裹住它,overflow:hidden,绝对定位后,透明度调0;或者也可以用他提供的默认插槽 -->
          <div class="van-uploader-wrapper">
            <van-uploader preview-size="100vw" :after-read="afterRead"/>
          </div>
        </div>
        <div class="user-name">昵称<span class="name">{{userObject.name}}</span></div>
        <div class="user-uid">UID<span class="id">{{userObject.id}}</span></div>
        <div class="user-gender" @click="showEditAction">性别<span class="gender">{{userObject.gender==='0'?'男':'女'}}</span></div>
        <div class="user-birthday">出生日期<span>接口无该字段</span></div>
        <div class="user-introduce">个性标签<span class="user_desc">{{userObject.user_desc}}</span></div>
      </div>
      <div class="log-out-btn" @click="loginOut">退出登录</div>
      <div class="back-btn" @click="back">返回空间</div>
      <!-- 基础信息修改对话框 -->
      <van-dialog v-model="editDialogObject.isDialogShow" :title="'修改'+editDialogObject.editDialogTitle" show-cancel-button @confirm="confirmEditDialog">
        <van-form ref="editForm">
          <van-field class='edit-input' v-model="editDialogObject.editDialogValue" :label="editDialogObject.editDialogLable+':'" :rules="editDialogObject.rules[editDialogObject.editDialogKey]" label-width="auto"></van-field>
        </van-form>
      </van-dialog>
      <!-- 特殊信息底部弹出选择框 -->
      <van-action-sheet v-model="editActionObject.isActionShow" :actions="editActionObject.actions[editActionObject.editActionKey]" @select="editActionSelect" close-on-click-action/>
    </div>
</template>

<script>
import CustomTopBar from 'components/context/CustomTopBar.vue'
export default {
  name: 'UserEdit',
  components: { CustomTopBar },
  data () {
    return {
      userObject: {},
      // 修改对话框相关
      editDialogObject: {
        isDialogShow: false,
        editDialogTitle: '',
        editDialogLable: '',
        editDialogValue: '',
        editDialogKey: '',
        rules: {
          'name': [{ required: true, message: '请填写姓名' }, { pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: '请输入正确姓名' }],
          'user_desc': [{ required: true, message: '请填写正确简介' }, { pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: '请输入正确简介' }]
        }
      },
      // 弹出选择框相关
      editActionObject: {
        isActionShow: false,
        editActionValue: '',
        editActionKey: '',
        actions: {
          'gender': [{ name: '男' }, { name: '女' }]
        }
      }

    }
  },
  created () {
    this.getUserObject()
  },
  mounted () {
  },
  methods: {
    async getUserObject () {
      const res = await this.$http({ method: 'get', url: '/user/' + window.sessionStorage.getItem('userId') })
      console.log(res)
      if (res.status !== 200) {
        this.$toast('请求用户信息失败')
      } else {
        this.userObject = res.data[0]
      }
    },
    async editUserObject () {
      const res = await this.$http({ method: 'post', url: '/update/' + window.sessionStorage.getItem('userId'), data: this.userObject })
      return res
    },
    // 上传图片的方法
    async afterRead (fileObject) {
      // 将数据转换为表单形式,对接后台
      const formdata = new FormData()
      formdata.append('file', fileObject.file)
      const res = await this.$http({ method: 'post', url: '/upload', data: formdata })
      if (res.status !== 200) {
        return this.$toast('修改头像失败')
      }
      this.$toast('修改头像成功')
      // 前台修改
      this.userObject.user_img = res.data.url
      // 用前台修改后的参数 后台修改
      this.editUserObject().then(() => {
        // 刷新头部栏,且得在数据修改之后.
        this.$refs.customTopBar.getUserIconUrl()
      }
      )
    },
    // 登出按钮事件
    loginOut () {
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('userId')
      this.$router.push('/login')
    },
    // 回退按钮事件
    back () {
      this.$router.push('/user')
    },
    // 事件委托展示对话框
    showEditDialog (event) {
      // 特定输入框才触发事件
      if (event.target.parentNode === event.currentTarget && (event.target.className !== 'user-icon' && event.target.className !== 'user-uid' && event.target.className !== 'user-gender')) {
        this.editDialogObject.editDialogTitle = event.target.childNodes[0].nodeValue
        this.editDialogObject.editDialogLable = event.target.childNodes[0].nodeValue
        this.editDialogObject.editDialogKey = event.target.childNodes[1].className
        this.editDialogObject.editDialogValue = this.userObject[this.editDialogObject.editDialogKey]
        this.editDialogObject.isDialogShow = true
      }
    },
    // 对话框confirm后操作
    async confirmEditDialog () {
      this.$refs.editForm.validate().then(async () => {
        // 存取旧值
        const oldVar = this.userObject[this.editDialogObject.editDialogKey]
        this.userObject[this.editDialogObject.editDialogKey] = this.editDialogObject.editDialogValue
        const { data } = await this.editUserObject()
        console.log(data)
        if (data.code !== 200) {
          this.$toast('修改失败')
          // 回退操作
          this.userObject[this.editDialogObject.editDialogKey] = oldVar
        } else {
          this.$toast('修改成功')
          // 关掉对话框
          this.editDialogObject.isDialogShow = false
        }
      }).catch(() => {
        this.$toast('修改失败,前端格式校验不通过')
      })
    },
    // 展示底部弹出选择框
    showEditAction (event) {
      this.editActionObject.editActionKey = event.currentTarget.childNodes[1].className
      this.editActionObject.editActionValue = this.userObject[this.editActionObject.editActionKey]
      this.editActionObject.isActionShow = true
    },
    // 底部弹出框的select事件
    async editActionSelect (item) {
      const gender = item.name === '男' ? '0' : '1'
      // 存取旧值
      const oldVar = this.userObject[this.editActionObject.editActionKey]
      this.userObject[this.editActionObject.editActionKey] = gender
      const { data } = await this.editUserObject()
      if (data.code !== 200) {
        this.$toast('修改失败')
        // 回退操作
        this.userObject[this.editActionObject.editActionKey] = oldVar
      } else {
        this.$toast('修改成功')
        // 关掉对话框
        this.editActionObject.isActionShow = false
      }
    }
  }
}
</script>

<style scoped lang="less">
  .user-edit {
    background-color: #f4f4f4;
    height: 100vh;
    .edit-content {
      margin: 0.1rem 0 0.15rem 0;
      background-color: white;
      >div {
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: black;
        span {
          margin-left: auto;
          color: #999;
        }
        .user-icon-wrapper {
          width: 0.46rem;
          height: 0.46rem;
          border-radius: 50%;
          overflow: hidden;
          margin-left: auto;
          img {
            width: 100%;
          }
        }
        padding: 0.1rem;
        border-bottom: 1px solid #eee;
        &:first-of-type {
          border-top: 1px solid #eee;
        }
      }
      .user-icon {
        position: relative;
      }
      .van-uploader-wrapper {
        position: absolute;
        overflow: hidden;
        opacity: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .edit-input {
        padding: 0.1rem;
      }
    }
    .log-out-btn {
      margin-top: 0.1rem;
      text-align: center;
      background-color: white;
      padding: 0.1rem;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }
    .back-btn {
      margin-bottom: 0.1rem;
      text-align: center;
      padding: 0.1rem;
      background-color: white;
      border-bottom: 1px solid #eee;
    }
  }
</style>
