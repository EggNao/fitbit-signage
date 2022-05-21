import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-location'

import { useRoot } from './hook'

import { CommentCard } from '~/components/commentCard'
import { Level } from '~/components/level'
import { LineChartCard } from '~/components/lineChartCard'
import { RadialBarChartCard } from '~/components/radialBarChartCard'
import { WalkChartCard } from '~/components/walkChartCard'
import { PATH } from '~/router/path'

export type TodayMoveDataType = {
  calorie: number
  sleep: number
  steps: number
}

export type GoalsType = {
  calorie: number
  sleep: number
  steps: number
}

export type RankType = {
  level: number
  rate: number
}

export type WeekMoveDataType = {
  dataArray: {
    steps: number[]
    sleep: number[]
    calorie: number[]
  }
  dateArray: string[]
}

export type StampType = {
  dateArray: string[]
  stamp: boolean[]
}

export type TodayStepsType = {
  goals: number[]
  steps: number[]
}

export type RecommendType = {
  exercise: 'run' | 'fastwalk' | 'cycling' | 'training' | 'walk' | 'done'
  time: number
}

export const RootPage: React.VFC = () => {
  const [name, setName] = useState<string>('江口直輝さん')

  const [todayMoveData, setTodayMoveData] = useState<TodayMoveDataType>({ calorie: 0, sleep: 0, steps: 0 })
  const [goals, setGoals] = useState<GoalsType>({ calorie: 0, sleep: 0, steps: 0 })
  const [rank, setRank] = useState<RankType>({ level: 1, rate: 2.3 })
  const [weekMoveData, setWeekMoveData] = useState<WeekMoveDataType>({
    dataArray: {
      steps: [0, 0, 0, 0, 0, 0, 0],
      sleep: [0, 0, 0, 0, 0, 0, 0],
      calorie: [0, 0, 0, 0, 0, 0, 0],
    },
    dateArray: ['0', '1', '2', '3', '4', '5', '6'],
  })
  const [stamp, setStamp] = useState<StampType>({
    dateArray: ['0', '1', '2', '3', '4', '5', '6'],
    stamp: [false, false, false, false, false, false, false],
  })
  const [todaySteps, setTodaySteps] = useState<TodayStepsType>({
    goals: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  })
  const [recommend, setRecommend] = useState<RecommendType>({ exercise: 'run', time: 30 })

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get('http://localhost:8000/fitbit/9YHK8W')
        .then((response) => {
          console.log('fitbit', response.data)
          setTodayMoveData(response.data)
        })
        .catch((error) => console.log(error))
      await axios
        .get('http://localhost:8000/fitbit/goals/9YHK8W')
        .then((response) => {
          console.log('fitbit/goals', response.data)
          setGoals(response.data)
        })
        .catch((error) => console.log(error))
      await axios
        .get('http://localhost:8000/week/rank/9YHK8W')
        .then((response) => {
          console.log('fitbit/week/rank', response.data)
          setRank(response.data)
        })
        .catch((error) => console.log(error))
      await axios
        .get('http://localhost:8000/week/9YHK8W')
        .then((response) => {
          console.log('fitbit/week', response.data)
          setWeekMoveData(response.data)
        })
        .catch((error) => console.log(error))
      await axios
        .get('http://localhost:8000/week/stamp/9YHK8W')
        .then((response) => {
          console.log('fitbit/stamp', response.data)
          setStamp(response.data)
        })
        .catch((error) => console.log(error))
      await axios
        .get('http://localhost:8000/fitbit/steps/9YHK8W')
        .then((response) => {
          console.log('fitbit/steps', response.data)
          setTodaySteps(response.data)
        })
        .catch((error) => console.log(error))
      await axios
        .get('http://localhost:8000/fitbit/exercise/9YHK8W')
        .then((response) => {
          console.log('fitbit/exercise', response.data)
          setRecommend(response.data)
        })
        .catch((error) => console.log(error))
    }
    fetchData()
  }, [])

  return (
    <div className='p-2 h-screen bg-slate-100'>
      <div className='flex justify-between'>
        <h1 className='text-7xl p-8'>Good Morning！{name}！</h1>
        <CommentCard move={recommend.exercise} time={recommend.time} />
      </div>

      <div className='flex grid grid-cols-2'>
        <Level level={rank.level} rate={rank.rate} />
        <RadialBarChartCard goal={goals} value={todayMoveData} />
      </div>
      <div className='flex grid grid-cols-2'>
        <LineChartCard
          dataArray={weekMoveData.dataArray}
          dateArray={weekMoveData.dateArray}
          scoreType={'steps'}
          color={'green'}
        />
        <WalkChartCard stepsArray={todaySteps} />
      </div>
    </div>
  )
}
