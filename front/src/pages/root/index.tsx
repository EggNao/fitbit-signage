import { useState } from 'react'
import { Link } from 'react-location'

import { useRoot } from './hook'

import logo from '~/assets/logo.svg'
import { Button } from '~/components/button'
import { CommentCard } from '~/components/commentCard'
import { Level } from '~/components/level'
import { LineChartCard } from '~/components/lineChartCard'
import { RadialBarChartCard } from '~/components/radialBarChartCard'
import { WalkChartCard } from '~/components/walkChartCard'
import { PATH } from '~/router/path'

export const RootPage: React.VFC = () => {
  const [name, setName] = useState<string>('江口直輝')

  return (
    <div className='p-10 h-screen bg-slate-100'>
      <h1 className='text-6xl p-4 m-2'>Good Mornig！{name}！</h1>
      <div className='flex justify-center m-5 grid grid-cols-2'>
        <div className='grow'>
          <Level level={32} rate={2.4} />
          <LineChartCard
            dataArray={{
              steps: [3245, 2423, 2353, 5647, 6756, 3464, 6325],
              sleep: [87, 67, 78, 98, 76, 77, 68],
              calorie: [2345, 3023, 2653, 5647, 2256, 1864, 2725],
            }}
            dateArray={['20220512', '20220513', '20220514', '20220515', '20220516', '20220517', '20220518']}
            scoreType={'steps'}
            color={'green'}
          />
        </div>
        <div className='grow justify-center'>
          <RadialBarChartCard
            goal={{ steps: 8000, calorie: 3000, sleep: 360 }}
            value={{ steps: 4738, calorie: 2391, sleep: 480 }}
          />
          <WalkChartCard
            stepsArray={{
              goal: [123, 342, 455, 344, 544, 325, 154, 365, 344, 423, 212, 223, 312, 432, 212],
              actual: [133, 311, 441, 341, 121, 451, 341, 551, 133, 451, 134, 0, 0, 0, 0, 0],
            }}
          />
          <CommentCard move={'run'} time={0} />
        </div>
      </div>
    </div>
  )
}
