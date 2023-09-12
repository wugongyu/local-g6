const behaviors = {
  'hover-node': hoverNodeConfig,
  'add-edge': addEdgeConfig,
}

function initBehaviors() {
  for (let key in behaviors) {
    G6.registerBehavior(key, behaviors[key])
  }
}