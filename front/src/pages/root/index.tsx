import axios from 'axios'
import dayjs from 'dayjs'
import { collection, connectFirestoreEmulator, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-location'

import { useRoot } from './hook'

import Home from '~/assets/home.png'
import { CommentCard } from '~/components/commentCard'
import { Level } from '~/components/level'
import { LineChartCard } from '~/components/lineChartCard'
import { RadialBarChartCard } from '~/components/radialBarChartCard'
import { WalkChartCard } from '~/components/walkChartCard'
import { firebaseRef } from '~/data/schema'
import { firestore } from '~/plugins/firebase'
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

export type UserType = {
  [s: string]: string
}[]

export type NameType = {
  [s: string]: string
}[]

export const RootPage: React.VFC = () => {
  const [name, setName] = useState<NameType | undefined>()
  const [currentUserName, setCurrentUserName] = useState<string>('')
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

  const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>()

  const [mount, setMount] = useState<boolean>(false)

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

  const usePreviousAddressValue = (value: string) => {
    const previousValue = useRef(value)
    useEffect(() => {
      previousValue.current = value
    }, [value])
    return previousValue.current
  }

  const usePreviousTimerValue = (value: NodeJS.Timeout | undefined) => {
    const previousValue = useRef(value)
    useEffect(() => {
      previousValue.current = value
    }, [value])
    return previousValue.current
  }

  const PreviousMacAddress = usePreviousAddressValue(macAddress)
  const PreviousTimerId = usePreviousTimerValue(timerId)

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
        const timer = setTimeout(() => {
          setIsShow(false)
        }, 10000)
        setTimerId(timer)
      })
    })
  }, [])

  useEffect(() => {
    setIsShow(true)
    console.log(user)
    console.log(macAddress)
    user?.forEach((doc) => {
      if (PreviousMacAddress !== macAddress && doc[macAddress] !== undefined) {
        fetchData(doc[macAddress])
      }
      clearTimeout(PreviousTimerId!)
    })
    name?.forEach((doc) => {
      if (doc[macAddress] !== undefined) {
        console.log(doc[macAddress])
        setCurrentUserName(doc[macAddress])
      }
    })
  }, [macAddress])

  useEffect(() => {
    name?.forEach((obj) => {
      console.log(obj[macAddress])
    })
    console.log('aaa')
    console.log(name)
  }, [name])

  return (
    <div>
      {isShow === true && (
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
            <LineChartCard
              dataArray={weekMoveData.dataArray}
              dateArray={weekMoveData.dateArray}
              scoreType={'steps'}
              color={'green'}
            />
            <WalkChartCard stepsArray={todaySteps} />
          </div>
        </div>
      )}
      {isShow === false && <img src={Home} alt='' className='h-screen' />}
    </div>
  )
}
