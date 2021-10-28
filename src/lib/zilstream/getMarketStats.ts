export interface ZilswapStats {
  tvl: number
  volume_24h: number
  market_cap: number
  tokens: StatsToken[]
}

export interface StatsToken {
  name: string
  symbol: string
  address: string
  rate: number
  rate_usd: number
  market_cap: number
  liquidity: number
}

const getMarketStats = async (): Promise<ZilswapStats> => {
  const res = await fetch(`https://api.zilstream.com/stats`)
  return res.json()
}

export default getMarketStats