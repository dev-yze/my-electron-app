// 主进程代码
const { app, Menu, BrowserWindow, ipcMain } = require('electron')

const path = require('path')

const isMac = process.platform === 'darwin'



/**
 * 创建浏览器窗口
 */
let win = null
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    // 预加载脚本，可以在此文件中调用 node.js 的 API，
    // 但不能直接在渲染进程中调用，以防止远程代码执行漏洞，例如在渲染进程中调用 require('electron')。
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // 加载初始化页面
  win.loadFile('src/pages/home/index.html')
  // win.webContents.openDevTools()
}



/**
 * 当 Electron 完成初始化并准备创建浏览器窗口时，将调用此方法
 */
app.whenReady().then(() => {

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



/**
 * 进程通信使用ipcMain.handle()方法注册一个处理程序
 * 该处理程序将在渲染进程中使用ipcRenderer.invoke()方法调用
 */
ipcMain.handle('ping', () => {
  return 'pong' + new Date().getTime()
})

ipcMain.handle('page_monitor', () => {
  // console.log('main page_monitor')
  win.loadFile('src/pages/sys-monitor/index.html')
  return 'page_monitor'
})




/**
 * 创建菜单
 */
const template = [
  {
    label: '主页',
    click: () => { win.loadFile('src/pages/home/index.html')}
  },
  {
    label: '文件',
    submenu: [
      {label: '新建(New)', click: () => {console.log('新建')}},
      {label: '打开(Open)', click: () => {console.log('打开')}},
      {label: '保存(Save)', click: () => {console.log('新建')}},
      {type: 'separator'},
      {label: '退出(Quit)', click: () => {console.log('退出')}}
    ]
  },
  {
    label: '编辑',
    submenu: [
      { label: '撤销' },
      { label: '重做' },
      { type: 'separator' },
      { label: '剪切' },
      { label: '复制' },
      { label: '粘贴' },
    ]
  },
  {
    label: '帮助',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      },
      {
        label: 'github',
        click: async () => {
          // 在应用中打开github
          // const { shell } = require('electron')
          // await shell.openExternal('https://github.com')
          win.loadURL('https://github.com')
        }
      },
      {
        label: '关于',
        click: async () => {
          await win.loadFile('src/pages/helps/versions/index.html')
        }
      },
      {
        label: '开启调试',
        click: async () => {
          // 判断electron是否打开开发者工具
          if (!win.webContents.isDevToolsOpened()) {
            win.webContents.openDevTools()
          }
        }
      }
    ]
  }
]

// const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)

Menu.setApplicationMenu(null) // 隐藏菜单栏