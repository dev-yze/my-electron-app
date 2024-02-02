const information = document.getElementById('information');

const replaceText = (selector, text) => {
	const element = document.getElementById(selector)
	if (element) element.innerText = text
}


for (const type of ['chrome', 'node', 'electron']) {
	replaceText(`${type}-version`, `v${versions[type]}`)
}

const func = async () => {
	const response = await versions.ping()
	console.log('response: ', response)
	replaceText('rec-main-data', response)
}

func()