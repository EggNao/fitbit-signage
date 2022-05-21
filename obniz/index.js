'use strict';
import { initializeApp } from 'firebase/app'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import Obniz from "obniz";

const firebaseConfig = {
    apiKey: 'AIzaSyDr3JUJS7VvcT6vGDwM-OWIjnz_ifgfiUE',
    authDomain: 'fitbit-signage.firebaseapp.com',
    projectId: 'fitbit-signage',
    storageBucket: 'fitbit-signage.appspot.com',
    messagingSenderId: '403216664034',
    appId: '1:403216664034:web:de2a757f63aa0f980465bb',
}

const firebaseApp = initializeApp(firebaseConfig)
const firestore = getFirestore(firebaseApp)

const obniz = new Obniz("3294-6696"); // 8桁のID

obniz.onconnect = async function() {

    const target = {
        deviceAddress: ['886b0ff434b9', '588e81a55919'] // array
    };

    const setting = {
        duration: 15, // スキャン時間
        duplicate: false // 同一デバイスでも再表示
    };

    await obniz.ble.initWait();

    obniz.ble.scan.onfind = async function(peripheral){
        console.log(peripheral.address)
        console.log(peripheral.rssi)
        if (Number(peripheral.rssi) > -65){
            const docData = {
                macAdress: peripheral.address,
                createdAt: new Date(),
                rssi: peripheral.rssi
            }
            addDoc(collection(firestore, 'room'), docData)
            console.log('保存しました')
        }
    };
  
    obniz.ble.scan.onfinish = async function(peripherals, error){
      console.log("scan again")
    //   await obniz.ble.scan.startWait();
    };
  setInterval(async() => {
    await obniz.ble.scan.startWait(target, setting);
  }, 18000)
}
