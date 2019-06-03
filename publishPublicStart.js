// Replace this with absolute path to your mam.node.js
var Mam = require('/home/karthik/eyantra/mam/scripts/mam.node.js')
let IOTA = require('iota.lib.js');
var iota = new IOTA({ provider: 'https://nodes.devnet.iota.org:443' })

const yourMessage = Math.floor((Math.random()*89)+10);

// Please supply a SEED --> 81 chars of A-Z9 //
let seed = 'XXPFRSRBABUR9QOJXMTDLSLXOXNJLPTUCGZZDODZPGUNAUJUIIAPYJFYMFXACLZWUE9JWQWJCOVMKEDPF';
 // Length: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

//let mamState = null;

/*
Author: Robert Lie (mobilefish.com)
The mam_publish.js file publishes random generated numbers on the tangle using MAM.
This file will work on a computer or Raspberry Pi.
The published data can be viewed using the mam_receive.js file or
https://www.mobilefish.com/services/cryptocurrency/mam.html (Select option: Data receiver)
Usage:
1)  You can change the default settings: MODE, SIDEKEY, SECURITYLEVEL or TIMEINTERVAL
    If you do, make the same changes in mam_receive.js file.
2)  Start the app: node mam_publish.js
More information:
https://www.mobilefish.com/developer/iota/iota_quickguide_raspi_mam.html
*/



const MODE = 'public'; // public, private or restricted
const SIDEKEY = 'mysecret'; // Enter only ASCII characters. Used only in restricted mode
const SECURITYLEVEL = 1; // 1, 2 or 3
const TIMEINTERVAL  = 30; // seconds

// Initialise MAM State
let mamState =Mam.init(iota, seed, SECURITYLEVEL);

// Set channel mode
if (MODE == 'restricted') {
    const key = iota.utils.toTrytes(SIDEKEY);
    mamState = Mam.changeMode(mamState, MODE, key);
} else {
    mamState = Mam.changeMode(mamState, MODE);
}

// Publish data to the tangle
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

const generateJSON = function() {
    // Generate some random numbers simulating sensor data
    const data = Math.floor((Math.random()*89)+10);
   // const dateTime = moment().utc().format('DD/MM/YYYY hh:mm:ss');
    const json =  data;
    return json;
}

const executeDataPublishing = async function() {
    
    


    const json = generateJSON();
    console.log("json=",json);

    const root = await publish(json);
    console.log(`a`);
}

// Start it immediately
executeDataPublishing();

setInterval(executeDataPublishing, TIMEINTERVAL*1000);
