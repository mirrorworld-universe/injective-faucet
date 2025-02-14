<template>
  <section class="home">
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

      <div class="important">
        To maintain adequate balances for all users, the Faucet distributes 4 Test SOL every 8 hours.
      </div>

      <!-- <vue-turnstile ref="turnstile" site-key="0x4AAAAAAAc6HG1RMG_8EHSC" v-model="token" /> -->

      <div class="confirm">
        <a-button
          type="primary"
          size="large"
          block
          :loading="loading"
          :disabled="!addressVal"
          @click="handleClaim">
          Confirm Airdrop
        </a-button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, watchEffect, ref, h, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message, notification } from 'ant-design-vue';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';
import apis from '@/apis';
import utils from '@/utils';
import VueTurnstile from 'vue-turnstile';
import { Connection, PublicKey } from '@solana/web3.js';

const route = useRoute();
const router = useRouter();

const amount = '4';
const addressVal = ref('');
const loading = ref(false);
const turnstile: any = ref(null);

const networkList = ref([
  {
    label: 'Injective',
    value: 'Injective',
    rpcApi: 'https://svm-injective-test.sonic.game',
    faucetApi: 'https://faucet-injective-test.sonic.game',
    explorer: (tx) => `https://explorer.sonic.game/tx/${tx}?cluster=custom&customUrl=https%3A%2F%2Fsvm-injective-test.sonic.game`
  }
]);
const networkVal: any = ref(networkList.value[0].value);

watchEffect(() => {
  if (route.query.network) {
    const network = networkList.value.find((item: any) => item.value === route.query.network);
    if (network) {
      networkVal.value = route.query.network;
      if (turnstile.value) turnstile.value.reset();
    }
  }
  if (route.query.wallet) {
    addressVal.value = route.query.wallet as string;
  }
});


const handleChange = (value: string) => {
  if (loading.value) return;
  router.push({ query: { network: value } });
};

const handleClaim = async () => {
  if (loading.value || !addressVal.value) return;

  loading.value = true;
  const network = networkList.value.find((item: any) => item.value === networkVal.value);
  const url = `${network?.faucetApi}/airdrop/${addressVal.value}/${amount}/x`;
  apis
    .getAirdrop(url)
    .then((res: any) => {
      console.log('getAirdrop', res.data);
      loading.value = false;

      if (res.data) {
        if (res.data.error) return message.error(res.data.data.error);
        const tx = res.data.replace(/\n/g, '').replace('Signature: ', '');
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
      if (error.status == 401) {
        message.error(error.data.error);
      } else if (error.status == 429) {
        message.error(error.data.message);
      } else {
        message.error('Airdrop failed');
      }
    });
};
</script>

<style lang="scss" scoped>
.home {
  .important {
    width: 100%;
    margin: 0 auto 10px;
    font-family: Orbitron;
    font-size: 16px;
    color: #fff;
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
      .balance {
        font-family: Manrope;
        font-weight: 700;
        font-size: 18px;
        color: #fff;
        display: flex;
        align-items: center;
        .anticon {
          margin-left: 20px;
          font-size: 20px;
        }
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

.anticon.anticon-close-circle {
  color: #de1303;
}
.anticon.anticon-check-circle {
  color: #0aa937;
}

@media screen and (max-width: 750px) {
  .home {
    .box {
      width: 90vw;
    }
  }
}
</style>
