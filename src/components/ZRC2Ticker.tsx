import React, { useEffect } from 'react'
import { useState } from 'react'
import Marquee from 'react-fast-marquee'
import { currencyFormat } from 'utils/format'

interface Token {
  name: string,
  symbol: string,
  address: string,
  rate: number,
  rate_usd: number,
  liquidity_ema30_zil: number
}

interface StatsResponse {
  tokens: Token[]
}

interface Props {
  className?: string
}

const ZRC2Ticker = (props: Props) => {
  const [tokens, setTokens] = useState<Token[]>([])

  const getData = async () => {
    const res = await fetch(`https://api.zilstream.com/stats`)
    const json: StatsResponse = await res.json()
    setTokens(json.tokens)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className={`relative overflow-hidden ${props.className}`}>
      <Marquee className="overflow-hidden" speed={40} gradient={false} pauseOnHover={true}>
        {tokens.filter(token => token.liquidity_ema30_zil >= 500000).map(token => (
          <div key={token.address} className="px-2 text-xs flex items-center">
            <div className="w-4 h-4 mr-1">
              <img src={`https://meta.viewblock.io/ZIL.${token.address}/logo`} />
            </div>
            <div className="flex items-center gap-1">
              <a href={`https://zilstream.com/tokens/${token.symbol}`} target="_blank"><span className="font-medium">{token.symbol}</span></a>
              <span className="text-gray-600">{currencyFormat(token.rate_usd)}</span>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  )
}

export default ZRC2Ticker