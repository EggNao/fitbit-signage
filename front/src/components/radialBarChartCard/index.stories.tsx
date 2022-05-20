import { ComponentMeta, ComponentStory } from '@storybook/react'

import { RadialBarChartCard, RadialBarChartCardProps } from '~/components/radialBarChartCard'

export default {
  title: 'Components/RadialBarChartCard',
  component: RadialBarChartCard,
} as ComponentMeta<typeof RadialBarChartCard>

const Template: ComponentStory<typeof RadialBarChartCard> = (args) => <RadialBarChartCard {...args} />
const defaultArgs: RadialBarChartCardProps = {
  goal: { steps: 8000, calorie: 3000, sleep: 360 },
  value: { steps: 4738, calorie: 2391, sleep: 240 },
}

export const Default = Template.bind({})
Default.storyName = 'チャート'
Default.args = defaultArgs
