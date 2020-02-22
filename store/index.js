export const state = () => ({
  isLoading: true,
  isSignin: false,
  uid: null
})

export const mutations = {
  setLoading(state) {
    state.isLoading = true
  },
  setLoaded(state) {
    state.isLoading = false
  },
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
