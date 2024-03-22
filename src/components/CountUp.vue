<template>
  <template v-if="props.endVal >= 0">
    <count-up
      :startVal="props.startVal"
      :endVal="props.endVal"
      :decimalPlaces="props.decimalPlaces"
      :duration="1"
      :enableScrollSpy="true" />
  </template>
  <template v-else>
    <span>-</span>
  </template>
</template>

<script lang="ts" setup>
import CountUp from 'vue-countup-v3';

const props = defineProps({
  startVal: { type: Number, default: 0 },
  endVal: { type: Number, default: 0 },
  decimalPlaces: { type: Number, default: 0 }
});
</script>

<style lang="scss" scoped></style>
