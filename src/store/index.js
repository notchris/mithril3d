import Vue from 'vue';
import Vuex from 'vuex';
import * as THREE from 'three';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tool: 'select',
    scene: new THREE.Scene()
  },
  mutations: {
    setTool (state, tool) {
      state.tool = tool;
    }
  },
  actions: {
  },
  modules: {
  }
});
