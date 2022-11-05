const os = require('os')
const request = require('superagent');
const admZip = require('adm-zip');
const fs = require('fs');
const { exec } = require('child_process')
const path = require('path')
const { shell, ipcRenderer } = require('electron');

let currentPlatform


/****************************HOW TO USE!******************************* 

file = The file you wish to request
fileName = The name that the file will be saved as
fileSavePath = The path (directory) that the file will be saved in

**********************************************************************/
function retrieveFile(file, fileName, fileSavePath) {
    request
    .get(file)
    .on('error', function(error) {
        console.log(error);
    })
    .pipe(fs.createWriteStream(fileName))
    .on('finish', function() {
        let oldPath = "./" + fileName
        let newPath = fileSavePath + fileName
        fs.mkdir(fileSavePath, () => {
            fs.rename(oldPath, newPath, function (err) {
                if (err) throw err
                console.log('Successfully moved to ' + newPath + "!")
            })
        })

    });
}
function getPlatform() {
    currentPlatform = os.platform();
}

getPlatform();

function customInstallDir() {
    ipcRenderer.send("openFolderPicker")
}

let installDirectory;

if (currentPlatform == "win32") {
    installDirectory = document.getElementById('currentDirectory').textContent = "C:\\Program Files\\NebulaVPN\\"
}

ipcRenderer.on('directoryUpdate', (event, message) => {
    console.log(message)
    installDirectory = document.getElementById('currentDirectory').textContent = message
})

document.getElementById('set-directory-btn').addEventListener('click', () => {
    customInstallDir();
})

document.getElementById('start-install').addEventListener('click', () => {
    startInstallation()
})
let shortcutDirectory = `C:\\Users\\${os.userInfo().username}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\`
async function startInstallation() {
    await retrieveFile("https://static.nebulacdn.xyz/downloads/nebulavpn_installer_resources/OVPN-2.6-windowsMSI/ovpn.msi", "OpenVPN.msi", "./")
    setTimeout(() => {
    exec('start OpenVPN.msi', (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
    });   
    }, 4000);

    retrieveFile("https://static.nebulacdn.xyz/downloads/nebulavpn_installer_resources/nebulavpn-latest-windows/NebulaVPN.exe", "NebulaVPN.exe", installDirectory)
    
    var shortcutDetails = {
    // Defining the target File as the 'sample.txt' File 
    target: path.join('C:\\Program Files\\NebulaVPN\\NebulaVPN.exe'),
   
    // Current Working Directory is 'assets' folder
    cwd: path.join(),
    args: "Passing Arguments",
    // Shown as Tooltip 
    description: "NebulaVPN",
       
    // Defining the icon for shortcut as the 
    // 'notepad.exe' file 
    // Instead of the System Default icon
    icon: "C://Program Files//NebulaVPN//NebulaVPN.exe", 
   
    // Keeping the default value of iconIndex for the 
    // 'notepad.exe' file icon to take effect  
    iconIndex: 0,
    appUserModelId: "",
}
    var success = shell.writeShortcutLink(path.join(__dirname, 
     '../NebulaVPN.lnk'), 'create', shortcutDetails);
   
    console.log('Shortcut Created Successfully - ', success);
}
   
