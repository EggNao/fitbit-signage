import { WalkChart } from '../walkChart'

export type WalkChartCardProps = {
  stepsArray: { [key: string]: number[] }
}

export const WalkChartCard: React.VFC<WalkChartCardProps> = ({ stepsArray }) => {
  return (
    <div className='bg-white border rounded-lg drop-shadow-md p-6 m-2'>
      <span className='text-4xl'>Today steps</span>
      <WalkChart stepsArray={stepsArray} />
    </div>
  )
}
