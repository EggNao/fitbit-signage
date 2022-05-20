import { ComponentMeta, ComponentStory } from '@storybook/react'

import { RadialBarChart, RadialBarChartProps } from '~/components/radialBarChart'

export default {
  title: 'Components/RadialBarChart',
  component: RadialBarChart,
} as ComponentMeta<typeof RadialBarChart>

const Template: ComponentStory<typeof RadialBarChart> = (args) => <RadialBarChart {...args} />
const defaultArgs: RadialBarChartProps = {
  scoreType: 'steps',
  color: 'purple',
  goal: { steps: 8000, calorie: 3000, sleep: 360 },
  value: { steps: 4738, calorie: 2391, sleep: 480 },
}

export const Default = Template.bind({})
Default.storyName = 'チャート'
Default.args = defaultArgs
