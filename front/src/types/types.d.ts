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
