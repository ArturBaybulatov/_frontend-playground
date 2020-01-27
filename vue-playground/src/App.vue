<template>
  <div class="content">
    <div class="nav bgap-l">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>

    <router-view/>
  </div>
</template>

<style scoped lang="less">
.content {
  margin: 0 auto;
  max-width: 1600px;
}

.nav {
  a {
    color: black;
    font-weight: bold;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
