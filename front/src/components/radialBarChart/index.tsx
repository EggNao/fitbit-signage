import Chart from 'react-apexcharts'

import calorieImg from '~/assets/calorie.svg'
import sleepImg from '~/assets/sleep.svg'
import stepsImg from '~/assets/steps.svg'

export type RadialBarChartProps = {
  scoreType: 'steps' | 'sleep' | 'calorie'
  color: 'green' | 'red' | 'orenge' | 'blue' | 'lightblue' | 'yellow' | 'purple'
  goal: { [key: string]: number }
  value: { [key: string]: number }
}

export const RadialBarChart: React.VFC<RadialBarChartProps> = ({ scoreType, color, goal, value }) => {
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

  const radial = value[scoreType] / goal[scoreType] < 1 ? Math.trunc((value[scoreType] / goal[scoreType]) * 100) : 100

  const text = { steps: 'steps', sleep: 'minutes', calorie: 'kcal' }

  const options = {
    colors: colorType[color],
    series: [radial],
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
      <Chart className='m-auto' type='radialBar' options={options} series={[radial]} />
      <h2 className='text-center text-2xl'>
        {String(value[scoreType])}&nbsp;/&nbsp;{String(goal[scoreType])}{' '}
        <span className='text-lg'>{text[scoreType]}</span>
      </h2>
    </div>
  )
}
