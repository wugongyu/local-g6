import hoverEdgeConfig from './hover-edge';
import hoverNodeConfig from './hover-node';
import addEdgeConfig from './add-edge';
import selectNodeConfig from './select-node';
import keyboardConfig from './keyboard';

// 注意，如果使用webpack打包，并采用 export { behaviors };方式导出，
// webpack打包后的js文件中的方法和变量（如behaviors）都变成了局部的，外部无法直接访问，
// 若想访问，将其添加到window上
window.behaviors = {
  'hover-node': hoverNodeConfig,
  'add-edge': addEdgeConfig,
  'hover-edge': hoverEdgeConfig,
  'select-node': selectNodeConfig,
  'keyboard': keyboardConfig,
}