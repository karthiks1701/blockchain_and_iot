/*
Author: Robert Lie (mobilefish.com)
The mam_receive.js file extracts stored data from the tangle using MAM.
This extracted data will be displayed on the screen.
This file will work on a computer or Raspberry Pi.
Instead of this file you can also use another tool to display the data:
https://www.mobilefish.com/services/cryptocurrency/mam.html (Select option: Data receiver)
Usage:
1)  You can change the default settings: MODE or SIDEKEY
    If you do, make the same changes in mam_publish.js and mam_sensor.js files.
2)  Start the app: node mam_receive.js <root>
More information:
https://www.mobilefish.com/developer/iota/iota_quickguide_raspi_mam.html

*/

let seed = 'SXPRRGDBGGV9MAAXW9FNTIYRCCYWWWXFCKLAEIDTAMYTXEZDOOPXDKYXV9UTMUVHNFIOTRYCMKPDWFKXY';

const Mam = require('/home/karthik/eyantra/mam/scripts/mam.node.js');
const IOTA = require('iota.lib.js');
const iota = new IOTA({ provider: 'https://nodes.devnet.iota.org:443' });

const MODE = 'public'; // public, private or restricted
const SIDEKEY = 'mysecret'; // Enter only ASCII characters. Used only in restricted mode

const SECURITYLEVEL = 1; // 1, 2 or 3
const TIMEINTERVAL  = 30; // seconds

let root;
let key;

// Check the arguments
const args = process.argv;
if(args.length !=3) {
    console.log('Missing root as argument: node mam_receive.js <root>');
    process.exit();
} else if(!iota.valid.isAddress(args[2])){
    console.log('You have entered an invalid root: '+ args[2]);
    process.exit();
} else {
    root = args[2];
}

// Initialise MAM State
let mamState =Mam.init(iota, seed, SECURITYLEVEL);

// Set channel mode
if (MODE == 'restricted') {
    key = iota.utils.toTrytes(SIDEKEY);
    mamState = Mam.changeMode(mamState, MODE, key);
} else {
    mamState = Mam.changeMode(mamState, MODE);
}

// Receive data from the tangle
const executeDataRetrieval = async function(rootVal, keyVal) {
    let resp = await Mam.fetch(rootVal, MODE, keyVal, function(data) {
        let json = JSON.parse(iota.utils.fromTrytes(data));
        console.log(`data: ${json.data}`);
    });

    executeDataRetrieval(resp.nextRoot, keyVal);
}

const generateJSON = function() {
    // Generate some random numbers simulating sensor data
    const data = Math.floor((Math.random()*89)+10);
   // const dateTime = moment().utc().format('DD/MM/YYYY hh:mm:ss');
    const json = {"data": data};
    return json;
}

const publish = async function(packet) {
    // Create MAM Payload
    const trytes = iota.utils.toTrytes(JSON.stringify(packet));
    const message = Mam.create(mamState, trytes); // this function is creating a new root everytime??
                                                  //yes      
    // Save new mamState
    mamState = message.state;
    console.log('Root: ', message.root);
    
    console.log('Address: ', message.address);

    
    
    // Attach the payload.
    await Mam.attach(message.payload, message.address);

    return message.root;
}

const executeDataPublishing = async function() {
    
    


    const json = generateJSON();
    console.log("json=",json);

    const root = await publish(json);
    console.log(`data: ${json.data}, root: ${root}`);
}



executeDataPublishing();

setInterval(executeDataPublishing, TIMEINTERVAL*1000);

