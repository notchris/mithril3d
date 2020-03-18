<template>
    <hsc-menu-style-white class="menu">
        <hsc-menu-bar style="border-radius: 0 0 4pt 0;">
            <hsc-menu-bar-item label="File">
                <hsc-menu-item label="New" @click="window.alert('New')" />
                <hsc-menu-item label="Open" @click="window.alert('Open')" />
                <hsc-menu-separator/>
                <hsc-menu-item label="Save" @click="window.alert('Save')" :disabled="true" />
                <hsc-menu-item label="Export to">
                    <hsc-menu-item label="PDF" />
                    <hsc-menu-item label="HTML" />
                </hsc-menu-item>
            </hsc-menu-bar-item>
            <hsc-menu-bar-item label="Edit">
                <hsc-menu-item label="Undo" keybind="meta+z" @click="window.alert('Undo')" />
                <hsc-menu-separator/>
                <hsc-menu-item label="Cut" keybind="meta+x" @click="window.alert('Cut')" />
                <hsc-menu-item label="Copy" keybind="meta+c" @click="window.alert('Copy')" />
                <hsc-menu-item label="Paste" keybind="meta+v" @click="window.alert('Paste')" :disabled="true" />
            </hsc-menu-bar-item>
            <hsc-menu-bar-item label="Create">
                <hsc-menu-item label="Object">
                    <hsc-menu-item @click="createObject('box')" label="Box" />
                    <hsc-menu-item @click="createObject('circle')" label="Circle" />
                    <hsc-menu-item @click="createObject('cone')" label="Cone" />
                    <hsc-menu-item @click="createObject('cylinder')" label="Cylinder" />
                    <hsc-menu-item @click="createObject('dodecahedron')" label="Dodecahedron" />
                    <hsc-menu-item @click="createObject('icosahedron')" label="Icosahedron" />
                    <hsc-menu-item @click="createObject('octahedron')" label="Octahedron" />
                    <hsc-menu-item @click="createObject('plane')" label="Plane" />
                    <hsc-menu-item @click="createObject('sphere')" label="Sphere" />
                </hsc-menu-item>
                <hsc-menu-item label="Other"/>
            </hsc-menu-bar-item>
        </hsc-menu-bar>
    </hsc-menu-style-white>
</template>

<script>
export default {
  name: 'Menu',
  methods: {
    createObject(type) {
      this.$emit('createObject', type);
    }
  }
}
</script>
<style scoped>
  .menu {
      width: 100%;
      background-color: #333;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9999;
  }
  .menubar {
    font-size: 13px;
    box-shadow: none !important;
    border-radius: 0 !important;
    background-color: #333 !important;
  }
  .menubaritem {
    color: #FFF;
  }
</style>