// import { contextMenuComponentConfig } from "./contextMenu";
import ContextMenu from './ContextMenu.vue';
import MyComponent from './MyComponent.vue';
// 自定义组件的配置，组件名: 组件的配置数据
const customComponents = {
  // 'context-menu': contextMenuComponentConfig,
  'context-menu': ContextMenu,
  'my-component': MyComponent,
}


export { MyComponent, ContextMenu };
 
window.customComponentsPlugin = {
  install(app) {
    for (let key in customComponents) {
      app.component(key, customComponents[key])
    }
  }
};