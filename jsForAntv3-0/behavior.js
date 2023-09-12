const behaviors = {
  'hover-node': hoverNodeConfig,
  'add-edge': addEdgeConfig,
  'hover-edge': hoverEdgeConfig,
  'select-node': selectNodeConfig,
  'keyboard': keyboardConfig,
}

function initBehaviors() {
  for (let key in behaviors) {
    G6.registerBehavior(key, behaviors[key])
  }
}