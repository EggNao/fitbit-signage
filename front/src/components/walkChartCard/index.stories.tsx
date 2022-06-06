import { ComponentMeta, ComponentStory } from '@storybook/react'

import { WalkChartCard, WalkChartCardProps } from '~/components/walkChartCard'

export default {
  title: 'Components/WalkChartCard',
  component: WalkChartCard,
} as ComponentMeta<typeof WalkChartCard>

const Template: ComponentStory<typeof WalkChartCard> = (args) => <WalkChartCard {...args} />
const defaultArgs: WalkChartCardProps = {
  stepsArray: {
    goals: [123, 342, 455, 344, 544, 325, 154, 365, 344, 423, 212, 223, 312, 432, 212],
    steps: [133, 311, 441, 341, 121, 451, 341, 551, 133, 451, 134, 0, 0, 0, 0, 0],
  },
}

export const Default = Template.bind({})
Default.storyName = 'チャート'
Default.args = defaultArgs
