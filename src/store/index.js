import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    img_list: []
  },
  mutations: {
    'ADD_IMG'(state, options){
      const f = state.img_list.length === 0
      state.img_list.push({
        url: options.img_data,
        is_cover: f
      })
    },
    'REMOVE_IMG'(state, options){
      state.img_list.splice(options.idx, 1)
    },
  },
  actions: {
    addImg({commit}, options){
      commit('ADD_IMG', options)
    },
    removeImg({commit}, options){
      commit('REMOVE_IMG', options)
    },
  },
  modules: {},
  getters: {
    img_list: state => state.img_list
  }
})
