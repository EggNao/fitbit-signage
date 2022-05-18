import dayjs from 'dayjs'
import Chart from 'react-apexcharts'

export type DataType = {
  date: string
  score: number
}

export type LineChartProps = {
  dataArray: { [key: string]: number[] }
  dateArray: string[]
  scoreType: 'walk' | 'sleep' | 'calorie'
}

export const LineChart: React.VFC<LineChartProps> = ({ dataArray, dateArray, scoreType }) => {
  const walkataList = [{ name: 'walk', data: dataArray[scoreType] }]
  const sleepDataList = [{ name: 'sleep', data: dataArray[scoreType] }]
  const calorieDataList = [{ name: 'calorie', data: dataArray[scoreType] }]

  const dataList = {
    walk: walkataList,
    sleep: sleepDataList,
    calorie: calorieDataList,
  }

  const formatDateArray = dateArray.map((data) => {
    return dayjs(data).toDate()
  })

  const options = {
    chart: {
      animations: {
        dynamicAnimation: {
          speed: 500,
        },
      },
    },
    colors: ['#4ade80'],
    tooltip: {
      x: {
        format: 'yyyy/MM/dd',
      },
    },
    xaxis: {
      categories: formatDateArray,
    },
    yaxis: {
      title: { text: scoreType },
    },
  }
  return (
    <div>
      <Chart type='line' options={options} series={dataList[scoreType]} />
    </div>
  )
}
