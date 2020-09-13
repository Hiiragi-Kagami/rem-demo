<template>
  <div class="register">
    <MTopTitle title="注册bilibili" margin="0 0 0.1rem 0" padding="0.1rem 0"></MTopTitle>
    <div class="login-change" @click="$router.push('/login')">登录界面</div>
    <van-form ref="registerForm">
      <!-- 姓名正则，中文名字判断(2-4个字) -->
      <van-field class='register-input' v-model="registerForm.name" label="姓名" placeholder="请输入姓名" :rules="[{ required: true, message: '请填写姓名' },{ pattern:/^[\u4E00-\u9FA5]{2,4}$/, message: '请输入正确姓名' }]"/>
      <!-- 用户名正则，4到16位（字母，数字，下划线，减号 -->
      <van-field class='register-input' v-model="registerForm.username" label="用户名" placeholder="请输入用户名" :rules="[{ required: true, message: '请填写用户名' },{ pattern:/^[a-zA-Z0-9_-]{4,16}$/, message: '请输入正确用户名' }]"/>
      <!--密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符 -->
      <van-field class='register-input' v-model="registerForm.password" label="密码" placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' },{ pattern:/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/, message: '请输入正确密码' }]"/>
    </van-form>
    <van-button class='register-button' type="info" block @click="register">注册</van-button>
  </div>
</template>

<script>
import MTopTitle from 'components/common/MTopTitle.vue'
export default {
  name: 'register',
  components: {
    MTopTitle
  },
  data () {
    return {
      registerForm: {
        name: '',
        username: '',
        password: ''
      }
    }
  },
  methods: {
    register () {
      this.$refs.registerForm.validate().then(async () => {
        const { data } = await this.$http({ method: 'post', url: '/register', data: this.registerForm })
        if (data.code !== 200) {
          this.$toast(data.msg)
        } else {
          this.$toast(data.msg)
          this.$router.push({
            path: '/login',
            query: {
              username: this.registerForm.username
            }
          })
        }
      }).catch(() => {
        this.$toast('注册失败,前端格式校验不通过')
      })
    }
  }
}
</script>

<style scoped lang="less">
  .register {
    height: 100vh;
    background-color: #f4f4f4;
    .register-input {
      margin: 0.1rem 0;
    }
    .register-button {
      width: 90%;
      margin: 0 auto;
      border-radius: 10px;
    }
    .login-change {
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
