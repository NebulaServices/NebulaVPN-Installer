const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path')
const fs = require('fs')

let publicDirectory = "./public"

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 850,
    darkTheme: true,
    roundedCorners: true,
    thickFrame: false,
    backgroundColor: '#000000',
    title: "NebulaVPN",
    scrollBounce: true,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
    icon: path.join(__dirname, 'favicon.ico'),
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(publicDirectory, 'index.html'));

  // mainWindow.webContents.openDevTools();
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
  });

  ipcMain.on("minimize", () => {
    mainWindow.minimize();
  });

  ipcMain.on("maximize", () => {
    if(mainWindow.isMaximized()) {
      mainWindow.webContents.send("changeIr");
      mainWindow.restore();
    } else {
      mainWindow.webContents.send("changeImx");
      mainWindow.maximize();
    }
  });

  ipcMain.on("close", () => {
    mainWindow.close();
  });
  let platform;
  let appdataFolder;

  ipcMain.on("loadFirstStep", () => {
    mainWindow.loadFile(path.join(publicDirectory, 'step1.html'));
  })

  ipcMain.on("loadFirstStep", () => {
    mainWindow.loadFile(path.join(publicDirectory, 'step1.html'));
  })

let dir;

  ipcMain.on("openFolderPicker", async () => {
    dir = await dialog.showOpenDialog(mainWindow, {

        properties: ['openDirectory']

    });

    mainWindow.webContents.send('directoryUpdate', dir.filePaths.toString())
  })
  ipcMain.on("deleteNebulaVPNFolder", () => {
    fs.rmdir("NebulaVPN", () => {})
  })
};


app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});