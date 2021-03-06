import Chart from 'react-apexcharts'

export type LevelProps = {
  level: number
  rate: number
}

export const Level: React.VFC<LevelProps> = ({ level, rate }) => {
  const intRate = Number(String(rate).split('.')[0])
  const flootRate = Number('0.' + String(rate).split('.')[1])
  const series = [
    {
      data: [flootRate * 100],
    },
  ]
  const options = {
    chart: {
      type: 'bar' as ApexChart['type'],
      height: 200,
      width: 200,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['経験値'],
      max: 100,
      labels: {
        style: { fontSize: '16px' },
      },
    },
    yaxis: {
      max: 100,
      labels: {
        style: { fontSize: '15px' },
      },
    },
  }
  return (
    <div className='bg-white border rounded-lg drop-shadow-md p-5 m-2 h-90'>
      <div className='w-full'>
        <h1 className='not-italic p-6 text-4xl'>
          現在のレベルは&nbsp;Lv.<span className='mx-3 text-8xl'>{level + intRate}</span>です
        </h1>
        <Chart options={options} series={series} type='bar' height='150' />
      </div>
    </div>
  )
}
