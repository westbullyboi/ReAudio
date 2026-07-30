import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  vst: {
    getInfo: () => ipcRenderer.invoke('vst:getInfo'),
    sendMidi: (status: number, data1: number, data2: number) =>
      ipcRenderer.invoke('vst:sendMidi', status, data1, data2),
  },
  app: {
    version: process.env.npm_package_version,
  },
});
