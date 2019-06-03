const Mam = require('/home/karthik/mam/scripts/mam.node.js');
const IOTA = require('iota.lib.js');
const iota = new IOTA({ provider: 'https://nodes.devnet.iota.org:443' });

let seed = 'VUHVKNKYIMHQWVTYEVNPAEQEUVRYAJJKYZBELOEXVBPGUZQUCGOZAWAJBMIYARAOACJYLCPMETKWWVQZT';

let mamState = Mam.init(iota,seed,1);

async function fetchStartCount(){
    let trytes = iota.utils.toTrytes('START');
    let message = Mam.create(mamState, trytes);
    console.log('The first root:');
    console.log(message.root);
    console.log();
    mam=Mam.subscribe(mamState,message.root)
    console.log(mam)
    //execute(message.root);
    // Fetch all the messages upward from the first root.
    //return await Mam.fetch(message.root, 'public', null, null);
}



fetchStartCount();
