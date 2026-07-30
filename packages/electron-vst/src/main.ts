import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// VST3 Bridge IPC
ipcMain.handle('vst:getInfo', async () => {
  return {
    name: 'ReAudio VST3',
    version: '0.1.0',
    vendor: 'ReAudio',
    uid: 0x52654155, // 'ReAu'
  };
});

ipcMain.handle('vst:sendMidi', async (_event, status: number, data1: number, data2: number) => {
  console.log(`[VST] MIDI: ${status.toString(16)} ${data1} ${data2}`);
  return true;
});

// Development
if (isDev && require('electron-is-dev')) {
  require('electron-debug')({ showDevTools: true });
}
