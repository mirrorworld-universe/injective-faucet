export function network(env?: string) {
  const environment = env || process.env.NODE_ENV;
  if (environment === 'production') {
    return {
      chainId: '0xa4b1',
      chainName: 'Arbitrum One',
      rpcUrls: ['https://arb.mytokenpocket.vip']
    };
  } else {
    return {
      chainId: '0xa4b1',
      chainName: 'Arbitrum One',
      rpcUrls: ['https://arb.mytokenpocket.vip']
    };
  }
}
