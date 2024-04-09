<template>
  <header>
    <nav>
      <img src="@/assets/images/sonic-logo.png" alt="" class="logo" />
    </nav>
  </header>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
header {
  width: 100%;
  height: 75px;
  position: fixed;
  z-index: 99;
  border-bottom: 1px solid #111;
  background: #1e2423;
}

nav {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  .logo {
    width: auto;
    height: 80%;
  }
}

@media screen and (max-width: 750px) {
  nav {
    width: 90vw;
  }
}
</style>
