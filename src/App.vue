<template>
  <div class="container-fluid container-lg min-h-100vh mx-auto p-3 bg-light">
    <AddTicker />
    <hr class="w-percent-100 border-secondary" />
    <TickerList />
    <hr class="w-percent-100 border-secondary" />
    <TradingSchedule />
  </div>
</template>

<script>
import AddTicker from "./components/AddTicker.vue";
import TickerList from "./components/TickerList.vue";
import TradingSchedule from "./components/TradingSchedule.vue";

export default {
  name: "App",
  components: { AddTicker, TickerList, TradingSchedule },
};
</script>

<style>
#app {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
