import dayjs from 'dayjs'
import Chart from 'react-apexcharts'

export type DataType = {
  date: string
  score: number
}

export type LineChartProps = {
  dataArray: DataType[]
  scoreType: 'walk' | 'sleep' | 'calorie'
}

export const LineChart: React.VFC<LineChartProps> = ({ dataArray, scoreType }) => {
  const walkData = dataArray.map((doc) => ({
    x: dayjs(doc.date).toDate(),
    y: doc.score,
  }))
  const sleepData = dataArray.map((doc) => ({
    x: dayjs(doc.date).toDate(),
    y: doc.score,
  }))
  const calorieData = dataArray.map((doc) => ({
    x: dayjs(doc.date).toDate(),
    y: doc.score,
  }))

  // const dataList = [
  //   {
  //     walk: {
  //       name: 'walk',
  //       data: walkData,
  //     },
  //     sleep: {
  //       name: 'sleep',
  //       data: sleepData,
  //     },
  //     calorie: {
  //       name: 'calorie',
  //       data: calorieData,
  //     },
  //   },
  // ]

  const walkataList = [{ name: 'walk', data: walkData }]
  const sleepDataList = [{ name: 'sleep', data: sleepData }]
  const calorieDataList = [{ name: 'calorie', data: calorieData }]

  const dataList = {
    walk: walkataList,
    sleep: sleepDataList,
    calorie: calorieDataList,
  }

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
      type: 'datetime' as ApexXAxis['type'],
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
