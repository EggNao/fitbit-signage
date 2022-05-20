import { RadialBarChart } from '../radialBarChart'

export type RadialBarChartCardProps = {
  goal: { [key: string]: number }
  value: { [key: string]: number }
}

export const RadialBarChartCard: React.VFC<RadialBarChartCardProps> = ({ goal, value }) => {
  return (
    <div className='bg-white border rounded-lg drop-shadow-md p-2 m-2 flex justify-center'>
      <div className='w-1/3'>
        <RadialBarChart goal={goal} value={value} scoreType={'steps'} color={'green'} />
      </div>
      <div className='w-1/3'>
        <RadialBarChart goal={goal} value={value} scoreType={'calorie'} color={'orenge'} />
      </div>
      <div className='w-1/3'>
        <RadialBarChart goal={goal} value={value} scoreType={'sleep'} color={'lightblue'} />
      </div>
    </div>
  )
}
