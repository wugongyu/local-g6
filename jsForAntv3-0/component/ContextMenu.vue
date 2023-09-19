<template>
  <div
    v-if="visible" 
    class="cn-wrapper" 
    id="cn-wrapper" 
    :class="{ 'opened-nav': visible }"
    :style="getMainWrapperStyle()"
  >
    <div class="cn-wrapper-list">
      <div 
        v-for="(menu,menuIndex) in menus"
        :key="menu.value"
        class="cn-wrapper-list-item"
        :style="getNodeRotateStyle(menus, menuIndex, 'listItemWrapper')"
      >
        <div 
          class="list-item-alink" 
          :style="getNodeRotateStyle(menus, menuIndex, 'alink')" 
          @click="handleMenuClick(menu)"
          @mouseenter="handleMouseEnter(menu)"
          @mouseleave="handleMouseLeave(menu)"
        >
          
          <span class="text-wrapper list-item-span" :style="getNodeRotateStyle(menus, menuIndex, 'span')">
            {{ menu.label }}
          </span>
          <!-- <div 
            v-if="menu.children" 
            class="sub-list-wrapper"
            :style="getSubListNodeStyle(menus, menuIndex, menu.children, '', 'wrapper')"
          >
            <div
              class="sub-list"
              v-for="(submenu,submenuIndex) in menu.children"
              :key="submenu.value"
              :style="getSubListNodeStyle(menus, menuIndex, menu.children, submenuIndex, 'list')"
            >
              <a>
              
                <span class="sub-text-wrapper">
                  {{ submenu.label }}
                </span>
              </a>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
// 自定义菜单组件
const defaultMenus = [
  { label: '移除', value: 'remove'},
  { label: '刷新', value: 'refresh' },
  { label: '分组设置', value: 'group',
    children: [{ label: '设置1', value: 'group-one' }, { label: '设置2', value: 'group-two' }] },
  { label: '新增', value: 'add' },
  { label: '修改', value: 'edit',
  children: [{ label: '修改1', value: 'edit-one' }, { label: '修改2', value: 'edit-two' }] },
  { label: '数据过滤', value: 'filter' },
  { label: '数据聚合', value: 'dataIn' },
  { label: '数据1', value: 'dataOther' },
];

const defaultMenuSize = 432;
const defaultWrapperListItemSize = 180;
const defaultListItemAlinkSize = 280;
// const defaultWrapperListItemSize = 200;
// const defaultListItemAlinkSize = 310;

const defaultBgColor = '#c9e9fc';
const defaultBgActiveColor = '#0499d7';

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
    // 菜单容器大小（正方形）
    menuWrapperSize: {
      default: defaultMenuSize,
      type: Number,
    },
    // 菜单项容器大小
    wrapperListItemSize: {
      default: defaultWrapperListItemSize,
      type: Number,
    },
    // 菜单点击区域容器大小
    listItemAlinkSize: {
      default: defaultListItemAlinkSize,
      type: Number,
    },
    bgColor: {
      default: defaultBgColor,
      type: String,
    },
    bgActiveColor: {
      default: defaultBgActiveColor,
      type: String,
    },
  },
  data(){
    return {
      startAngle: -90, // 圆形菜单初始角度
      currentActiveMenu: null,
      gradientPercent: 30,
    };
  },
  mounted(){
  },
  computed: {
    mainItemAfterWrapperSize(){
      return this.listItemAlinkSize * this.gradientPercent * 0.01;
    }
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
      let alinkRotateAngle = 0;
      if(type === 'alink') {
        alinkRotateAngle = flag *  (90 - slopeAngle / 2 ); // a标签旋转角度
        transformStr = `skew(${flag * slopeAngle}deg) rotate(${alinkRotateAngle}deg) scale(1)`;
      }
      if(type === 'span') {
        // 设置文本的旋转角度，使文本保持水平
        const spanTextRotateAngle = (90 - slopeAngle / 2 ); // 文本标签旋转角度
        const rotate = -rotateAngle + spanTextRotateAngle;
        transformStr = `rotate(${rotate}deg)`;
      }
      const commonObj = {
        transform: transformStr,
        '-webkit-transform': transformStr,
	      '-moz-transform': transformStr,
	      '-ms-transform': transformStr,
      };
      if(['alink', 'listItemWrapper'].includes(type)){
        const sizeObj = this.getWidthAndHeight(type === 'alink' ? this.listItemAlinkSize : this.wrapperListItemSize);
        const targetAlinkBgStyle = type === 'alink' ? this.getBackground(arr[index]) : {};
        const targetWrapperPositionStyle = type === 'listItemWrapper' ? this.getWrapperPositionValue() : {};
        return {
          ...targetWrapperPositionStyle,
          ...sizeObj,
          ...commonObj,
          ...targetAlinkBgStyle,
        }
      }
      return commonObj;
    },
    handleMenuClick(menu){
      this.$emit('handle-menu-click', menu)
    },
    handleMouseEnter(menu){
      this.currentActiveMenu = menu;
    },
    handleMouseLeave(){
      this.currentActiveMenu = null;
    },
    /**---------get style-----------*/ 
    // 获取菜单容器的定位值
    getPositionValue(value){
      const containerRadius = this.menuWrapperSize / 2;
      // return (value - containerRadius + this.nodeWidth / 2);
      // return value - containerRadius;
      return (value - containerRadius + this.nodeWidth / 3);
    },
    getSubListNodeStyle(parentArr, parentIndex, arr, index, type){
      const parentData = this.getAnglesByData(parentArr, parentIndex);
      if(type === 'wrapper'){
      }
      return {
      }
    },
    getWidthAndHeight(value){
      return {
        width: value + 'px',
        height: value + 'px',
      }
    },
    getMainWrapperStyle(){
      const mainWrapperStyle = { 
        'top': this.getPositionValue(this.top) + 'px',
        'left': this.getPositionValue(this.left) + 'px',
        '--wrapperAfterSize': this.mainItemAfterWrapperSize + 'px',
        '--wrapperAfterSizMargin': -this.mainItemAfterWrapperSize / 2 + 'px',
        ...this.getWidthAndHeight(this.menuWrapperSize),
      };
      return mainWrapperStyle;
    },
    getBackground(menuItem){
      const targetColor = (menuItem) && (this.currentActiveMenu) && (menuItem.value === this.currentActiveMenu.value) ? this.bgActiveColor : this.bgColor;
      const gradientPercent = this.gradientPercent + '%';
      const backgroundStr = `transparent ${gradientPercent}, ${targetColor} ${gradientPercent}`;
      return {
        background: this.bgColor,
        background: `-webkit-radial-gradient(${backgroundStr})`,
        background: `-moz-radial-gradient(${backgroundStr})`,
        background: `radial-gradient(${backgroundStr})`,
      }
    },
    getWrapperPositionValue(){
      const containerRadius = this.menuWrapperSize / 2;
      const positionTopAndLeft = containerRadius - this.wrapperListItemSize;
      return {
        'top': positionTopAndLeft + 'px',
	      'left': positionTopAndLeft + 'px',
      }
    }
  },
}
</script>

<style scoped>
</style>