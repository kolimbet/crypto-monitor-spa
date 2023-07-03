import axios from "axios";
import { sourceUrls } from "./config/sourceUrls";
import { apiKey } from "./config/apiKey";

const urlCoinList = () => `${sourceUrls.coinList}?api_key=${apiKey}`;

function parsingResponse(answer) {
  return new Promise((resolve, reject) => {
    if (answer.Response === "Success") resolve(answer.Data);
    else if (answer.Response === "Error") reject(answer.Message);
    else reject("Неизвестный формат ответа сервера");
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
};
