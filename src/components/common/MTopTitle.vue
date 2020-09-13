<template>
    <div class="m-top-title" :style="{'backgroundColor': backgroundColor,'margin': margin,'padding':padding}">
      {{title}}
    </div>
</template>

<script>
export default {
  name: 'MTopTitle',
  props: {
    title: {
      type: String,
      default: '赋值title属性填写标题'
    },
    backgroundColor: {
      type: String,
      default: 'white'
    },
    margin: {
      type: String,
      default: '0'
    },
    padding: {
      type: String,
      default: '0'
    }
  }
}
</script>

<style scoped lang="less">
  .m-top-title {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
