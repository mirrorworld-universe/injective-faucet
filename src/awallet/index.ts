import tp from 'tp-js-sdk';
import store from '@/stores';
import utilsX from '@/utils';
import { ethers, utils } from 'ethers';
import { network } from '@/awallet/network';
import { message } from 'ant-design-vue';

export const util = utils;

export const rpcProvider = new ethers.providers.JsonRpcProvider(network().rpcUrls[0]);

// okxwallet metamask tokenpocket

/**OKX MetaMask */
const okxMetaMaskConnect = async (walletType: string, wallet: any) => {
  try {
    const accounts = await wallet.request({ method: 'eth_requestAccounts' });
    store.commit('setWalletAddress', util.getAddress(accounts[0]));
    store.commit('setWalletType', walletType);
    message.success('Connected');

    await wallet.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: network().chainId }] });

    wallet.removeAllListeners('accountsChanged');
    wallet.removeAllListeners('chainChanged');

    wallet.on('accountsChanged', (accounts: any) => {
      store.commit('setWalletAddress', util.getAddress(accounts[0]));
      message.success('Connected');
    });

    wallet.on('chainChanged', async (chainId: any) => {
      store.commit('setWalletNetwork', chainId == network().chainId);
    });
  } catch (error) {
    console.error('connect failed', error);
  }
};

/**TokenPocket */
const tpConnect = async (walletType: string) => {
  try {
    tp.isConnected();
    const result = await tp.getWallet({ walletTypes: ['arb'], switch: true });
    if (result.result) {
      if (result.data.blockchain == 'arb') {
        store.commit('setWalletType', walletType);
        store.commit('setWalletAddress', util.getAddress(result.data.address));
        store.commit('setWalletNetwork', true);
        message.success('Connected');
      }
    }
  } catch (error) {
    console.error('connect failed', error);
  }
};

/**choose wallet */
export const chooseWallet = (walletType: string) => {
  store.commit('setShowWalletModal', false);
  // mobile
  if (utilsX.isMobile()) {
    if (walletType == 'okxwallet') {
      const ua = navigator.userAgent;
      const isOKApp = /OKApp/i.test(ua);
      if (isOKApp) {
        okxMetaMaskConnect(walletType, (window as any).okxwallet);
      } else {
        message.warning('Please open your DApp in OKX');
        // setTimeout(() => {
        //   window.location.href = `okx://wallet/dapp/details?dappUrl=${window.location.origin}`;
        // }, 1000);
      }
    } else if (walletType == 'tokenpocket') {
      const ua = navigator.userAgent;
      const inApp = /TokenPocket/i.test(ua);
      if (inApp) {
        tpConnect(walletType);
      } else {
        message.warning('Please open your DApp in TokenPocket');
        // setTimeout(() => {
        //   window.location.href = `tpdapp://open?params={"url": "${window.location.origin}", "chain": "arb", "source":""}`;
        // }, 1000);
      }
    }
  } else {
    // PC
    if (walletType == 'okxwallet') {
      if (typeof (window as any).okxwallet !== 'undefined') {
        okxMetaMaskConnect(walletType, (window as any).okxwallet);
      } else {
        message.warning('Please Install OKX Wallet');
      }
    } else if (walletType == 'metamask') {
      if (typeof (window as any).ethereum !== 'undefined') {
        okxMetaMaskConnect(walletType, (window as any).ethereum);
      } else {
        message.warning('Please install MetaMask Wallet');
      }
    }
  }
};

/**Get Current Wallet */
export const getCurrentWallet = async () => {
  const walletType = store.state.walletType;
  if (walletType == 'okxwallet') {
    okxMetaMaskConnect(walletType, (window as any).okxwallet);
  } else if (walletType == 'metamask') {
    okxMetaMaskConnect(walletType, (window as any).ethereum);
  } else if (walletType == 'tokenpocket') {
    try {
      const result = await tp.getCurrentWallet();
      if (result.result) {
        if (result.data.blockchain == 'arb') {
          store.commit('setWalletType', walletType);
          store.commit('setWalletAddress', util.getAddress(result.data.address));
          store.commit('setWalletNetwork', true);
          message.success('Connected');
        } else {
          tpConnect(walletType);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
};
