<template>
  <a-config-provider
    :theme="{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#00b96b'
      }
    }">
    <a-app>
      <HeaderView />
      <main>
        <router-view></router-view>
      </main>
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
import HeaderView from '@/layout/HeaderView.vue';
import { onMounted, onBeforeUnmount, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { theme } from 'ant-design-vue';
import WOW from 'wow.js';
import utils from '@/utils';

const store = useStore();

onMounted(() => {});
</script>

<style lang="scss">
main {
  padding-top: 100px;
  min-height: 100vh;
  position: relative;
  z-index: 9;
  section {
    width: 100%;
    height: 100%;
  }
}

@media screen and (max-width: 750px) {
  main {
  }
}
</style>
