function getMatchIndex(check, search) {
  return check.indexOf(search) + Math.abs(check.length - search.length) * 2;
}

export function getCoinMatchIndex(coin, searchStr) {
  const notFound = 9999;
  return Math.min(
    coin.Name.indexOf(searchStr) === -1
      ? notFound
      : getMatchIndex(coin.Name, searchStr),
    coin.Symbol.indexOf(searchStr) === -1
      ? notFound
      : getMatchIndex(coin.Symbol, searchStr),
    coin.CoinName.indexOf(searchStr) === -1
      ? notFound
      : getMatchIndex(coin.CoinName, searchStr)
  );
}
