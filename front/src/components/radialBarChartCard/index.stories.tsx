import { ComponentMeta, ComponentStory } from '@storybook/react'

import { RadialBarChartCard, RadialBarChartCardProps } from '~/components/radialBarChartCard'

export default {
  title: 'Components/RadialBarChartCard',
  component: RadialBarChartCard,
} as ComponentMeta<typeof RadialBarChartCard>

const Template: ComponentStory<typeof RadialBarChartCard> = (args) => <RadialBarChartCard {...args} />
const defaultArgs: RadialBarChartCardProps = {
  radial: {
    steps: [40],
    sleep: [87],
    calorie: [95],
  },
}

export const Default = Template.bind({})
Default.storyName = 'チャート'
Default.args = defaultArgs
