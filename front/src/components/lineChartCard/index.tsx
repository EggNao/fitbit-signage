import { LineChart } from '../lineChart'

export type LineChartCardProps = {
  dataArray: { [key: string]: number[] }
  dateArray: string[]
  scoreType: 'steps' | 'sleep' | 'calorie'
  color: 'green' | 'red' | 'orenge' | 'blue' | 'lightblue' | 'yellow' | 'purple'
  text: string
}

export const LineChartCard: React.VFC<LineChartCardProps> = ({ dataArray, dateArray, scoreType, color, text }) => {
  return (
    <div className='border rounded drop-shadow-md p-10 m-2'>
      <span className='text-3xl'>{scoreType}</span>
      <LineChart dataArray={dataArray} dateArray={dateArray} scoreType={scoreType} color={color} />
    </div>
  )
}
