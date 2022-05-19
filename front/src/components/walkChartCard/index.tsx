import { WalkChart } from '../walkChart'

export type WalkChartCardProps = {
  stepsArray: { [key: string]: number[] }
}

export const WalkChartCard: React.VFC<WalkChartCardProps> = ({ stepsArray }) => {
  return (
    <div className='border rounded drop-shadow-md p-10 m-2'>
      <span className='text-3xl'>Today steps</span>
      <WalkChart stepsArray={stepsArray} />
    </div>
  )
}
