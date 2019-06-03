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

// Set channel mode
if (MODE == 'restricted') {
    key = iota.utils.toTrytes(SIDEKEY);
    mamState = Mam.changeMode(mamState, MODE, key);
} else {
    mamState = Mam.changeMode(mamState, MODE);
}

// Receive data from the tangle
const executeDataRetrieval = async function() {
    let resp = await Mam.fetch(root, MODE, null, function(data) {
        let json = JSON.parse(iota.utils.fromTrytes(data));
        console.log(`data: ${json.data}`);
    });
    console.log(resp);
    root=resp.nextRoot;
    executeDataRetrieval();
}


//executeDataRetrieval();

console.log(mamState);
console.log(root);
