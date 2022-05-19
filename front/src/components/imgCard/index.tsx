import clsx from 'clsx'

import fat from '~/assets/fat.png'
import muscul from '~/assets/muscul.png'
import normal from '~/assets/normal.png'

export type ImgProps = {
  value: 'muscul' | 'normal' | 'fat'
}

export const Img: React.VFC<ImgProps> = ({ value }) => {
  const imgSrc = { muscul: muscul, normal: normal, fat: fat }
  return (
    <div className='border rounded drop-shadow-md p-10 w-2/5'>
      <h1 className='text-2xl text-center'>今日の運動量だとあなたは．．．</h1>
      <img src={imgSrc[value]} className='h-64 my-6 m-auto' />
    </div>
  )
}
