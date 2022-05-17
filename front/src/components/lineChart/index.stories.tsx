import { ComponentMeta, ComponentStory } from '@storybook/react'

import { LineChart, LineChartProps } from '~/components/lineChart'

export default {
  title: 'Components/LineChart',
  component: LineChart,
} as ComponentMeta<typeof LineChart>

const Template: ComponentStory<typeof LineChart> = (args) => <LineChart {...args} />
const defaultArgs: LineChartProps = {
  dataArray: [
    {
      date: '20220512',
      score: 5032,
    },
    {
      date: '20220513',
      score: 3845,
    },
    {
      date: '20220514',
      score: 10684,
    },
    {
      date: '20220515',
      score: 2048,
    },
    {
      date: '20220516',
      score: 6970,
    },
    {
      date: '20220517',
      score: 4058,
    },
    {
      date: '20220518',
      score: 3857,
    },
  ],
  scoreType: 'walk',
}

export const Default = Template.bind({})
Default.storyName = 'チャート'
Default.args = defaultArgs
