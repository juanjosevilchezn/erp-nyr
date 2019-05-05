<template>
    <div id="sidebar">
      <nav class="nav flex-column nav-justified">
        <div v-for="option in options" v-bind:key="option.opt_name">
          <a class="nav-link" v-bind:href="option.opt_link">
            <p><font-awesome-icon v-bind:icon="option.opt_ico" size="2x"/></p>
            {{ option.opt_name }}
          </a>
          <div class="dropdown-divider"/>
        </div>
      </nav>
    </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    options: Array
  }
}
</script>

<style>
  #sidebar {
    align-content: center;
    align-items: center;
    padding-top: 10px;
    width: 12.5%;
    min-width: 130px;
    max-width: 130px;
    background-color: #e0e0e0;
    height: 100%;
  }

  a {
    text-align: center;
  }
</style>
