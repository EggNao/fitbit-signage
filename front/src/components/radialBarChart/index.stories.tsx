import { ComponentMeta, ComponentStory } from '@storybook/react'

import { RadialBarChart, RadialBarChartProps } from '~/components/radialBarChart'

export default {
  title: 'Components/RadialBarChart',
  component: RadialBarChart,
} as ComponentMeta<typeof RadialBarChart>

const Template: ComponentStory<typeof RadialBarChart> = (args) => <RadialBarChart {...args} />
const defaultArgs: RadialBarChartProps = {
  radial: {
    walk: [40],
    sleep: [87],
    calorie: [95],
  },
  scoreType: 'walk',
  color: 'purple',
}

export const Default = Template.bind({})
Default.storyName = 'チャート'
Default.args = defaultArgs
