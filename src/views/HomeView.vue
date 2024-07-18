<template>
  <section class="home">
    <!-- <div class="important">
      Important Update: Sonic Testnet will upgrade on June 24, 2024, at 5 AM UTC, for 6+ hours. Some tasks and on-chain
      interactions will be paused. Thank you for understanding.
    </div> -->
    <div class="box">
      <div class="title">
        <div>Request Airdrop</div>
      </div>

      <div class="title2">
        <a-select
          ref="select"
          class="select-option"
          style="width: 220px"
          v-model:value="networkVal"
          :options="networkList"
          @change="handleChange"></a-select>
      </div>
      <div class="inputbox">
        <a-input v-model:value="addressVal" placeholder="Wallet Address" size="large" />
      </div>
      <div class="text">
        <span>Amount: </span>
        <div class="tag">{{ amount }}</div>
      </div>

      <vue-turnstile ref="turnstile" site-key="0x4AAAAAAAc6HG1RMG_8EHSC" v-model="token" />

      <div class="confirm">
        <a-button type="primary" size="large" block :loading="loading" @click="handleClaim"> Confirm Airdrop </a-button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, watchEffect, ref, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message, notification } from 'ant-design-vue';
import apis from '@/apis';
import utils from '@/utils';
import VueTurnstile from 'vue-turnstile';

const route = useRoute();
const router = useRouter();

const amount = '1';
const addressVal = ref('');
const token = ref('');
const loading = ref(false);
const turnstile: any = ref(null);

const networkVal: any = ref('devnet');
const networkList = ref([
  {
    value: 'devnet',
    label: 'devnet.sonic.game',
    rpc: 'https://faucet-api.sonic.game',
    explorer: (tx) => `https://explorer.sonic.game/tx/${tx}`
  },
  {
    value: 'testnet',
    label: 'api.testnet.sonic.game',
    rpc: 'https://faucet-api-grid-1.sonic.game',
    explorer: (tx) => `https://explorer.sonic.game/tx/${tx}?cluster=custom&customUrl=https://grid-1.hypergrid.dev`
  }
]);

watchEffect(() => {
  if (route.query.network) {
    const network = networkList.value.find((item: any) => item.value === route.query.network);
    if (network) {
      networkVal.value = route.query.network;
      if (turnstile.value) turnstile.value.reset();
    }
  }
});

const handleChange = (value: string) => {
  if (loading.value) return;
  router.push({ query: { network: value } });
};

const handleClaim = async () => {
  if (loading.value || !addressVal.value || !token.value) return;

  const currentTime = Date.now();
  const lastClaimTime = Number(localStorage.getItem('lastClaimTime')) || 0;
  const timeDiff = currentTime - lastClaimTime;

  if (timeDiff >= 1000) {
    loading.value = true;

    const network = networkList.value.find((item: any) => item.value === networkVal.value);

    const url = `${network?.rpc}/airdrop/${addressVal.value}/${amount}/${token.value}`;
    apis
      .getAirdrop(url)
      .then((res: any) => {
        console.log('getAirdrop', res.data);
        loading.value = false;

        if (res.data.data) {
          if (res.data.data.error) return message.error(res.data.data.error);
          localStorage.setItem('lastClaimTime', currentTime.toString());
          const tx = res.data.data.replace(/\n/g, '').replace('Signature: ', '');
          console.log('tx', tx);

          notification.success({
            message: 'Airdrop was successful!',
            description: () => {
              return h('a', {
                href: network?.explorer(tx),
                target: '_blank',
                innerHTML: network?.explorer(utils.formatAddr(tx))
              });
            },
            duration: null
          });
        } else {
          if (
            res.data.err == "error: Invalid value for '<RECIPIENT_ADDRESS>': No such file or directory (os error 2)\n"
          ) {
            message.error('Invalid address');
          } else {
            message.error(res.data.err);
          }
        }
      })
      .catch((error) => {
        loading.value = false;
        console.error(error);
        if (error.status == 429) {
          message.error('You already received the airdrop! Please try again in 24 hours.');
        } else {
          message.error('Airdrop failed');
        }
      });
  } else {
    message.info('You already received the airdrop! Please try again in 24 hours.');
  }
};
</script>

<style lang="scss" scoped>
.home {
  .important {
    width: 800px;
    margin: 0 auto 20px;
    font-family: Orbitron;
    font-size: 20px;
    color: #fff;
    text-align: center;
  }
  .box {
    width: 500px;
    height: auto;
    margin: 0 auto;
    border: 1px solid #ffffff1a;
    border-radius: 10px;
    padding: 20px;
    position: relative;
    > div {
      margin-bottom: 30px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .title {
      font-family: Orbitron;
      font-size: 20px;
      div:nth-child(2) {
        font-size: 12px;
      }
    }
    .title2 {
      font-family: Orbitron;
      font-size: 12px;
      position: absolute;
      right: 20px;
      top: 20px;
    }
    .text {
      display: flex;
      align-items: center;
      .tag {
        width: 50px;
        height: 40px;
        line-height: 40px;
        border-radius: 5px;
        text-align: center;
        font-family: Manrope;
        font-weight: 700;
        font-size: 18px;
        color: #fff;
        border: 1px solid #0000ff;
        box-shadow: 0 0 3px 3px rgba(0, 0, 255, 0.3);
      }
      span {
        font-family: Orbitron;
        font-weight: 200;
        font-size: 16px;
        margin-right: 20px;
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .home {
    .box {
      width: 90vw;
    }
  }
}
</style>
