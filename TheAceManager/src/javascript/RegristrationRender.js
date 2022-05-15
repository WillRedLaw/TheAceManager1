//declares the ipcRenderer requiring electron. 
const axios = require('axios');
const e = require('cors');
const {ipcRenderer} = require('electron');
const res = require('express/lib/response');
const ipc = ipcRenderer

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  };

  const RegisterButton = document.getElementById('RegisterButton');
  RegisterButton.addEventListener('click', ()=>{
      ipc.send('RegisterButton')
  })

  ipc.on('RegisterReceived', ()=>{

      RegisterForm();

      async function RegisterForm(){

        var EntryName = document.getElementById('EntryName').value
        var EntryEmail = document.getElementById('EntryEmail').value
        var EntryPassword = document.getElementById('EntryPassword').value

        var body = {name: EntryName, email: EntryEmail, password: EntryPassword}

        axios.post('http://localhost:3000/api/user/register', body, axiosConfig).then(response =>{
            if(response){
                document.getElementById('Alert').innerHTML ="You have been successfully registered!"
            }
        }).catch((error)=>{
            document.getElementById('Alert').innerHTML ="You have failed registered!"
        })
      }

  })