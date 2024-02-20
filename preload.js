// This file is loaded before the renderer process is loaded
// 预加载脚本，可以在此文件中调用 node.js 的 API，但不能直接在渲染进程中调用，以防止远程代码执行漏洞，例如在渲染进程中调用 require('electron')。


// window.addEventListener('DOMContentLoaded', () => {
// 	const replaceText = (selector, text) => {
// 		const element = document.getElementById(selector)
// 		if (element) element.innerText = text
// 	}

// 	for (const type of ['chrome', 'node', 'electron']) {
// 		replaceText(`${type}-version`, process.versions[type])
// 	}
// })

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
	node: process.versions.node,
	chrome: process.versions.chrome,
	electron: process.versions.electron,
	// 通过 ipcRenderer.invoke() 方法调用主进程中的处理程序
	ping: () => ipcRenderer.invoke('ping')
})

contextBridge.exposeInMainWorld('app', {
	title: 'MY Electron App',
	version: '1.0.0'
})

