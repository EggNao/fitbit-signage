import { RadialBarChart } from '../radialBarChart'

export type RadialBarChartCardProps = {
  radial: { [key: string]: number[] } // 割合%
}

export const RadialBarChartCard: React.VFC<RadialBarChartCardProps> = ({ radial }) => {
  return (
    <div className='border rounded drop-shadow-md p-2 m-2 flex justify-center'>
      <RadialBarChart radial={radial} scoreType={'steps'} color={'green'} />
      <RadialBarChart radial={radial} scoreType={'calorie'} color={'orenge'} />
      <RadialBarChart radial={radial} scoreType={'sleep'} color={'lightblue'} />
    </div>
  )
}
