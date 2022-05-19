import { ComponentMeta, ComponentStory } from '@storybook/react'

import { CommentCard, commentCardProps } from '~/components/commentCard'

export default {
  title: 'Components/commentCard',
  component: CommentCard,
} as ComponentMeta<typeof CommentCard>

const Template: ComponentStory<typeof CommentCard> = (args) => <CommentCard {...args} />
const defaultArgs: commentCardProps = {
  move: 'run',
  time: 30,
}

export const Default = Template.bind({})
Default.storyName = 'ボタン'
Default.args = defaultArgs
