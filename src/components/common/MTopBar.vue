<template>
    <div class='m-top-bar' :style="{'height':height}">
      <div :style="{'width':leftWidth}">
        <slot name="left"></slot>
      </div>
      <div class="center">
        <slot name="center"></slot>
      </div>
      <div :style="{'width':rightWidth}">
        <slot name="right"></slot>
      </div>
    </div>
</template>

<script>
export default {
  name: 'MTopBar',
  props: {
    height: {
      type: String,
      default: 'auto'
    },
    leftWidth: {
      type: String,
      default: '20%'
    },
    rightWidth: {
      type: String,
      default: '20%'
    }
  },
  data () {
    return {
    }
  }

}
</script>

<style scoped lang="less">
  .m-top-bar {
    display: flex;
    .center {
      flex-grow:1;
    }
  }
</style>
