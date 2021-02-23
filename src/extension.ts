
import * as vscode from 'vscode';
import WordApp from './words';
import { processText } from './processTxt';
import { Word } from './types';
import copyClipboard from './copyClipboard';


export function activate(context: vscode.ExtensionContext) {
	const { window, commands } = vscode;
	const { registerCommand } = commands;
	const { registerTreeDataProvider, showInformationMessage, showInputBox } = window;

	const wordApp = new WordApp();

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
		wordApp.randomData();
	});

	// 点击树item掌握单词
	let willMastering = registerCommand('yryr.willMastering', (item) => {
		wordApp.didMastered(item);
	});

	// 点击树item忘记单词
	let didMastered = registerCommand('yryr.didMastered', (item) => {
		wordApp.willMastering(item);
	});

	// 朗读
	let read = registerCommand('yryr.read', (item) => {
		showInformationMessage('朗读');
		wordApp.read(item);
	});

	context.subscriptions.push(helloWorld);
	context.subscriptions.push(debug);
	context.subscriptions.push(willMastering);
	context.subscriptions.push(didMastered);
	context.subscriptions.push(input);
	context.subscriptions.push(refresh);
	context.subscriptions.push(copy);
	context.subscriptions.push(read);

}

export function deactivate() {}
