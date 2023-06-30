<template>
  <div>
    <div role="button" class="float-end link-secondary" title="Close">
      <i class="fa fa-times-circle fa-2x" aria-hidden="true"></i>
    </div>
    <h4 class="mb-2 d-flex align-items-center gap-2">
      <img
        src="https://www.cryptocompare.com/media/37746251/btc.png"
        class="h-8 w-auto"
      /><span>BTC - USD</span
      ><span class="link-secondary"
        ><i
          class="fa fa-chevron-circle-up cursor-pointer"
          title="Закрыть описание"
        ></i>
        <i
          class="fa fa-chevron-circle-down cursor-pointer"
          title="Открыть описание"
        ></i
      ></span>
    </h4>
    <div>
      <h5 class="text-center">Bitcoin</h5>
      <p>
        Bitcoin is a decentralized cryptocurrency that uses peer-to-peer
        technology and a blockchain to record transactions. It was created by
        Satoshi Nakamoto and the first block was mined on January 3, 2009.
        Bitcoin transactions are recorded on a blockchain, which is a
        distributed ledger that can be accessed by anyone to verify
        transactions. Transactions are verified by miners, who are rewarded with
        a set amount of Bitcoin and transaction fees. The supply of Bitcoin is
        limited to 21 million coins and it is divisible to eight decimal places.
        A wallet is needed to use Bitcoin and it consists of a public key, which
        is used to send and receive payments, and a private key, which is used
        to control the wallet. Bitcoin can be used for a variety of purposes,
        including everyday transactions, as a store of value, or for investment.
      </p>
    </div>
    <div
      class="mt-4 mb-2 h-64 d-flex align-items-end border-bottom border-start border-secondary"
    >
      <template v-for="index in 10" :key="index"
        ><div
          class="bg-primary border w-percent-2"
          title="30753.78"
          style="height: 50.8059%"
        ></div
      ></template>
      <template v-for="index in 10" :key="index"
        ><div
          class="bg-primary border w-percent-2"
          title="30753.78"
          style="height: 63.5498%"
        ></div
      ></template>
      <template v-for="index in 10" :key="index"
        ><div
          class="bg-primary border w-percent-2"
          title="30781.65"
          style="height: 100%"
        ></div
      ></template>
      <template v-for="index in 10" :key="index"
        ><div
          class="bg-primary border w-percent-2"
          title="30743.09"
          style="height: 30.7262%"
        ></div
      ></template>
      <template v-for="index in 10" :key="index"
        ><div
          class="bg-primary border w-percent-2"
          title="30728.77"
          style="height: 5%"
        ></div
      ></template>
    </div>
  </div>
</template>

<script>
export default {
  name: "TradingSchedule",
};
</script>
