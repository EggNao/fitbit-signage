import dayjs from 'dayjs'
import Chart from 'react-apexcharts'

export type LineChartProps = {
  dataArray: { [key: string]: number[] }
  dateArray: string[]
  scoreType: 'walk' | 'sleep' | 'calorie'
  color: 'green' | 'red' | 'orenge' | 'blue' | 'lightblue' | 'yellow' | 'purple'
}

export const LineChart: React.VFC<LineChartProps> = ({ dataArray, dateArray, scoreType, color }) => {
  const walkataList = [{ name: 'walk', data: dataArray[scoreType] }]
  const sleepDataList = [{ name: 'sleep', data: dataArray[scoreType] }]
  const calorieDataList = [{ name: 'calorie', data: dataArray[scoreType] }]

  const dataList = {
    walk: walkataList,
    sleep: sleepDataList,
    calorie: calorieDataList,
  }

  const colorType = {
    green: ['#05CD99'],
    red: ['#EE5D50'],
    orenge: ['#F6866A'],
    blue: ['#3965FF'],
    lightblue: ['#6AD2FF'],
    yellow: ['#FFB547'],
    purple: ['#4318FF'],
  }

  const formatDateArray = dateArray.map((data) => {
    return dayjs(data).format('YYYY/MM/DD')
  })

  const options = {
    chart: {
      animations: {
        dynamicAnimation: {
          speed: 500,
        },
      },
    },
    colors: colorType[color],
    tooltip: {
      x: {
        format: 'YYYY/MM/DD',
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
