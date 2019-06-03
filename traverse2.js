/* This file is used for sending data to the tangle and shows all the data before that ...*/

   






const Mam = require('/home/karthik/eyantra/mam/scripts/mam.node.js');
const IOTA = require('iota.lib.js');
const iota = new IOTA({ provider: 'https://nodes.devnet.iota.org:443' });
let seed = 'NMHRXUKDDFDCWRORQRSKDCMTSYNQFHOQNSEPMWTWMABEAREEFLHYJLZDREDKOYMGAX9VBQ9XEIQXBB9CE';
const MODE = 'public';        
const SIDEKEY = 'mysecret';           
const SECURITYLEVEL = 1;          
const TIMEINTERVAL  = 30;       
let mamState = Mam.init(iota,seed,1);
let mamState1=null;
let key;
let resp; 
let x=0;
let fun=[];
 





async function fetchStartCount()
    {
    let trytes = iota.utils.toTrytes('START');
    let message = Mam.create(mamState, trytes);
    console.log('The first root:');
    console.log(message.root);
    console.log();
     mamState1=Mam.init(iota,undefined,1);
    execute(message.root);
    }




const generateJSON = function() 
    {
    const data = Math.floor((Math.random()*89)+10);
    const json =  data;
    console.log("attaching  ");
    console.log(data)
    return json;
    }

const publish = async function(packet) 
    {
    const trytes = iota.utils.toTrytes(JSON.stringify(packet));
    const message = Mam.create(mamState1,trytes);                                                        
    mamState1 = message.state;
    await Mam.attach(message.payload,message.root);
    console.log("attached")
    return message.root;
    }

const executeDataPublishing = async function(json3) 
    {
    const root = await publish(json3);
    console.log(`a`);
    }


const foor = function()

{
    console.log(mamState1);
}




const execute = async (root) => 
   {
   resp = await Mam.fetchSingle(root, 'public', null);
   if (resp)
   {
            //console.log(resp);
            let json=JSON.parse(iota.utils.fromTrytes(resp.payload));
            executeDataPublishing(json)
            console.log(json);
            x=x+1;
         
   }
   if (!resp)
   {
            console.log("messages_in_stream_till_now_over");
            console.log(x);
            const json1 = generateJSON();
            executeDataPublishing(json1);
            setInterval(foor(),30000);
            
            process.exit(1);
   }
 
     setInterval(execute(resp.nextRoot), 30000);
  
   
}
    


fetchStartCount();


