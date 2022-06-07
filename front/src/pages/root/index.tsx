import Slider from '@farbenmeer/react-spring-slider'
import axios from 'axios'
import { collection, connectFirestoreEmulator, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'

import Home from '~/assets/home.png'
import { CommentCard } from '~/components/commentCard'
import { Level } from '~/components/level'
import { LineChartCard } from '~/components/lineChartCard'
import { RadialBarChartCard } from '~/components/radialBarChartCard'
import { WalkChartCard } from '~/components/walkChartCard'
import { firebaseRef } from '~/data/schema'
import { firestore } from '~/plugins/firebase'
import {
  NameType,
  UserType,
  TodayMoveDataType,
  GoalsType,
  RankType,
  WeekMoveDataType,
  StampType,
  TodayStepsType,
  RecommendType,
} from '~/types/types'

export const RootPage: React.VFC = () => {
  const [name, setName] = useState<NameType | undefined>() // macaddress: name
  const [currentUserName, setCurrentUserName] = useState<string>('') // macAddress: userId
  const [macAddress, setMacAddress] = useState<string>('')
  const [isShow, setIsShow] = useState<boolean>(false)
  const [user, setUser] = useState<UserType>()

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
    goals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  })
  const [recommend, setRecommend] = useState<RecommendType>({ exercise: 'run', time: 30 })

  const [scanSet, setScanSet] = useState<string[]>([])
  const [done, setDone] = useState<string[]>([])

  const isExist = (array: string[], value: string) => {
    for (var i = 0, len = array.length; i < len; i++) {
      if (value == array[i]) {
        // 存在したらtrueを返す
        return true
      }
    }
    // 存在しない場合falseを返す
    return false
  }

  const fetchData = async (id: string) => {
    await axios
      .get(`http://localhost:8000/fitbit/${id}`)
      .then((response) => {
        console.log('fitbit', response.data)
        setTodayMoveData(response.data)
      })
      .catch((error) => console.log(error))
    await axios
      .get(`http://localhost:8000/fitbit/goals/${id}`)
      .then((response) => {
        console.log('fitbit/goals', response.data)
        setGoals(response.data)
      })
      .catch((error) => console.log(error))
    await axios
      .get(`http://localhost:8000/week/rank/${id}`)
      .then((response) => {
        console.log('fitbit/week/rank', response.data)
        setRank(response.data)
      })
      .catch((error) => console.log(error))
    await axios
      .get(`http://localhost:8000/week/${id}`)
      .then((response) => {
        console.log('fitbit/week', response.data)
        setWeekMoveData(response.data)
      })
      .catch((error) => console.log(error))
    await axios
      .get(`http://localhost:8000/week/stamp/${id}`)
      .then((response) => {
        console.log('fitbit/stamp', response.data)
        setStamp(response.data)
      })
      .catch((error) => console.log(error))
    await axios
      .get(`http://localhost:8000/fitbit/steps/${id}`)
      .then((response) => {
        console.log('fitbit/steps', response.data)
        setTodaySteps(response.data)
      })
      .catch((error) => console.log(error))
    await axios
      .get(`http://localhost:8000/fitbit/exercise/${id}`)
      .then((response) => {
        console.log('fitbit/exercise', response.data)
        setRecommend(response.data)
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    const qUser = query(collection(firestore, 'user'))
    onSnapshot(qUser, (snapshot) => {
      const userData: UserType = []
      const nameData: NameType = []
      snapshot.forEach((doc) => {
        userData.push({ [doc.data().macAddress]: doc.data().userId })
        nameData.push({ [doc.data().macAddress]: doc.data().name })
      })
      setUser(userData)
      setName(nameData)
    })
    const qRoom = query(firebaseRef.room.parent, orderBy('createdAt', 'desc'), limit(1))
    onSnapshot(qRoom, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data().macAddress
        setMacAddress(data)
        setIsShow(true)
        console.log('de')
        setTimeout(() => {
          console.log('入った')
          setIsShow(false)
        }, 10000)
      })
    })
  }, [])

  useEffect(() => {
    setIsShow(true)
    user?.forEach((doc) => {
      if (doc[macAddress] !== undefined) {
        fetchData(doc[macAddress])
      }
    })
    name?.forEach((doc) => {
      if (doc[macAddress] !== undefined) {
        setCurrentUserName(doc[macAddress])
      }
    })
  }, [macAddress])

  return (
    <div>
      {isShow && (
        <div className='p-2 h-screen bg-slate-100'>
          <div className='flex justify-between'>
            <h1 className='text-7xl p-8'>Good Morning！{currentUserName}さん！</h1>
            <CommentCard move={recommend.exercise} time={recommend.time} />
          </div>

          <div className='flex grid grid-cols-2'>
            <Level level={rank.level} rate={rank.rate} />
            <RadialBarChartCard goal={goals} value={todayMoveData} />
          </div>
          <div className='flex grid grid-cols-2'>
            <Slider activeIndex={2} auto={5000}>
              <LineChartCard
                dataArray={weekMoveData.dataArray}
                dateArray={weekMoveData.dateArray}
                scoreType={'steps'}
                color={'green'}
              />
              <LineChartCard
                dataArray={weekMoveData.dataArray}
                dateArray={weekMoveData.dateArray}
                scoreType={'sleep'}
                color={'green'}
              />
              <LineChartCard
                dataArray={weekMoveData.dataArray}
                dateArray={weekMoveData.dateArray}
                scoreType={'calorie'}
                color={'green'}
              />
            </Slider>
            <WalkChartCard stepsArray={todaySteps} />
          </div>
        </div>
      )}
      {!isShow && <img src={Home} alt='' className='h-screen' />}
    </div>
  )
}
