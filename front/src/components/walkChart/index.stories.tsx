import { ComponentMeta, ComponentStory } from '@storybook/react'

import { WalkChart, WalkChartProps } from '~/components/walkChart'

export default {
  title: 'Components/WalkChart',
  component: WalkChart,
} as ComponentMeta<typeof WalkChart>

const Template: ComponentStory<typeof WalkChart> = (args) => <WalkChart {...args} />
const defaultArgs: WalkChartProps = {
  stepsArray: {
    goals: [123, 342, 455, 344, 544, 325, 154, 365, 344, 423, 212, 223, 312, 432, 212],
    steps: [133, 311, 441, 341, 121, 451, 341, 551, 133, 451, 134, 0, 0, 0, 0, 0],
  },
}

export const Default = Template.bind({})
Default.storyName = 'ボタン'
Default.args = defaultArgs
