// 该方法用于配置rem布局相关.传入一个配置对象.
// 配置参数项:第一个参数为设置的rem与px比例,第二个参数为开发时基准设备宽度,后两参数是(字体大小随屏幕变换)的最大宽度(设计稿宽度?),最小宽度
export function remSet (remConfig) {
  const html = document.documentElement
  if (!remConfig) {
    remConfig = {}
  }
  let remPx = remConfig.remPx || 100
  let devDependenciesWidth = remConfig.devDependenciesWidth || 375
  let maxWidth = remConfig.maxWidth || 750
  let minWidth = remConfig.minWidth || 300
  // 该方法用来动态改变字体
  function setFontSize () {
    if (html.clientWidth > maxWidth) {
      html.style.fontSize = remPx * maxWidth / devDependenciesWidth + 'px'
    } else if (html.clientWidth < minWidth) {
      html.style.fontSize = remPx * minWidth / devDependenciesWidth + 'px'
    } else {
      html.style.fontSize = remPx * html.clientWidth / devDependenciesWidth + 'px'
    }
  }
  // 把setFontSize绑定给Dom解析完成事件,和浏览器视口大小变化事件
  window.addEventListener('DOMContentLoaded', setFontSize)
  window.addEventListener('resize', setFontSize)
}
