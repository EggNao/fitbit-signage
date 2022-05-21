import { collection, DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase/firestore'

import { firestore } from '~/plugins/firebase'

export type RoomDocument = {
  createdAt: Date
  macAddress: string
  rssi: number
}

const usersConverter: FirestoreDataConverter<RoomDocument> = {
  toFirestore(data: RoomDocument): DocumentData {
    return { ...data }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): RoomDocument {
    const data = snapshot.data()
    return {
      createdAt: data.createdAt ?? '',
      rssi: data.rssi ?? '',
      macAddress: data.macAdress ?? '',
    }
  },
}

/** ユーザデータ コレクションref */
export const roomCollection = collection(firestore, 'room').withConverter<RoomDocument>(usersConverter)
