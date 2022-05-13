'use strict';
import { initializeApp } from 'firebase/app'
import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore'

import { doc, setDoc } from "firebase/firestore";
import Obniz from "obniz";

const firebaseConfig = {
    apiKey: 'AIzaSyDr3JUJS7VvcT6vGDwM-OWIjnz_ifgfiUE',
    authDomain: 'fitbit-signage.firebaseapp.com',
    projectId: 'fitbit-signage',
    storageBucket: 'fitbit-signage.appspot.com',
    messagingSenderId: '403216664034',
    appId: '1:403216664034:web:de2a757f63aa0f980465bb',
}
/** Firebase App */
const firebaseApp = initializeApp(firebaseConfig)
const firestore = getFirestore(firebaseApp)

const obniz = new Obniz("3294-6696"); // 8桁のID
obniz.onconnect = async function() {
    obniz.display.print("Sencing Start!!!");

    const userMacAdress = []

    const target = {
        deviceAddress: userMacAdress // array
    };

    const setting = {
        duration: null, // スキャン時間
        duplicate: true // 同一デバイスでも再表示
    };

    await obniz.ble.initWait();

    const q = query(collection(firestore, 'user'));
    onSnapshot(q, async(querySnapshot) => {
        await obniz.ble.scan.endWait();
        querySnapshot.forEach((doc) => {
            if(userMacAdress.indexOf(doc.data().macAdress) == -1){
                userMacAdress.push(doc.data().macAdress)
            };
        });
        await obniz.ble.initWait();
        obniz.ble.scan.onfind = async function(peripheral){
            console.log(peripheral.address)
        };
        await obniz.ble.scan.startWait(target, setting);
    })
}
