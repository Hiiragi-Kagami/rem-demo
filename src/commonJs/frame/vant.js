import { Form, Field, Cell, CellGroup, Button, Toast, Tag, Uploader, Dialog, ActionSheet, Tabs, Tab, List } from 'vant'
const vant = {
  install: function (Vue) {
    Vue.use(Form)
    Vue.use(Field)
    Vue.use(Cell)
    Vue.use(CellGroup)
    Vue.use(Button)
    // 自动在全局挂载在$toast上
    Vue.use(Toast)
    Vue.use(Tag)
    Vue.use(Uploader)
    // 会自动在 Vue 的 prototype 上挂载 $dialog 方法
    Vue.use(Dialog)
    Vue.use(ActionSheet)
    Vue.use(Tabs)
    Vue.use(Tab)
    Vue.use(List)
  }
}
export { vant }
