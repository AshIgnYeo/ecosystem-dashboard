import { ChartDataPoint } from "components/Chart"

const getTVL = async (): Promise<ChartDataPoint[]> => {
  const res = await fetch(`https://api.zilstream.com/tvl`)
  return res.json()
}

export default getTVL