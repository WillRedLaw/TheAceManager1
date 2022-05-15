/*

    This is the start up file for the application, here is where everything to do with the screens of the application can be controlled. 
    When the command npm start is used this is where the file path will go, it is linked to the package-json file which
    also helps to control the application. 

*/

//required variables to access file requirements. 
const { app, BrowserWindow, ipcMain } = require('electron')
const ipc = ipcMain
const {dialog} = require('electron');
var fs = require('fs');
const path = require('path')
var remote = require('electron').remote;
require('./RestfulAPI/server')
//Function declaration for the Parent Window IE the login screen you see upon start up of the application. 
function createParentWindow(){

  const ParentWindow = new BrowserWindow({

      width: 420,
      height: 720,
      frame: false,
      webPreferences: {

        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        
      },
  });

//calls the HTML file from the source folder for the Login
ParentWindow.loadFile('./src/HTML/Login.html')

ipc.on('ButtonPressed',()=>{
  ParentWindow.webContents.send('Received')
})

ipc.on('Testing',()=>{
  console.log('HERE I AM!')
})

ipc.on('closeApp', () =>{
  app.quit()
})

ipc.on('USB',()=>{
  console.log('Pressed')
  ParentWindow.webContents.send('USBSelect');
  dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
})

ipc.on('RegisterButton', ()=>{
  console.log('PRESSED')
  ParentWindow.webContents.send('RegisterReceived')
})

ipc.on('USBReadFile', ()=>{

  dialog.showOpenDialog(ParentWindow, {
    defaultPath: app.getPath("desktop"),
    buttonLabel: 'Select USB FILE',
    filters:{ name: 'All Files', extensions: ['*'] },
    properties:['openFile']
    
  }).then((result)=>{
    var filename = result.filePaths[0];

    fs.readFile(filename, (err, data) =>{
      if(err){
        console.log('An Error has occured: ' + err.message);
        return;
      }
      var Sender = data
      ParentWindow.webContents.send('USBRecieve', Sender.toString())
    })
  })
  })


//While on the parent window, it will listen out for the response "SwitchWindow", which will than call this. 
ipc.on('SwitchWindow', () =>{

  //close the current parent window
  ParentWindow.hide()
  
  //Open a child window
  app.whenReady().then(() => {
    createChildWindow()
    
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      
      createChildWindow()      

    }
  })
})
    

})

}

//The Same as the parent APP except for the child window
function createChildWindow () {
  const ChildWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    frame: false,
    webPreferences: {

        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
  
    }
  })


  //calls the mainWindow file from the source folder
  ChildWindow.loadFile('./src/HTML/mainWindow.html')
  
  //listens out to the close app command and closes the window
  ipc.on('closeApp', () =>{
    ChildWindow.webContents.send('DeleteSession')
    
  })

  //listen out to the minimize command and minimizes the window
  ipc.on('minimizeApp', () =>{
    ChildWindow.minimize()
  })

  //listens out for the maximize command and maximizes the window 
  ipc.on('maximizeApp', () => {
    if(ChildWindow.isMaximized()){
      ChildWindow.restore()
    } 

    else{
      ChildWindow.maximize();
    }
  })

  //sender for requesting a generated password
  ipc.on('PasswordRequested',()=>{
    ChildWindow.webContents.send('PasswordRequested')
  })
  
  ipc.on('RevealPassword', ()=>{
    ChildWindow.webContents.send('ShowPassword')
  })

  ipc.on('SendPassword', () =>{
    ChildWindow.webContents.send('SavePassword')
  })

  ipc.on('DeletePassword', ()=>{
    ChildWindow.webContents.send('ActiveDelete')
  })

  ipc.on('SideMenu', () => {
    ChildWindow.webContents.send('SideMenu')
  })

  ipc.on('UpdatePasswordAccount', ()=>{
    ChildWindow.webContents.send('UpdatingAccount')
  })
  //sender for max
  ChildWindow.on('maximize', () => {
    ChildWindow.webContents.send('isMaximized')
  })

  ipc.on('USBSaveFile', function(USBPassword){
    
    dialog.showSaveDialog((filename)=>{
      return;
    })

    fs.writeFile(filename, USBPassword, (err)=>{
      console.log("An error");
      return;
    })

    console.log("FILE CREATED");

  
  
  });

  //sender for restore
  ChildWindow.on('restored', () => {
    ChildWindow.webContents.send('isRestored')
    
  })
  ipc.on('Testing',()=>{
    console.log('HERE I AM!') 
  })
}

//creator function for the parent window
app.whenReady().then(() => {
  createParentWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createParentWindow()
    }
  })
})

//checker
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


