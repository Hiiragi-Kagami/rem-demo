<template>
  <div class="login">
    <MTopTitle title="登录bilibili" margin="0 0 0.1rem 0" padding="0.1rem 0"></MTopTitle>
    <div class="register-change" @click="$router.push('/register')">注册界面</div>
    <van-form ref="loginForm">
      <!-- 用户名正则，4到16位（字母，数字，下划线，减号 -->
      <van-field class='login-input' v-model="loginForm.username" label="用户名" placeholder="请输入用户名" :rules="[{ required: true, message: '请填写用户名' },{ pattern:/^[a-zA-Z0-9_-]{4,16}$/, message: '请输入正确用户名' }]"/>
      <!--密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符 -->
      <van-field class='login-input' v-model="loginForm.password" label="密码" placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' },{ pattern:/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/, message: '请输入正确密码' }]"/>
    </van-form>
    <van-button class='login-button' type="info" block @click="login">登录</van-button>
  </div>
</template>

<script>
import MTopTitle from 'components/common/MTopTitle.vue'
export default {
  name: 'Login',
  components: {
    MTopTitle
  },
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  created () {
    this.loginForm.username = this.$route.query.username ? this.$route.query.username : ''
  },
  methods: {
    login () {
      this.$refs.loginForm.validate().then(async () => {
        const { data } = await this.$http({ method: 'post', url: '/login', data: this.loginForm })
        if (data.code !== 200) {
          this.$toast(data.msg)
        } else {
          this.$toast(data.msg)
          window.sessionStorage.setItem('token', 'Bearer ' + data.token)
          window.sessionStorage.setItem('userId', data.id)
          this.$router.push('/user')
        }
      }).catch(() => {
        this.$toast('登录失败,前端格式校验不通过')
      })
    }
  }
}
</script>

<style scoped lang="less">
  .login {
    height: 100vh;
    background-color: #f4f4f4;
    .login-input {
      margin: 0.1rem 0;
    }
    .login-button {
      width: 90%;
      margin: 0 auto;
      border-radius: 10px;
    }
    .register-change {
      font-size: 0.1rem;
      position: absolute;
      right: 0.2rem;
      top: 0.12rem;
      &:active {
        color: dodgerblue;
      }
    }
  }
</style>
