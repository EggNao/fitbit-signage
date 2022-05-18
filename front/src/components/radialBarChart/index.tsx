import Chart from 'react-apexcharts'

export type RadialBarChartProps = {
  radial: { [key: string]: number[] } // 割合%
  scoreType: 'walk' | 'sleep' | 'calorie'
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
  const options = {
    colors: colorType[color],
    series: radial[scoreType],
    labels: [scoreType],
  }
  return (
    <div>
      <Chart type='radialBar' options={options} series={radial[scoreType]} />
    </div>
  )
}
