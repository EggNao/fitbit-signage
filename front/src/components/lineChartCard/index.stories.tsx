import { ComponentMeta, ComponentStory } from '@storybook/react'

import { LineChartCard, LineChartCardProps } from '~/components/lineChartCard'

export default {
  title: 'Components/LineChartCard',
  component: LineChartCard,
} as ComponentMeta<typeof LineChartCard>

const Template: ComponentStory<typeof LineChartCard> = (args) => <LineChartCard {...args} />
const defaultArgs: LineChartCardProps = {
  dataArray: {
    steps: [3245, 2423, 2353, 5647, 6756, 3464, 6325],
    sleep: [87, 67, 78, 98, 76, 77, 68],
    calorie: [2345, 3023, 2653, 5647, 2256, 1864, 2725],
  },
  dateArray: ['20220512', '20220513', '20220514', '20220515', '20220516', '20220517', '20220518'],
  scoreType: 'steps',
  color: 'purple',
  text: 'Steps',
}

export const Default = Template.bind({})
Default.storyName = 'チャート'
Default.args = defaultArgs
