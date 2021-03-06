// Modules
const { app, BrowserWindow, ipcMain } =  require('electron');
const readItem = require('./readItem');
const openReader = require('./openReader');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Listen for new-item
ipcMain.on('new-item', (e, itemUrl) => {
  // Get item with readItem module
  readItem(itemUrl, item => {
    // Sent to renderer
    e.sender.send('new-item-success', item);
  });
});

// mainWindow instance
let win;

// mainWindow createWindow function
const createWindow = () => {
  win = new BrowserWindow({
      width: 500,
      height: 650,
      minWidth: 350,
      maxWidth: 650,
      minHeight: 310,
      show: false,
      icon: `${__dirname}/src/assets/icons/icon_64x64.png`
  });

  // Devtools
  // win.webContents.openDevTools();

  // Load main window content
  win.loadURL(`file://${__dirname}/renderer/main.html`);

  // Show app only when its webContent ready
  win.once('ready-to-show', () => {
    win.show();
  });

  // Handle window closed event
  win.on('closed', () => {
      win = null;
  });
}

// Listen for open-reader
ipcMain.on('open-reader', (e, data) => {
  const { url, title } = data;
  // Create a new window
  openReader(url, title, win);
});
// Listen for mark-read event and send it to renderer on main window
ipcMain.on('mark-read', (e, item) => {
  win.webContents.send('mark-read', item);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});