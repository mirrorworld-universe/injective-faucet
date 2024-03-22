import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { message } from 'ant-design-vue';

export default createStore({
  state: {
    walletType: '',
    walletAddress: '',
    walletNetwork: true,
    showWalletModal: false
  },
  getters: {},
  mutations: {
    setWalletType(state, data) {
      state.walletType = data;
    },
    setWalletAddress(state, data) {
      state.walletAddress = data;
    },
    setWalletNetwork(state, data) {
      state.walletNetwork = data;
    },
    setShowWalletModal(state, data) {
      state.showWalletModal = data;
    }
  },
  actions: {},
  plugins: [
    createPersistedState({
      key: window.location.host,
      storage: window.localStorage,
      reducer(val: any) {
        return {
          walletType: val.walletType
        };
      }
    })
  ]
});
