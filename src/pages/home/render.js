const information = document.getElementById('information');

const replaceText = (selector, text) => {
	// const element = document.getElementById(selector)
	$('#'+selector).text(text)
	// if (element) element.innerText = text
}


const created = async () => {
	// 获取版本信息
	for (const type of ['chrome', 'node', 'electron']) {
		replaceText(`${type}-version`, `v${versions[type]}`)
	}

	const response = await versions.ping()
	console.log('response: ', response)
	replaceText('rec-main-data', response)

	const title = app.title
	const version = app.version
	replaceText('app-title', title)
	replaceText('app-version', version)
}
$("#btn1").click(async function(){
	console.log('btn1')
	// let res = await versions.ping()
	await route.page_monitor()
	
})

created()