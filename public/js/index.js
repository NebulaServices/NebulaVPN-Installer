const { ipcRenderer } = require('electron');
const minimize = document.querySelector('.winBtnMin');
const maximize = document.querySelector('.winBtnMax');
const close = document.querySelector('.winBtnClose');

function loadStepOne() {
    ipcRenderer.send("loadFirstStep")
}

function customInstallDir() {
    ipcRenderer.send("openFolderPicker")
}

minimize.addEventListener('click', () => {
    console.log('minimize');
    ipcRenderer.send('minimize');
});
maximize.addEventListener('click', () => {
    ipcRenderer.send('maximize');
});
close.addEventListener('click', () => {
    ipcRenderer.send('close');
});

document.getElementById('install-btn').addEventListener('click', () => {
    loadStepOne();
})