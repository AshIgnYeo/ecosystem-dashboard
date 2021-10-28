import React from 'react'
import dynamic from 'next/dynamic'
import ZRC2Ticker from 'components/ZRC2Ticker'
import getMarketStats, { ZilswapStats } from 'lib/zilstream/getMarketStats'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { currencyFormat, numberFormat } from 'utils/format'
import getStoreStats, { BlockhainStats } from 'lib/zilstream/getStoreStats'
import { ChartDataPoint } from 'components/Chart'
import getTVL from 'lib/zilstream/getTVL'
import { toBigNumber } from 'utils/bignumber'

const Chart = dynamic(
  () => import('components/Chart'),
  { ssr: false }
)

export default function Home() {
  const [stats, setStats] = useState<ZilswapStats>()
  const [storeStats, setStoreStats] = useState<BlockhainStats>()
  const [tvl, setTVL] = useState<ChartDataPoint[]>()

  useEffect(() => {
    const fetchStats = async () => {
      setStats(await getMarketStats())
      setStoreStats(await getStoreStats())
      setTVL(await getTVL())
    }

    fetchStats()
  }, [])

  const zilToken = stats?.tokens.filter(token => token.address === 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz')?.[0]

  return (
    <div>
      <Head>
        <title>Ecosystem dashboard components</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="px-4">
        <h1 className="text-2xl font-bold text-center py-8">Ecosystem dashboard components</h1>
        <ZRC2Ticker className="bg-white rounded-lg py-2 text-black" />

        {stats &&
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2 mt-2">
            <div className="bg-white text-black rounded-lg p-5 text-center">
              <div>Total value locked</div>
              <div className="font-bold">{currencyFormat(stats.tvl, 0)}</div>
            </div>
            <div className="bg-white text-black rounded-lg p-5 text-center">
              <div>Market cap</div>
              <div className="font-bold">{currencyFormat(stats.market_cap, 0)}</div>
            </div>
            <div className="bg-white text-black rounded-lg p-5 text-center">
              <div>Volume (24h)</div>
              <div className="font-bold">{currencyFormat(stats.volume_24h, 0)}</div>
            </div>
          </div>
        }

        {storeStats && zilToken &&
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
              <div className="bg-white text-black rounded-lg p-5 text-center">
                <div>No. of smart contract deployed</div>
                <div className="font-bold">{numberFormat(storeStats.contract_count, 0)}</div>
              </div>
              <div className="bg-white text-black rounded-lg p-5 text-center">
                <div>Total smart contract txs (24h)</div>
                <div className="font-bold">{numberFormat(storeStats.contract_txn_count, 0)}</div>
              </div>
              <div className="bg-white text-black rounded-lg p-5 text-center">
                <div>ZilSwap users</div>
                <div className="font-bold">{numberFormat(storeStats.zilswap_user_count, 0)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
              <div className="bg-white text-black rounded-lg p-5 text-center">
                <div>Active users</div>
                <div className="font-bold">{numberFormat(storeStats.active_user_count, 0)}</div>
              </div>
              <div className="bg-white text-black rounded-lg p-5 text-center">
                <div>DeFi user count</div>
                <div className="font-bold">{numberFormat(storeStats.defi_user_count, 0)}</div>
              </div>
              <div className="bg-white text-black rounded-lg p-5 text-center">
                <div>DeFi txn count</div>
                <div className="font-bold">{numberFormat(storeStats.defi_txn_count, 0)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
              <div className="bg-white text-black rounded-lg p-5 text-center">
                <div>Daily Txn Value</div>
                <div className="font-bold">{currencyFormat(toBigNumber(storeStats.daily_txn_value).times(Math.pow(10, -12)).times(zilToken.rate).toNumber(), 0)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
              <div className="bg-white rounded-lg text-black">
                <div className="px-4 mt-3">Smart contract txs growth</div>
                <Chart className="h-72" data={storeStats.contract_txn_week} />
              </div>

              {tvl &&
                <div className="bg-white rounded-lg text-black">
                  <div className="px-4 mt-3">Zilswap TVL</div>
                  <Chart className="h-72" data={tvl} />
                </div>
              }
            </div>
          </>
        }

        
      </div>
    </div>
  )
}
