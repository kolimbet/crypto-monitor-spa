<template>
  <div>
    <Transition name="slide-left">
      <div v-if="addError" class="row row-cols-1 mb-0-75rem">
        <div class="col d-flex justify-content-center">
          <ErrorMessage :message="addErrorMessage" />
        </div>
      </div>
    </Transition>

    <div>
      <label for="addNewCoin" class="fs-sm text-secondary ms-1 fw-bold"
        >Cryptocurrency</label
      >
      <div class="d-flex">
        <input
          v-model.trim="newTicker"
          @keydown.enter="addTicker()"
          @input="closeAddTickerError()"
          id="addNewCoin"
          type="text"
          class="form-control mw-40"
          placeholder="Например DOGE"
          autocomplete="off"
        />
        <button
          @click="addTicker()"
          type="button"
          class="btn btn-secondary rounded-pill px-3 ms-2"
        >
          <i class="fa fa-plus-circle me-2 lh-1" aria-hidden="true"></i
          ><span>Add</span>
        </button>
      </div>

      <Transition name="folding-y-300">
        <template v-if="autofill.length">
          <TransitionGroup
            name="list-scale01"
            tag="div"
            class="d-flex flex-wrap p-1 mt-1 rounded-1 bg-white shadow"
          >
            <span
              v-for="c in autofill"
              :key="c.Name"
              @click.stop="selectAutofillHint(c.Name)"
              class="d-inline-flex px-2 m-1 fs-xs fw-bold bg-secondary bg-opacity-25 rounded-2 cursor-pointer"
            >
              {{ c.CoinName + (c.CoinName === c.Name ? "" : ` [${c.Name}]`) }}
            </span>
          </TransitionGroup>
        </template>
      </Transition>
    </div>
  </div>
</template>

<script>
import { parseErrorMessage } from "@/lib/errors";
import { getCoinMatchIndex } from "@/lib/autofill";
import ErrorMessage from "./ErrorMessage.vue";

export default {
  name: "AddTicker",
  components: { ErrorMessage },
  data() {
    return {
      newTicker: "",
      addError: false,
      addErrorMessage: "",
      limitAutofillElts: 20,
    };
  },
  computed: {
    autofill() {
      if (this.newTicker === "") return [];
      const searchStr = this.newTicker.toUpperCase();

      let searchRes = this.$store.state.coin.coinList
        .filter(
          (c) =>
            c.Name.includes(searchStr) ||
            c.Symbol.includes(searchStr) ||
            c.CoinName.includes(searchStr)
        )
        .sort(
          (c1, c2) =>
            getCoinMatchIndex(c1, searchStr) - getCoinMatchIndex(c2, searchStr)
        );

      if (searchRes.length > this.limitAutofillElts) {
        searchRes = searchRes.slice(0, this.limitAutofillElts);
      }

      // console.log(searchStr, searchRes);
      return searchRes;
    },
  },
  methods: {
    throwAddTickerError(message) {
      this.addErrorMessage = message;
      this.addError = true;
    },
    closeAddTickerError() {
      this.addError = false;
    },
    addTicker() {
      this.closeAddTickerError();
      if (this.newTicker == "") return false;
      // console.log("Attempt adding new ticker: " + this.newTicker);
      this.$store
        .dispatch("ticker/addTicker", this.newTicker)
        .then(() => {
          this.newTicker = "";
        })
        .catch((err) => {
          this.throwAddTickerError(parseErrorMessage(err));
        });
    },
    selectAutofillHint(name) {
      this.newTicker = name;
      this.addTicker();
    },
  },
};
</script>
