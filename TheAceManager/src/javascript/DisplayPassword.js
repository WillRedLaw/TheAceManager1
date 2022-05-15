const axios = require('axios');
const {ipcRenderer} = require('electron');
const { data } = require('jquery');
const Password = require('../RestfulAPI/model/Password');
const ipc = ipcRenderer
const maxResBtn = document.getElementById('maxResBtn')
const mySidebar= document.getElementById('mySidebar');
const closeBtn = document.getElementById('closeBtn');
var isLeftMenuActive = true;

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  }

  const Load = document.getElementById('LoadButton');
  Load.addEventListener('click', ()=>{
    ipc.send('SendPassword')
    Load.disabled='true';
    Load.style.background="red"
  })

  ipc.on('SavePassword', ()=>{
    var Delete = document.getElementById('DeleteButton');
    var Edit = document.getElementById('EditButton');
    var Show = document.getElementById('ShowButton');
    axios.get('http://localhost:3000/api/user/showPasswords').then(function (response){ 
    EntryTable(response.data)
    Delete.removeAttribute('disabled');
    Edit.removeAttribute('disabled');
    Show.removeAttribute('disabled');
    })
  })

function EntryTable(data){
    var table = document.getElementById('TheTableBody')

    for(var i = 0; i < data.length; i++){

        var row = `
                    <tr id="rows">
                        <td>${[i+1]}</td>
                        <td class="PasswordTitle">${data[i].passwordTitle}</td>
                        <td class="EncryptedPassword">************</td>
                        <td>
                            <button id="SelectPassword" class="btn btn-sm btn-success SelectButton">Select Password</button>
                        </td>                
                    </tr>`

        table.innerHTML +=row
    }             
}

const ShowButton = document.getElementById('ShowButton');
ShowButton.addEventListener('click', ()=>{
    ipc.send('RevealPassword');
})

ipc.on('ShowPassword', ()=>{
    var Change="failed"
    var PasswordTitle = document.getElementById('ActionPasswordTitle').value;
    DecryptPassword();
    async function DecryptPassword(){
        axios.post('http://localhost:3000/api/user/decryptPassword', {
            passwordTitle: PasswordTitle,
        }).then((response)=>{
            Change = response.data
            document.getElementById('ActionPassword').value = Change
        }).catch(console.error(err));       
    }
})

 //TEST
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



