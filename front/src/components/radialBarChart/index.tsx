import Chart from 'react-apexcharts'

import calorieImg from '~/assets/calorie.svg'
import sleepImg from '~/assets/sleep.svg'
import stepsImg from '~/assets/steps.svg'

export type RadialBarChartProps = {
  radial: { [key: string]: number[] } // 割合%
  scoreType: 'steps' | 'sleep' | 'calorie'
  color: 'green' | 'red' | 'orenge' | 'blue' | 'lightblue' | 'yellow' | 'purple'
}

export const RadialBarChart: React.VFC<RadialBarChartProps> = ({ radial, scoreType, color }) => {
  const colorType = {
    green: ['#05CD99'],
    red: ['#EE5D50'],
    orenge: ['#F6866A'],
    blue: ['#3965FF'],
    lightblue: ['#6AD2FF'],
    yellow: ['#FFB547'],
    purple: ['#4318FF'],
  }
  const imgSrc = { steps: stepsImg, sleep: sleepImg, calorie: calorieImg }

  const options = {
    colors: colorType[color],
    series: radial[scoreType],
    labels: [scoreType],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: '70%',
          image: imgSrc[scoreType],
          imageWidth: 64,
          imageHeight: 64,
          imageClipped: false,
        },
        dataLabels: {
          name: {
            show: false,
            color: '#fff',
          },
          value: {
            show: true,
            color: '#333',
            offsetY: 70,
            fontSize: '22px',
          },
        },
      },
    },
  }
  return (
    <div>
      <Chart type='radialBar' options={options} series={radial[scoreType]} />
    </div>
  )
}
