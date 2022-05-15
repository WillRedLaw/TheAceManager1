/*

    This JavaScript file is in charge of controlling listening and sending methods in the Main.js file
    Works similar to renderer file but it's purpose is to listen out to a certain set of clicks to 
    help organize the file structure more. 

*/

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  };


//Variables
const {ipcRenderer} = require('electron')
const axios = require('axios');
const ipc = ipcRenderer
const maxResBtn = document.getElementById('maxResBtn')
const GenPassword = document.getElementById('GetPassword');
const mySidebar= document.getElementById('mySidebar');
const closeBtn = document.getElementById('closeBtn');
var isLeftMenuActive = true;


//Listener Close
closeBtn.addEventListener('click', () =>{
    
    ipc.send('closeApp')
    
})

//Listener Minimize
minimizeBtn.addEventListener('click', () =>{

    ipc.send('minimizeApp')
})

//Listener Maximize
maxResBtn.addEventListener('click', () =>{
    ipc.send('maximizeApp')
})

//Function for changing resolution of application
function ChangeMaxResBtn(isMaximizedApp){
    
    if(isMaximizedApp){

        maxResBtn.title = 'Restore'
        maxResBtn.classList.remove('maximizeBtn')
        maxResBtn.classList.add('restoredBtn')
    }

    else{

        maxResBtn.title = 'Maximize'
        maxResBtn.classList.remove('restoreBtn')
        maxResBtn.classList.add('maximizeBtn')

    }
}

//sender for max
ipc.on('isMaximized', () =>{
    ChangeMaxResBtn(true)
})

//sender for restore
ipc.on('isRestored', () =>{
    ChangeMaxResBtn(false)
})

showHideMenus.addEventListener('click', ()=>{
    if(isLeftMenuActive){
        mySidebar.style.width ='0px'
        document.getElementById("mySidebar").style.display = "none";
        isLeftMenuActive = false
    }
    else{
        mySidebar.style.width ='280px'
        document.getElementById("mySidebar").style.display = "block";
        isLeftMenuActive = true
    }
})

ipc.on('DeleteSession', () =>{
   axios.delete('http://localhost:3000/api/user/logout', axiosConfig,{
   })

   QuitApplication()
   async function QuitApplication(){
    ipc.send('CloseApp')
   }

})

/**
 * -------------------------------------
 */ 
 //sender for the child process
 GenPassword.addEventListener('click', () =>{
    ipc.send('PasswordRequested')
 })
 //listener than send request to server using Axios
 ipc.on('PasswordRequested', ()=>{

    //Make a request to the server to call the API to generate the user in the 
    makeRequest()
    async function makeRequest(){
        const PASSWORD = {
          method:'GET',
          url: 'http://localhost:3000/api/user/password',
          
        }
    
        let res = await axios(PASSWORD)
        document.getElementById('Change').value = res.data
        
      } 
 })

 //Save Generated Password to mongoDB database
const SavePassword = document.getElementById('SavePassword');
 SavePassword.addEventListener('click', ()=>{
     ipc.send('SendPassword');
 })

ipc.on('SavePassword', () =>{

    var PasswordTitle = document.getElementById('PasswordTitle').value;
    var PasswordEntry = document.getElementById('Change').value;

    SavePassword()
    async function SavePassword(){

        axios.post('http://localhost:3000/api/user/addPassword',{

            passwordTitle: PasswordTitle,
            password: PasswordEntry
        })

    }
    document.getElementById('PasswordTitle').value ="";
    document.getElementById('Change').value="";


});

