import store from "@/store";
import { apiKey } from "./config/apiKey";
import { sourceUrls } from "./config/sourceUrls";
import { wsRequests } from "./wsRequests";
import { responseProcessing } from "./wsResponses";

export let socket = null;
let closeChannel = false;
let isFatalError = false;
const RECONNECTION_INTERVAL = 2000;
const RECONNECTION_ATTEMPTS_MAX = 3;

const url = `${sourceUrls.ws}?api_key=${apiKey}`;

let wsSubscriptionsQueue = [];

function connectToChanel(connectionAttempt = 1) {
  if (isFatalError) return false;
  if (socket && socket.readyState === WebSocket.OPEN) return false;

  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("WebSocket connection is open");
    connectionAttempt = 0;
    store.commit("ticker/confirmWsConnection");
    wsSubscriptions.restoreSubscriptionsFromTickerList();
  };

  socket.onmessage = (e) => {
    responseProcessing(JSON.parse(e.data));
  };

  socket.onerror = (err) => {
    console.error("Socket encountered error: ", err, "Closing socket");
    // socket.close();
  };

  socket.onclose = (e) => {
    console.log("Socket is closed", e.reason);
    store.commit("ticker/breakWsConnection");
    store.commit("ticker/breakAllWsSubscription");
    if (connectionAttempt < RECONNECTION_ATTEMPTS_MAX) {
      if (!closeChannel) {
        setTimeout(function () {
          connectToChanel(++connectionAttempt);
        }, RECONNECTION_INTERVAL);
      }
    } else {
      throwFatalError(
        "WS API error: limit of reconnection attempts has been reached"
      );
    }
  };
}

export function throwFatalError(errorMessage) {
  isFatalError = true;
  if (socket && socket.readyState === WebSocket.OPEN) wsApi.closeConnection();
  store.dispatch("throwFatalError", errorMessage);
}

export const wsSubscriptions = {
  clearQueue: () => {
    wsSubscriptionsQueue = [];
  },
  addToQueue: ({ tickerName, sent = false }) => {
    if (!wsSubscriptionsQueue.some((elt) => elt.tickerName === tickerName)) {
      wsSubscriptionsQueue.push({ tickerName, sent });
    }
  },
  checkSendingRequest: (tickerName) => {
    wsSubscriptionsQueue
      .filter((elt) => elt.tickerName === tickerName)
      .forEach((elt) => {
        elt.sent = true;
      });
  },
  uncheckSendingRequest: (tickerName) => {
    wsSubscriptionsQueue
      .filter((elt) => elt.tickerName === tickerName)
      .forEach((elt) => {
        elt.sent = false;
      });
  },
  deleteFromQueue: (tickerName) => {
    wsSubscriptionsQueue = wsSubscriptionsQueue.filter(
      (elt) => elt.tickerName !== tickerName
    );
  },

  restoreSubscriptionsFromTickerList: () => {
    wsSubscriptions.clearQueue();
    store.state.ticker.tickerList.forEach((t) => {
      wsSubscriptions.addToQueue({
        tickerName: t.name,
        sent: wsRequests.subscribeToTicker(t.name),
      });
    });
  },

  addSubscription: (tickerName) => {
    wsSubscriptions.addToQueue({
      tickerName,
      sent: wsRequests.subscribeToTicker(tickerName),
    });
  },

  deleteSubscription: (tickerName) => {
    wsSubscriptions.deleteFromQueue(tickerName);
    wsRequests.unsubscribeFromTicker(tickerName);
  },
};

export const wsApi = {
  initConnection: () => {
    connectToChanel();
  },
  closeConnection: () => {
    closeChannel = true;
    socket.close();
  },
  subscribeToTicker: (tickerName) => {
    wsSubscriptions.addSubscription(tickerName);
  },
  unsubscribeFromTicker: (tickerName) => {
    wsSubscriptions.deleteSubscription(tickerName);
  },
};
