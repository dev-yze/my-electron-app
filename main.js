// 主进程代码
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // 预加载脚本，可以在此文件中调用 node.js 的 API，
    // 但不能直接在渲染进程中调用，以防止远程代码执行漏洞，例如在渲染进程中调用 require('electron')。
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')
  win.webContents.openDevTools()
}


app.whenReady().then(() => {

  // 使用ipcMain.handle()方法注册一个处理程序，该处理程序将在渲染进程中使用ipcRenderer.invoke()方法调用
  ipcMain.handle('ping', () => {
    return 'pong' + new Date().getTime()
  })

  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
  // 对应用程序和它们的菜单栏来说应该时刻保持激活状态, 
  // 直到用户使用 Cmd + Q 明确退出
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

})