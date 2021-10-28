import { ChartDataPoint } from "components/Chart"

export interface BlockhainStats {
  contract_count: number
  contract_txn_count: number
  zilswap_user_count: number
  defi_txn_count: number
  defi_user_count: number
  active_user_count: number
  contract_txn_week: ChartDataPoint[]
  daily_txn_value: string
}

const getStoreStats = async (): Promise<BlockhainStats> => {
  const res = await fetch(`https://store.zilstream.com/stats`)
  return res.json()
}

export default getStoreStats