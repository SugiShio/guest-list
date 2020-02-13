import { firestore } from '~/plugins/firebase.js'
export const state = () => ({
  isLoaded: false,
  isSignin: false,
  uid: null
})

export const mutations = {
  setUser(state, { uid }) {
    state.isSignin = true
    state.uid = uid
  },
  resetUser(state) {
    state.isSignin = false
    state.uid = null
  }
}

export const actions = {
  updateUser: ({ commit }, { uid }) => {
    commit('setUser', { uid })
  },

  signout: ({ commit }) => {
    commit('resetUser')
  }
}
