import clsx from 'clsx'

export type commentCardProps = {
  move: 'run' | 'fastwalk' | 'cycling' | 'training' | 'walk' | 'done'
  time: number
}

export const CommentCard: React.VFC<commentCardProps> = ({ move, time }) => {
  const moveType = {
    run: 'ランニング',
    fastwalk: '早歩き',
    cycling: 'サイクリング',
    training: '軽い筋トレ',
    walk: 'ウォーキング',
    done: '',
  }
  return (
    <div className='border rounded drop-shadow-md'>
      <h1 className='underline underline-offset-8 m-4 mb-8 text-2xl'>運動のススメ</h1>
      <h1 className='text-2xl m-5'>
        あなたは
        <br />
        <span className='text-2xl'>{moveType[move]}&nbsp;</span>を&nbsp;<span className='text-6xl'>{time}&nbsp;</span>分
        することで今日の目標を達成できます！
      </h1>
    </div>
  )
}
