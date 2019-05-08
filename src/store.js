import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tableName: []
  },
  mutations: {
    setTableName (state, data) {
      state.tableName = data
    }
  },
  actions: {
    GET_TABLE_NAME ({ commit }) {
      return new Promise(resolve => {
        const query = Vue.prototype.$Bmob.Query('table_name')
        query.find().then(res => {
          commit('setTableName', res)
          resolve()
        })
      })
    }
  }
})
