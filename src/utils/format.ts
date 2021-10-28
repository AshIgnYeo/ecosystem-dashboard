export function currencyFormat(num: number, decimals: number = 2, symbol: string = "$"): string {
  if(num === undefined) return ''
  if(num < 0.5) {
    return symbol + num.toFixed(5)
  }
  return symbol + num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function numberFormat(num: number, decimals: number = 2): string {
  if(num < 0.1) {
    return num.toFixed(decimals)
  }
  return num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}