import UsersApi from '@/services/api/user.service'
import stateMerge from 'vue-object-merge'

const getDefaults = () => {
  return {
    isDark: false,
    isMute: false,
    dates: {
      longDate: 'ddd D MMM, YYYY HH:mm:ss.SSS Z',
      mediumDate: 'ddd D MMM HH:mm',
      shortTime: 'LT'
    },
    refreshInterval: 5*1000,
    shelveTimeout: 2*60*60
  }
}

const state = getDefaults()

const mutations = {
  SET_PREFS(state, prefs) {
    stateMerge(state, prefs)
  },
  RESET_PREFS(state) {
    Object.assign(state, getDefaults())
  }
}

const actions = {
  getUserPrefs({ dispatch, commit }) {
    return UsersApi.getMeAttributes()
      .then(({ attributes }) => commit('SET_PREFS', attributes.prefs))
      .catch((error) => dispatch('notifications/error', Error('Could not retrieve user preferences.'), { root: true }))
  },
  toggle({ dispatch, commit }, [s, v]) {
    return UsersApi.updateMeAttributes({ prefs: { [s]: v } })
      .then(response => dispatch('getUserPrefs'))
      .then(() => dispatch('notifications/success', 'Settings saved.', { root: true }))
  },
  setUserPrefs({ dispatch, commit }, prefs) {
    return UsersApi.updateMeAttributes({ prefs: prefs })
      .then(response => dispatch('getUserPrefs'))
      .then(() => dispatch('notifications/success', 'Settings saved.', { root: true }))
  },
  resetUserPrefs({ dispatch, commit }) {
    return UsersApi.updateMeAttributes({ prefs: null })
      .then(response => commit('RESET_PREFS'))
      .then(() => dispatch('notifications/success', 'Settings reset to defaults.', { root: true }))
  }

}

const getters = {
  getPreference: state => pref => {
    return state[pref]
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
