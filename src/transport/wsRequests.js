import store from "@/store";
import { socket } from "./wsApi";

function sendMessage(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return true;
  }
  return false;
}

export const wsRequests = {
  subscribeToTicker: (tickerName) => {
    const message = {
      action: "SubAdd",
      subs: [`5~CCCAGG~${tickerName}~${store.state.ticker.currentCurrency}`],
    };
    // console.log(message);
    return sendMessage(message);
  },
  unsubscribeFromTicker: (tickerName) => {
    const message = {
      action: "SubRemove",
      subs: [`5~CCCAGG~${tickerName}~${store.state.ticker.currentCurrency}`],
    };
    // console.log(message);
    return sendMessage(message);
  },
};
