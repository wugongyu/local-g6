import { contextMenuComponentConfig } from "./contextMenu";
import MyComponent from './MyComponent.vue';
// 自定义组件的配置，组件名: 组件的配置数据
const customComponents = {
  'context-menu': contextMenuComponentConfig,
  'my-component': MyComponent,
}


export { MyComponent };
 
window.customComponentsPlugin = {
  install(app) {
    for (let key in customComponents) {
      app.component(key, customComponents[key])
    }
  }
};