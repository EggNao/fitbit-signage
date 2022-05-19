import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Level, LevelProps } from '~/components/level'

export default {
  title: 'Components/Level',
  component: Level,
} as ComponentMeta<typeof Level>

const Template: ComponentStory<typeof Level> = (args) => <Level {...args} />
const defaultArgs: LevelProps = {
  level: 33,
  rate: 2.8,
}

export const Default = Template.bind({})
Default.storyName = 'ボタン'
Default.args = defaultArgs
