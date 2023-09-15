<template>
  <transition name="bounce">
      <div
        v-if="visible" 
        class="cn-wrapper" 
        id="cn-wrapper" 
        :class="{ 'opened-nav': visible }"
        :style="{ 'top': getPositionValue(top), 'left': getPositionValue(left) }"
      >
        <div class="cn-wrapper-list">
          <div 
            v-for="(menu,menuIndex) in menus"
            :key="menu.value"
            class="cn-wrapper-list-item"
            :style="getNodeRotateStyle(menus, menuIndex, 'div')"
          >
            <a class="list-item-alink" :style="getNodeRotateStyle(menus, menuIndex, 'alink')" @click="handleMenuClick(menu)">
              
              <span class="text-wrapper list-item-span" :style="getNodeRotateStyle(menus, menuIndex, 'span')">
                {{ menu.label }}
              </span>
            </a>
            <!-- <div
              v-if="menu.children"
              v-for="(submenu,submenuIndex) in menu.children"
              :key="submenu.value"
              :style="getSubListNodeStyle(menus, menuIndex, menu.children, submenuIndex, 'div')"
            >
              <a>
              
                <span class="text-wrapper">
                  {{ submenu.label }}
                </span>
              </a>
            </div> -->
          </div>
        </div>
      </div> 
    </transition>
</template>

<script>
// 自定义菜单组件
const defaultMenus = [
  { label: '移除', value: 'remove'},
  { label: '刷新', value: 'refresh' },
  { label: '分组设置', value: 'group',
    children: [{ label: '设置1', value: 'group-one' }, { label: '设置2', value: 'group-two' }] },
  { label: '新增', value: 'add' },
  { label: '修改', value: 'edit' },
  { label: '数据过滤', value: 'filter' },
  { label: '数据聚合', value: 'dataIn' },
  // { label: '数据1', value: 'dataIn' },
];

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    menus: {
      default: () => {
        return defaultMenus;
      },
      type: Array,
    },
    // 节点大小，默认宽高60
    nodeWidth: {
      default: 60,
      type: Number,
    },
    top: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
    // 每个菜单之间的间隔距离（单位：角度）
    spaceAngleDefault: {
      type: Number,
      default: 1,
    },
  },
  data(){
    return {
      selfContextWrapper: 432, // 菜单自身容器大小
      startAngle: -90, // 圆形菜单初始角度
    };
  },
  methods: {
    getAnglesByData(arr, index, startAngle){
      startAngle = startAngle || this.startAngle;
      const length = arr.length;
      const centerAngle = Math.floor(360/ length) - this.spaceAngleDefault; // 圆心角（向下取整）
      const slopeAngle = 90 - centerAngle; // 倾斜角度（skew）
      const spaceAngle = Number(((360 - (length * centerAngle)) / length).toFixed(3)); // 间隔角度
      const rotateAngle = startAngle + (index) * (centerAngle + spaceAngle); // 旋转角度
      return {
        slopeAngle,
        rotateAngle,
        centerAngle,
      }
    },
    // 设置节点旋转 
    getNodeRotateStyle(arr, index, type) {
      const angles = this.getAnglesByData(arr, index);
      const { rotateAngle, slopeAngle } = angles;
      const flag = (['alink', 'span'].includes(type) ? -1 : 1);
      let transformStr = `rotate(${flag * rotateAngle}deg) skew(${flag * slopeAngle}deg)`;
      if(type === 'alink') {
        const alinkRotateAngle = flag *  (90 - slopeAngle / 2 ); // a标签旋转角度
        transformStr = `skew(${flag * slopeAngle}deg) rotate(${alinkRotateAngle}deg) scale(1)`;
      }
      if(type === 'span') {
        // 设置文本的旋转角度，使文本保持水平
        const spanTextRotateAngle = (90 - slopeAngle / 2 ); // 文本标签旋转角度
        const rotate = -rotateAngle + spanTextRotateAngle;
        transformStr = `rotate(${rotate}deg)`;
      }
      return {
        transform: transformStr,
        '-webkit-transform': transformStr,
	      '-moz-transform': transformStr,
	      '-ms-transform': transformStr,
      };
    },
    // 获取菜单容器的定位值
    getPositionValue(value){
      return (value - this.selfContextWrapper / 2 + this.nodeWidth / 2) + 'px';
    },
    handleMenuClick(menu){
      this.$emit('handle-menu-click', menu)
    },
    getSubListNodeStyle(parentArr, parentIndex, arr, index, type){
      const parentData = this.getAnglesByData(parentArr, parentIndex);
      const transformOriginStr = `${this.left}px ${this.top}px`
      return {
        // width: '250px',
        // height: '250px',
        // '-webkit-transform-origin': transformOriginStr,
        // '-moz-transform-origin': transformOriginStr,
        // 'transform-origin': transformOriginStr,
      }
    }
  },
}
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 2s;
}
.bounce-leave-active {
  animation: bounce-in 2s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>