const {ipcRenderer} = require('electron');
const ipc = ipcRenderer
const bcrypt = require('bcryptjs');
const axios = require('axios');
const maxResBtn = document.getElementById('maxResBtn')
const mySidebar= document.getElementById('mySidebar');
const closeBtn = document.getElementById('closeBtn');
var isLeftMenuActive = true;

var USBPassword;

let axiosConfig = {
  headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      "Access-Control-Allow-Origin": "*",
  }
}

const USBLogin = document.getElementById('USBLogin');
USBLogin.addEventListener('click', ()=>{
    GeneratePASSWORD()
    ipc.send('USBSaveFile', USBPassword);
})

async function GeneratePASSWORD(){
    makeRequest()
    async function makeRequest(){
        const PASSWORD = {
          method:'GET',
          url: 'http://localhost:3000/api/user/password',
          
        }
    
        let res = await axios(PASSWORD)
        USBPassword = res;
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(USBPassword, salt);
        USBPassword = hashPassword
        
      } 

}

const UpdatePassword = document.getElementById('UpdatePassword');
UpdatePassword.addEventListener('click', ()=>{
  ipc.send('UpdatePasswordAccount');
});


ipc.on('UpdatingAccount', ()=>{
  var newPassword = document.getElementById('NewPassword').value;
  console.log(newPassword)
  EDIT()
  async function EDIT(){
    axios.patch('http://localhost:3000/api/user/UpdateUserPassword',
    {password: newPassword},)};

    document.getElementById('NewPassword').value = "";
});

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


  





