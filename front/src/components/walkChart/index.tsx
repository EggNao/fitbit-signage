import clsx from 'clsx'
import Chart from 'react-apexcharts'

export type Walk = 'goal' | 'Actual'

export type WalkChartProps = { stepsArray: { [s: string]: number[] } }

export const WalkChart: React.VFC<WalkChartProps> = ({ stepsArray }) => {
  let dataArray = []
  for (let i = 0; i < 15; i++) {
    dataArray.push({
      x: String(6 + i),
      y: stepsArray['actual'][i],
      goals: [
        {
          name: 'Expected',
          value: stepsArray['goal'][i],
          strokeHeight: 5,
          strokeColor: '#775DD0',
        },
      ],
    })
  }
  const series = [
    {
      name: 'Actual',
      data: dataArray,
    },
  ]
  const options = {
    chart: {
      height: 350,
      type: 'bar' as ApexChart['type'],
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
      },
    },
    colors: ['#05CD99'],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: ['Actual', 'Expected'],
      markers: {
        fillColors: ['#05CD99', '#775DD0'],
      },
    },
  }
  return (
    <div>
      <Chart options={options} series={series} type='bar'></Chart>
    </div>
  )
}
