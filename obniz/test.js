'use strict';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
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

var mac_set = new Set(); // MACアドレスを格納する集合
var ans = { key: "000000000000", rssi: -100000000 }; //RSSI値とそのBeaconのMACアドレス
var pre_mac = "000000000000";

obniz.onconnect = async function() {

    const target = {
        deviceAddress: ['886b0ff434b9', '588e81a55919', '588e81a55a18'] // array
    };

    const setting = {
        duration: 15, // スキャン時間
        duplicate: true // 同一デバイスでも再表示
    };

    await obniz.ble.initWait();

    obniz.ble.scan.onfind = async function(peripheral) {
        console.log(peripheral.address);
        console.log(peripheral.rssi);
        console.log(mac_set);
        if (Number(peripheral.rssi) > -70 && !mac_set.has(peripheral.address) && peripheral.address != pre_mac) {
            //SetにMACアドレスの追加
            mac_set.add(peripheral.address);
            // 表示するユーザ情報の更新
            if (ans.rssi < Number(peripheral.rssi)) {
                ans.key = peripheral.address;
                ans.rssi = Number(peripheral.rssi);
            }
        }
    };

    obniz.ble.scan.onfinish = async function(peripherals, error) {
        console.log("scan again")
        await obniz.ble.scan.startWait(target, setting);
    };
    //   setInterval(async() => {
    await obniz.ble.scan.startWait(target, setting);
    //   }, 18000)

    setInterval(() => {

        if (pre_mac != ans.key) {
            // firebaseに追加
            const docData = {
                macAdress: ans.key,
                createdAt: new Date(),
                rssi: ans.rssi
            };
            addDoc(collection(firestore, 'room'), docData);
            console.log(ans)
            console.log('保存しました');

            //表示したユーザのMACアドレスを記録
            pre_mac = ans.key;

            //Setと表示するユーザ情報をクリア
            mac_set.clear();
            ans.key = "000000000000";
            ans.rssi = -100000000;
        } else if (ans.key == "000000000000") {
            //表示したユーザのMACアドレスを記録
            pre_mac = ans.key;
        }
    }, 15000);
}