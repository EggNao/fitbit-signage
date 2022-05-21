import { collection, DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase/firestore'

import { firestore } from '~/plugins/firebase'

export type UserDocument = {
  acsessToken: string
  clientId: string
  clientSecret: string
  macAddress: string
  name: string
  refreshToken: string
  userId: string
  createdAt: Date
}

const usersConverter: FirestoreDataConverter<UserDocument> = {
  toFirestore(data: UserDocument): DocumentData {
    return { ...data }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): UserDocument {
    const data = snapshot.data()
    return {
      acsessToken: data.acsessToken ?? '',
      clientId: data.clientId ?? '',
      clientSecret: data.clientSecret ?? '',
      macAddress: data.macAddress ?? '',
      name: data.name ?? '',
      refreshToken: data.refreshToken ?? '',
      userId: data.userId ?? '',
      createdAt: data.createdAt.toDate(),
    }
  },
}

/** ユーザデータ コレクションref */
export const userCollection = collection(firestore, 'room').withConverter<UserDocument>(usersConverter)
