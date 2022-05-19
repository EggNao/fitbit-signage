import { RadialBarChart } from '../radialBarChart'

export type RadialBarChartCardProps = {
  goal: { [key: string]: number }
  value: { [key: string]: number }
}

export const RadialBarChartCard: React.VFC<RadialBarChartCardProps> = ({ goal, value }) => {
  return (
    <div className='border rounded drop-shadow-md p-2 m-2 flex justify-center'>
      <RadialBarChart goal={goal} value={value} scoreType={'steps'} color={'green'} />
      <RadialBarChart goal={goal} value={value} scoreType={'calorie'} color={'orenge'} />
      <RadialBarChart goal={goal} value={value} scoreType={'sleep'} color={'lightblue'} />
    </div>
  )
}
