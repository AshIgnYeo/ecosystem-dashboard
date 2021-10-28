import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createChart, IChartApi, ISeriesApi, SeriesMarker, Time } from 'lightweight-charts'
import { numberFormat } from 'utils/format'

interface Props {
  data: ChartDataPoint[]
  className?: string
}

export interface ChartDataPoint {
  time: string
  value: number
}

function Chart(props: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const tooltipRef = React.useRef<HTMLDivElement | null>(null)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [chart, setChart] = useState<IChartApi|null>(null)
  const [series, setSeries] = useState<ISeriesApi<"Area">|null>(null)

  const [displayTooltip, setDisplayTooltip] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(0)

  useEffect(() => {
    if(ref.current) {
      let newChart = createChart(ref.current, {
        width: ref.current.clientWidth, 
        height: ref.current.clientHeight,
        handleScroll: true,
        handleScale: true,
        layout: {
          backgroundColor: 'rgba(0,0,0,0)',
          textColor: '#838383',
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: false,
          },
        },
        leftPriceScale: {
          visible: false,
        },
        rightPriceScale: {
          visible: false,
          borderVisible: false,
        },
        timeScale: {
          visible: true,
          borderVisible: false,
          fixLeftEdge: true,
          barSpacing: 0.1
        },
        crosshair: {
          vertLine: {
            visible: true,
            color: 'rgba(255,255,255,0.05)'
          },
          horzLine: {
            visible: true,
            color: 'rgba(255,255,255,0.05)'
          },
        },
      })
      
      const newSeries = newChart.addAreaSeries({
        topColor: 'rgba(76, 175, 80, 0.56)',
        bottomColor: 'rgba(76, 175, 80, 0.04)',
        lineColor: 'rgba(76, 175, 80, 1)',
        lineWidth: 2,
        priceLineVisible: false,
        crosshairMarkerVisible: true,
        // crosshairMarkerRadius: 5,
        autoscaleInfoProvider: () => ({
          priceRange: {
              minValue: Math.min(...props.data.map(item => item.value)),
              maxValue: Math.max(...props.data.map(item => item.value)),
          },
        }),
      });
      const data = props.data.sort((a,b) =>  new Date(a.time).getTime()  -  new Date(b.time).getTime())
      newSeries.setData(data)
      setSeries(newSeries)
      
      newChart.timeScale().fitContent()

      // update tooltip
      newChart?.subscribeCrosshairMove(function(param) {
        if (param.point === undefined || !param.time || param.point.x < 0 || param.point.y < 0) {
          setDisplayTooltip(false)
          setCurrentPrice(0)
        } else {
          setDisplayTooltip(true)
              
          var price = param.seriesPrices.get(newSeries);
          if(price) {
            setCurrentPrice(Math.round(100 * +price) / 100)
          }
        }
      });

      setChart(newChart)
    }

    return () => chart?.remove()
  }, [])

  useLayoutEffect(() => {
    function updateSize() {
      if(ref.current) {
        chart?.resize(ref.current.clientWidth, ref.current.clientHeight)
        chart?.timeScale().fitContent()
      }
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  })

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div ref={ref} className={`${props.className} w-full`} />

      
      <div ref={tooltipRef} className={`bg-white absolute z-50 -top-5 right-4 pointer-events-none font-semibold rounded`}>
        {currentPrice > 0 &&
          <>
            {numberFormat(currentPrice, 0)}
          </>
        }
        
      </div>
      
    </div>
  )
}

export default Chart