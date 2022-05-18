import { ComponentMeta, ComponentStory } from '@storybook/react'

import { LineChart, LineChartProps } from '~/components/lineChart'

export default {
  title: 'Components/LineChart',
  component: LineChart,
} as ComponentMeta<typeof LineChart>

const Template: ComponentStory<typeof LineChart> = (args) => <LineChart {...args} />
const defaultArgs: LineChartProps = {
  dataArray: {
    walk: [3245, 2423, 2353, 5647, 6756, 3464, 6325],
    sleep: [87, 67, 78, 98, 76, 77, 68],
    calorie: [2345, 3023, 2653, 5647, 2256, 1864, 2725],
  },
  dateArray: ['20220512', '20220513', '20220514', '20220515', '20220516', '20220517', '20220518'],
  scoreType: 'walk',
}

export const Default = Template.bind({})
Default.storyName = 'チャート'
Default.args = defaultArgs
