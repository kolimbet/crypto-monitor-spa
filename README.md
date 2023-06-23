# Crypto Monitor SPA

This is a simple application for tracking prices for a list of selected cryptocurrencies. The list of coins is saved in localStorage and loaded at startup. The list of tickers is divided into pages of 6 pieces and can be filtered by lexical coincidence.

To get the cryptocurrency exchange rate in real time, the application uses the API from cryptocompare.com. To get a list of available cryptocurrencies and initial prices for tracked tickers, the REST API is used. A WebSocket connection is used to track the prices of the user's tickers in real time.

When a ticker with one of the cryptocurrencies is selected, the application displays its trading chart for some time.

## Installation

Clone this repository to your server:

```
git clone https://github.com/kolimbet/crypto-monitor-spa.git crypto-monitor.tst
```

Install the necessary NPM packages:

```
npm install
```

Prescribe autocorrect paths for your IDE. I use VS Code and add a local
settings file /.vscode/settings.json the following instructions for the PathAutocomplete plugin:

```
// Path Autocomplite
"path-autocomplete.pathMappings": {
  "@": ["${workspace}/src"]
}
```

I also use Live Sass Compiler. CSS files compiled by this plugin are imported into the project. The sources are in the /src/scss folder.

Compile the project:

```
npm run dev
```
