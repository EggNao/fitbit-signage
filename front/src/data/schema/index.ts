import { roomCollection } from './room'
import { userCollection } from './user'

export const firebaseRef = {
  user: {
    parent: userCollection,
  },
  room: {
    parent: roomCollection,
  },
}
