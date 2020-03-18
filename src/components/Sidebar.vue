<template>
    <div class="sidebar">
      <ObjectProps/>
    </div>
</template>

<script>
import ObjectProps from './ObjectProps';
export default {
  name: 'Sidebar',
  components: {
    ObjectProps
  }
}
</script>
<style scoped>
  .sidebar {
      width: 100%;
      height: 100%;
      background-color: #555 !important;
      color: #FFF;
  }
</style>