function addAnchorConfig(cfg, group, width, height, offsetX, offsetY){
  // anchor锚点节点（向内关联锚点）
  if (cfg.inPoints) {
    for (let i = 0; i < cfg.inPoints.length; i++) {
      let x,
      y = 0;
      //0为顶 1为底
      if (cfg.inPoints[i][0] === 0) {
        y = 0;
      } else {
        y = height;
      }
      x = width * cfg.inPoints[i][1];
      const id = 'circle' + getUuid()
      group.addShape("circle", {
        attrs: {
          id: 'circle' + getUuid(),
          parent: id,
          x: x + offsetX,
          y: y + offsetY,
          r: 10,
          isInPointOut: true,
          fill: "#1890ff",
          opacity: 0
        },
        zIndex: 3,
      });
      group.addShape("circle", {
        attrs: {
          id: id,
          x: x + offsetX,
          y: y + offsetY,
          r: 3,
          isInPoint: true,
          fill: "#fff",
          stroke: "#1890ff",
          opacity: 0,
        },
        zIndex: 3,
      });
    }
  }
  // anchor锚点节点（向外关联锚点）
  if (cfg.outPoints) {
    for (let i = 0; i < cfg.outPoints.length; i++) {
      let x,
        y = 0;
      //0为顶 1为底
      if (cfg.outPoints[i][0] === 0) {
        y = 0;
      } else {
        y = height;
      }
      x = width * cfg.outPoints[i][1];
      const id = 'circle' + getUuid()
      group.addShape("circle", {
        attrs: {
          id: 'circle' + getUuid(),
          parent: id,
          x: x + offsetX,
          y: y + offsetY,
          r: 10,
          isOutPointOut: true,
          fill: "#1890ff",
          opacity: 0//默認0 需要時改成0.3
        },
        zIndex: 3,
      });
      group.addShape("circle", {
        attrs: {
          id: id,
          x: x + offsetX,
          y: y + offsetY,
          r: 3,
          isOutPoint: true,
          fill: "#fff",
          stroke: "#1890ff",
          opacity: 0
        },
        zIndex: 3,
      });
    }
  }
}

function setStateFun(name, value, item) {
  const group = item.getContainer();
  const shape = group.get("children")[0]; // 顺序根据 draw 时确定
  const children = group.cfg.children;
  // const children = group.findAll(g => {
  //   return g.attrs.id === shape.attrs.id
  // });
  const circles = group.findAll(circle => {
    return circle.attrs.isInPoint || circle.attrs.isOutPoint;
  });
  const selectStyles = () => {
    shape.attr("fill", "#f3f9ff");
    shape.attr("stroke", "#6ab7ff");
    shape.attr("cursor", "move");
    children.forEach(child => {
      child.attr("cursor", "move");
    });
    circles.forEach(circle => {
      circle.attr('opacity', 1)
    })
  };
  const unSelectStyles = () => {
    shape.attr("fill", "#fff");
    shape.attr("stroke", "#ced4d9");
    circles.forEach(circle => {
      circle.attr('opacity', 0)
    })
  };
  switch (name) {
    case "selected":
    case "hover":
      if (value) {
        selectStyles()
      } else {
        unSelectStyles()
      }
      break;
  }
}


