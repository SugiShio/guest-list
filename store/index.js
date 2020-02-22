export const state = () => ({
  error: null,
  isSignin: false,
  uid: null
})

export const mutations = {
  setError(state, { error }) {
    state.error = error
  },
  setUser(state, { uid }) {
    state.isSignin = true
    state.uid = uid
  },
  resetError(state) {
    state.error = null
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
