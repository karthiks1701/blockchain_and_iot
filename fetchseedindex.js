/* This file sends and receives data to the tangle */







const Mam = require('/home/karthik/gitpush/mam/scripts/mam.node.js');
const IOTA = require('iota.lib.js');
const iota = new IOTA({ provider: 'https://nodes.devnet.iota.org:443' });
const MODE = 'public';
const SIDEKEY = 'mysecret'; 
const SECURITYLEVEL = 1;
const TIMEINTERVAL  = 30; 
let seed = '';
let json1;
let index;
let key;
let resp; 
let json;
let x=0;
let fun={};
let flag=0;
let message1;

 
 const args = process.argv;
 if(args.length !=4) 
    {
    console.log('wrong');
    } 
 else
    {
    index = args[3];
    seed= args[2];
    }

let mamState = Mam.init(iota,seed,1);



async function fetchStartCount()
 {
    
    let trytes = iota.utils.toTrytes('start');
    message1 = Mam.create(mamState, trytes);
    console.log('The first root:');
    console.log(message1.root);
    console.log('messages in stream');
    console.log();
    execute(message1.root);
 
 }


if (MODE == 'restricted') 
 {
    
    key = iota.utils.toTrytes(SIDEKEY);
    mamState = Mam.changeMode(mamState, MODE, key);
 
 } 
else 
 {
    
    mamState = Mam.changeMode(mamState, MODE);
 
 }
 
const execute = async (root) => 
 {

   
  resp = await Mam.fetchSingle(root, 'public', null);
   
   if(resp)
    {
     let json=JSON.parse(iota.utils.fromTrytes(resp.payload));
     x=x+1;
     if (index=="all")
     {console.log(json);}
     else if(x==index)
     {
      console.log(json);
      process.exit(1);
     }
      
    }
   if (!resp)
     {   
         
         process.exit(1);
     }
 
     execute(resp.nextRoot);
  
   
 }
    


fetchStartCount();


