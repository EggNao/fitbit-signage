import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Img, ImgProps } from '~/components/imgCard'

export default {
  title: 'Components/Img',
  component: Img,
} as ComponentMeta<typeof Img>

const Template: ComponentStory<typeof Img> = (args) => <Img {...args} />
const defaultArgs: ImgProps = {
  value: 'fat',
}

export const Default = Template.bind({})
Default.storyName = 'ボタン'
Default.args = defaultArgs