const customNode = {
  init() {
    console.log('customNode init')
    G6.registerNode("customNode", {
      draw(cfg, group) {
        let size = cfg.size;
        if(!size){
          size=[170,34]
        }
        // 此处必须是NUMBER 不然bbox不正常
        const width = parseInt(size[0]);
        const height = parseInt(size[1]);
        const color = cfg.color;
        // 此处必须有偏移 不然drag-node错位
        const offsetX = -width / 2
        const offsetY = -height / 2
        const mainId = 'rect' + getUuid()
        // 主方形节点
        const shape = group.addShape("rect", {
          attrs: {
            id: mainId,
            x: offsetX,
            y: offsetY,
            width: width,
            height: height,
            stroke: "#ced4d9",
            fill: '#fff',//此处必须有fill 不然不能触发事件
            radius: 4
          }
        });
        // 子方形节点
        group.addShape("rect", {
          attrs: {
            x: offsetX,
            y: offsetY,
            width: 4,
            height: height,
            fill: color,
            parent: mainId,
            radius: [4, 0, 0, 4]
          }
        });
        // 子图片节点
        group.addShape("image", {
          attrs: {
            x: offsetX + 16,
            y: offsetY + 8,
            width: 20,
            height: 16,
            img: cfg.image,
            parent: mainId
          }
        });
        // 子状态图片节点
        group.addShape("image", {
          attrs: {
            x: offsetX + width - 32,
            y: offsetY + 8,
            width: 16,
            height: 16,
            parent: mainId,
            img: cfg.stateImage
          }
        });
        // 子背景图片节点
        if(cfg.backImage){
          // 图片节点，需调用setClip实现裁剪
          const shape = group.addShape('image', {
            draggable: true,
            attrs: {
              x: offsetX,
              y: offsetY,
              width: width,
              height: height,
              img: cfg.backImage,
            },
            zIndex: 2,
          });
          // 裁剪图片，支持 circle、rect、ellipse、Polygon 及自定义 path clip
          shape.setClip({
            type: 'circle', 
            attrs: {
              x: offsetX,
              y: offsetY,
              width: width,
              height: height,
              fill:'#fff',
              radius: 4
            },
          })
        }
        // 子文本节点
        if (cfg.label) {
          group.addShape("text", {
            attrs: {
              id: 'label' + getUuid(),
              x: offsetX + width / 2,
              y: offsetY + height / 2,
              textAlign: "center",
              textBaseline: "middle",
              text: cfg.label,
              parent: mainId,
              fill: "#565758"
            }
          });
        }
        // anchor锚点节点
        addAnchorConfig(cfg,group, width, height, offsetX, offsetY);
        //group.sort()
        // 添加文本、更多图形
        return shape;
      },
      //设置状态
      setState: setStateFun,
    });
  }
}

// 自定义节点
const customCircleAvatarNode = {
  init: function(){
    console.log('customCircleAvatar init', G6)
    G6.registerNode(
      'customCircleAvatar', 
      {
        draw: (cfg, group) => {
          const nodeSize = cfg.size || [80, 80]; // 默认节点尺寸为[80, 80];
          const fontHeight = cfg.fontHeight || 16; // 默认文本节点行高
          const width = parseInt(nodeSize[0]);
          const height = parseInt(nodeSize[1]);
          // 此处必须有偏移 不然drag-node错位
          const offsetX = -width / 2; // 节点偏移量，-节点尺寸/2
          const offsetY = -height / 2;
          // let nodeRadius = [width / 2, height / 2];
          let nodeRadius = width / 2;
          const mainId = cfg.id ? cfg.id : ('rect' + getUuid())
          // 带描边的圆形节点
          group.addShape('circle', {
            draggable: true,
            attrs: {
              id: mainId,
              r: nodeRadius,
              stroke: "#ced4d9",
              //fill: '#fff',//此处必须有fill 不然不能触发事件
              lineWidth: 1 // 描边宽度
            },
          });
          // 图片节点，需调用setClip实现裁剪
          const shape = group.addShape('image', {
            draggable: true,
            attrs: {
              id: 'img' + getUuid(),
              x: offsetX,
              y: offsetY,
              // x: 0,
              // y: 0,
              width: width,
              height: height,
              img: cfg.backImage,
              parent: mainId,
            },
            zIndex: 2,
          });
          // 裁剪图片，支持 circle、rect、ellipse、Polygon 及自定义 path clip
          shape.setClip({
            type: 'circle', 
            attrs: {
              r: width / 2 -1, // 不支持数组
              x: 0,
              y: 0,
            },
          })
          // 文字节点（文字居中：x-0，textAlign-center；显示在节点下方：y-节点高度）
          if (cfg.label) {
            group.addShape('text', {
              attrs: {
                id: 'label' + getUuid(),
                x: offsetX + width / 2 + 4,
                y: height / 2 + 10,
                // width: width,
                // height: fontHeight,
                // lineHeight: fontHeight,
                textAlign: "center",
                textBaseline: "middle",
                fontSize: 14,
                text: cfg.label,
                parent: mainId,
                fill: "#565758", // 文本填充颜色
                //stroke: 'red', // 描边颜色
              },
              zIndex: 1, // 排到最底层
            });
          }
          // 添加anchor锚点节点
          addAnchorConfig(cfg,group, width, height, offsetX, offsetY);
          group.sort(); // 为了让图层按zIndex堆叠，还需排序
          return shape;
        },
        //设置anchor状态
        setState: setStateFun,
      },
    );
  }
}
