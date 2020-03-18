<template>
  <hsc-window title="Tools">
    <div class="tools">
      <div class="group"><button @click="setTool('select')" :class="[tool === 'select' ? 'active': '']" type="button"><i class="mdi mdi-cursor-default-outline"></i></button></div>
      <div @mouseleave="showTransforms = false;" @mouseenter="showTransforms = true" class="group">
        <button type="button" :class="[tool === 'translate' || tool === 'scale' || tool === 'rotate' ? 'active': '']"><i class="mdi mdi-cube-scan"></i></button>
        <div class="sub" v-if="showTransforms">
          <button @click="setTool('translate')" :class="[tool === 'translate' ? 'active': '']" type="button"><i class="mdi mdi-cursor-move"></i></button>
          <button @click="setTool('scale')" :class="[tool === 'scale' ? 'active': '']" type="button"><i class="mdi mdi-resize"></i></button>
          <button @click="setTool('rotate')" :class="[tool === 'rotate' ? 'active': '']" type="button"><i class="mdi mdi-rotate-3d-variant"></i></button>
        </div>
      </div>
    </div>
  </hsc-window>
</template>

<script>
export default {
  name: 'Tools',
  data () {
    return {
      showTransforms: false
    }
  },
  computed: {
    tool () {
      return this.$store.state.tool;
    }
  },
  methods: {
    setTool (tool) {
      this.$store.commit('setTool', tool);
    }
  }
}
</script>
<style scoped>
  .tools {
    width: 100%;
    height: 100%;
  }
  .tools .group button {
    font-size: 16px;
    width: 32px;
    height: 30px;
    border-left: 1px solid #666;
    border-right: 1px solid #666;
    border-top: none;
    border-bottom: 1px solid #666;
    background: #333;
    color: #CCC;
    cursor: pointer;
  }
  .tools .group:first-child button {
    border-top: 1px solid #666;
  }
  .tools .group button.active {
    background: hotpink;
  }

  .group {
    width: 100%;
    height: auto;
    position: relative;
  }
  .sub {
    position: absolute;
    top: -1px;
    left: 31px;
    width: auto;
    height: auto;
    background: #666;
  }
  .sub button {
    font-size: 16px;
    width: 32px;
    height: 31px !important;
    border-left: 1px solid #666;
    border-right: 1px solid #666;
    border-top: none;
    border-bottom: 1px solid #666;
    background: #333;
    color: #CCC;
    cursor: pointer;
  }
  .sub button:first-child {
    border-top: 1px solid #666;
  }
</style>