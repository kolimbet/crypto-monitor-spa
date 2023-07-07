import axios from "axios";
import { sourceUrls } from "./config/sourceUrls";
import { apiKey } from "./config/apiKey";
import store from "@/store";

const urlCoinList = () => `${sourceUrls.coinList}?api_key=${apiKey}`;
const urlCoinPrices = (coinList, currency) => {
  coinList = coinList.join();
  return `${sourceUrls.prices}?fsyms=${coinList}&tsyms=${currency}&api_key=${apiKey}`;
};

function parsingResponse(answer) {
  return new Promise((resolve, reject) => {
    if (answer.Response === "Success") resolve(answer.Data);
    else if (answer.Response === "Error") reject(answer.Message);
    else reject("Unknown server response format");
  });
}
function checkPriceError(answer) {
  return new Promise((resolve, reject) => {
    if (answer?.Response === "Error") reject(answer.Message);
    else resolve(answer);
  });
}

export const restApi = {
  getCoinList: () =>
    new Promise((resolve, reject) => {
      axios
        .get(urlCoinList())
        .then(({ data }) => {
          parsingResponse(data)
            .then((result) => {
              // console.log("restApi->getCoinList completed success", result);
              resolve(result);
            })
            .catch((err) => {
              // console.log("restApi->getCoinList failed", err);
              reject(err);
            });
        })
        .catch((/* err */) => {
          // console.log("restApi->getCoinList transport error", err);
          reject("transport error");
        });
    }),
  getExchangeRate: (coinList) =>
    new Promise((resolve, reject) => {
      if (!coinList || !coinList.length)
        throw new Error(
          "The list of cryptocurrencies for the price request was not received"
        );
      axios
        .get(urlCoinPrices(coinList, store.state.ticker.currentCurrency))
        .then(({ data }) => {
          // console.log(data);
          checkPriceError(data)
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          console.log("restApi->getExchangeRate error", err);
          reject(err);
        });
    }),
};
