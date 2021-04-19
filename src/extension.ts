
import * as vscode from 'vscode';
import WordApp from './words';
import WordCount from './wordCounter';
import { processText } from './processTxt';
import { Word } from './types';
import copyClipboard from './copyClipboard';


export function activate(context: vscode.ExtensionContext) {
	const { window, commands } = vscode;
	const { registerCommand } = commands;
	const { registerTreeDataProvider, showInformationMessage, showInputBox } = window;

	// 实例化wordApp
	const wordApp = new WordApp();
	// 实例化wordCount
	const wordCount = new WordCount();

	// 注册.
	registerTreeDataProvider('yryr-will-mastering', wordApp.willMasteringProvider);
	registerTreeDataProvider('yryr-mastered', wordApp.didMasteredProvider);

	// 数据录入
	let input = registerCommand('yryr.inputData', () => {
		showInputBox().then((str) => {
			const data: Array<Word> = processText(str);
			wordApp.loadData(data);
		});
	});

	// helloWorld命令
	let helloWorld = registerCommand('yryr.helloWorld', () => {
		showInformationMessage('修改了!');
	});

	// copy命令
	let copy = registerCommand('yryr.copy', () => {
		showInformationMessage('内容已经复制到剪切板中!');
		const willMasteringData = wordApp.exportWillMasteringData();
		copyClipboard(willMasteringData);
	});

	// debug测试
	let debug = registerCommand('yryr.debug', () => {
		showInformationMessage('加载视图，数据导入');
	});

	// 点击刷新
	let refresh = registerCommand('yryr.refreshEntry', () => {
		showInformationMessage('刷新');
		const data = wordApp.randomData();
		wordCount.loadData(data);
	});

	// 点击树item掌握单词
	let willMastering = registerCommand('yryr.willMastering', (item) => {
		console.log('didMastered');
		wordApp.didMastered(item);
	});

	// 点击树item忘记单词
	let didMastered = registerCommand('yryr.didMastered', (item) => {
		console.log('willMastering');
		wordApp.willMastering(item);
	});

	// 朗读
	let read = registerCommand('yryr.read', (item) => {
		console.log('触发点击', item);
		wordApp.read(item);
	});

	// 计数器
	let counter = registerCommand('yryr.counter', () => {
		// 将单词数据导入
		console.log('wordApp.willMasteringList', wordApp.willMasteringList);
		console.log('wordApp.didMasteredList', wordApp.didMasteredList);
		const data = wordApp.willMasteringList;
		wordCount.loadData(data);
	});
	let showParaphrase = registerCommand('yryr.showParaphrase', () => {
		const word = wordCount.showParaphrase();
		wordApp.read(word);
	});
	let nextWord = registerCommand('yryr.nextWord', () => {
		wordCount.nextWord();
	});
	let preWord = registerCommand('yryr.preWord', () => {
		wordCount.preWord();
	});
	let mastering = registerCommand('yryr.mastering', () => {
		const word = wordCount.mastering();
		wordApp.willMastering(word);
	});
	let notMastering = registerCommand('yryr.notMastering', () => {
		wordCount.notMastering();
	});

	context.subscriptions.push(helloWorld);
	context.subscriptions.push(debug);
	context.subscriptions.push(willMastering);
	context.subscriptions.push(didMastered);
	context.subscriptions.push(input);
	context.subscriptions.push(refresh);
	context.subscriptions.push(copy);
	context.subscriptions.push(read);
	context.subscriptions.push(counter);
	context.subscriptions.push(showParaphrase);
	context.subscriptions.push(nextWord);
	context.subscriptions.push(preWord);
	context.subscriptions.push(mastering);
	context.subscriptions.push(notMastering);
}

export function deactivate() {}
