import { LineChart } from '../lineChart'

export type LineChartCardProps = {
  dataArray: { [key: string]: number[] }
  dateArray: string[]
  scoreType: 'steps' | 'sleep' | 'calorie'
  color: 'green' | 'red' | 'orenge' | 'blue' | 'lightblue' | 'yellow' | 'purple'
}

export const LineChartCard: React.VFC<LineChartCardProps> = ({ dataArray, dateArray, scoreType, color }) => {
  return (
    <div className='border rounded-lg drop-shadow-md p-6 m-2 mx-0 bg-white'>
      <span className='text-3xl'>{scoreType}</span>
      <LineChart dataArray={dataArray} dateArray={dateArray} scoreType={scoreType} color={color} />
    </div>
  )
}
