import store from "@/store";
import { throwFatalError, wsSubscriptions } from "./wsApi";

export function responseProcessing(message) {
  switch (message.TYPE) {
    case "5":
      responseHandlers.aggregateIndex(message);
      break;
    case "999":
      responseHandlers.streamIsActive(message);
      break;
    case "16":
      responseHandlers.subscribeComplete(message);
      break;
    case "3":
      responseHandlers.allSubscribesLoaded(message);
      break;
    case "17":
      responseHandlers.unsubscribeComplete(message);
      break;
    case "18":
      responseHandlers.allUnsubscribeComplete(message);
      break;
    case "500":
      responseHandlers.invalidAction(message);
      break;
    case "20":
      responseHandlers.streamerWelcome(message);
      break;
    case "401":
      responseHandlers.unauthorized(message);
      break;
    // INFO: "You have reached your maximum sockets open for your subscription"
    // MESSAGE: "TOO_MANY_SOCKETS_MAX_1_PER_CLIENT"
    // TYPE: "429"
    case "429":
      responseHandlers.toManySockets(message);
      break;

    default:
      console.log("Unknown message", message);
  }
}

const responseHandlers = {
  aggregateIndex: (message) => {
    if (message.PRICE === undefined || message.FROMSYMBOL === undefined)
      return false;
    // console.log("WS ticker price update", message.FROMSYMBOL, message.PRICE);
    store.commit("ticker/updateTickerPrice", {
      tickerName: message.FROMSYMBOL,
      price: message.PRICE,
    });
  },
  subscribeComplete: (message) => {
    const sub = message.SUB.match(/5~CCCAGG~(\w+)~(\w+)/i);
    if (sub === null || !sub[1]) {
      throwFatalError(
        "Error decode subscribeComplete response: " + message.SUB
      );
      return false;
    }
    const tickerName = sub[1];
    // const currency = sub[2];
    wsSubscriptions.deleteFromQueue(tickerName);
    store.commit("ticker/confirmWsSubscription", tickerName);
  },
  unsubscribeComplete: (/* message */) => {
    // console.log(`Subscription "${message.SUB}" deleted /${message.TYPE}/`);
  },
  allSubscribesLoaded: (/* message */) => {
    // console.log(`All valid subscriptions are loaded /${message.TYPE}/`);
  },
  allUnsubscribeComplete: (/* message */) => {
    // console.log(`All specified subscriptions have been deleted /${message.TYPE}/`);
  },
  invalidAction: (message) => {
    switch (message.MESSAGE) {
      case "INVALID_SUB":
        // console.log("INVALID_SUB", message);
        responseHandlers.invalidSubscribe(message);
        break;

      default:
        console.log("Unknown failed action", message);
    }
  },
  invalidSubscribe: (message) => {
    const sub = message.PARAMETER.match(/5~CCCAGG~(\w+)~(\w+)/i);
    if (sub === null || !sub[1]) {
      throwFatalError(
        "Error decode subscribeComplete response: " + message.PARAMETER
      );
      return false;
    }
    const tickerName = sub[1];
    // const currency = sub[2];
    wsSubscriptions.deleteFromQueue(tickerName);
    store.commit("ticker/throwTickerApiError", {
      tickerName,
      message: message.INFO ?? message.MESSAGE ?? "Invalid subscription",
      wsApi: true,
    });
  },
  toManySockets: (message) => {
    throwFatalError(`${message.INFO} /${message.TYPE}/`);
  },
  streamerWelcome: (message) => {
    console.log(
      `You have successfully connected to the WebSocket /${message.TYPE}/`
    );
  },
  streamIsActive: (message) => {
    console.log(`Channel is active /${message.TYPE}/`);
  },
  unauthorized: (message) => {
    throwFatalError(
      `Your API key is missing or invalid, or does not have access to requested data. /${message.TYPE}/`
    );
  },
};
