/*

The Renderer job is to upon start up of the application, 
is to run any of the important files such as the express server. 

*/

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  };


//declares the ipcRenderer requiring electron. 
const axios = require('axios');
const {ipcRenderer} = require('electron');
const res = require('express/lib/response');
const ipc = ipcRenderer

//When the application is listening out for the click, it will send out the switch window function listened too in main.js
const LoginButton = document.getElementById('LoginButton');
LoginButton.addEventListener('click', () =>{
    ipc.send('ButtonPressed')
 })

 var NFCCode;
 var USBCode;

ipc.on('Received', ()=>{

    SendPostLogin();
    
    async function SendPostLogin(){
        var Email = document.getElementById('EmailID').value;
        var Password = document.getElementById('EnteredPassword').value;

        var body = {email:Email, password:Password, NFC: NFCCode, USB: USBCode}
            
        axios.post('http://localhost:3000/api/user/login', body, axiosConfig).then(response =>{
            if(response ="success"){
                ipc.send("SwitchWindow");
                StartSession();
            }
        })
        .catch((error)=>{
            document.getElementById('FailedLogin').innerHTML ="You have failed to login!"
        })
    }
    
    async function StartSession(){
        const SESSION = {
            method: 'GET',
            url: 'http://localhost:3000/api/user/SessionStart',
        }

        await axios(SESSION)

    }

})

const ExitButton = document.getElementById('ExitButton');
ExitButton.addEventListener('click', () =>{
    ipc.send('closeApp');
})

ipc.on('USBSelect', ()=>{
    ipc.send('Testing');
    
})

const USBButton = document.getElementById('USBButton');
USBButton.addEventListener('click', ()=>{
    ipc.send('USBReadFile');
})

ipc.on('USBRecieve', function(event, Sender){
    
    if(Sender.includes("THIS IS WORKING!")){
        USBButton.style.background="GREEN"
        USBCode = true;
    }
    
})  

const NFC = document.getElementById('NFCButton');
NFC.addEventListener('click', ()=>{
    NFC.style.background="GREEN"
    NFCCode = true;
})