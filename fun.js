
let seed = 'KHKMWCAR9MSZJHFCHQRWSXAEUIWKFPOWUQJOYPDXIHJUBP999EAWTSSCRDJCUCKNTZPZZWWEWLBWNPRAJ';

const Mam = require('/home/karthik/mam/scripts/mam.node.js');
const IOTA = require('iota.lib.js');
const iota = new IOTA({ provider: 'https://nodes.devnet.iota.org:443' });

const MODE = 'public'; // public, private or restricted
const SIDEKEY = 'mysecret'; // Enter only ASCII characters. Used only in restricted mode

const SECURITYLEVEL = 1; // 1, 2 or 3
const TIMEINTERVAL  = 30; // seconds
let mamState =Mam.init(iota, seed, SECURITYLEVEL);
let root=Mam.getRoot(mamState);
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


// Set channel mode
if (MODE == 'restricted') {
    key = iota.utils.toTrytes(SIDEKEY);
    mamState = Mam.changeMode(mamState, MODE, key);
} else {
    mamState = Mam.changeMode(mamState, MODE);
}

// Receive data from the tangle
const executeDataRetrieval = async function() {
    let resp = await Mam.fetch(root, MODE, keyVal, function(data) {
        let json = JSON.parse(iota.utils.fromTrytes(data));
        console.log(`data: ${json.data}`);
    });
    console.log(resp);
    resp=resp.nextRoot;
    executeDataRetrieval();
}


executeDataRetrieval();



