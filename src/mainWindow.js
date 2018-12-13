// Modules
const { BrowserWindow } = require('electron');

// BrowserWindow instance (analog to `let mainWindow;` in example project)
let win;
exports.win = win;

// mainWindow createWindow function
exports.createWindow = () => {
    this.win = new BrowserWindow({
        width: 500,
        height: 650,
        minWidth: 350,
        maxWidth: 650,
        minHeight: 310
    });

    // Devtools
    this.win.webContents.openDevtools();

    // Load main window content
    this.win.loadURL(`file://${__dirname}/renderer/main.html`);

    // Handle window closed event
    this.win.on('closed', () => {
        this.win = null;
    });
}