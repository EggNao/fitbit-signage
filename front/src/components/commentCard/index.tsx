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
    <div className='bg-white border rounded-lg drop-shadow-md m-4 p-4'>
      <h1 className='underline underline-offset-8 m-2 pt-2 pr-3 pb-1 text-4xl'>Recommend</h1>
      <h1 className='text-base mt-2 mb-4 ml-4 text-2xl'>
        あなたは
        <span className='text-4xl'>&nbsp;{moveType[move]}&nbsp;</span>を&nbsp;
        <span className='text-4xl'>{time}&nbsp;</span>分 することで 今日の目標を達成できます！
      </h1>
    </div>
  )
}
