import * as vscode from 'vscode';
import WordProvider from './wordProvider';
import { Word } from './types';
import readPanel from './webview';


class Words {
    public wordList: Array<Word>;
    // 还没掌握的单词
    public willMasteringList: Array<Word>;
    // 掌握的单词
    public didMasteredList: Array<Word>;
    // 暴露给外界.
    public willMasteringProvider;
    public didMasteredProvider;

    constructor() {
        this.willMasteringProvider = new WordProvider('yryr.read');
        this.didMasteredProvider = new WordProvider('yryr.read');
        this.wordList = [];
        this.willMasteringList = [];
        this.didMasteredList = [];
    }

    // 初次加载数据到里面
    loadData(data: Array<Word>) {
        this.wordList = data;
        this.willMasteringList = data;
        this.willMasteringProvider.loadData(data);
        this.didMasteredList = [];
        this.didMasteredProvider.loadData([]);
        this.refresh();
    }

    // 导出未掌握的数据
    exportWillMasteringData() {
        return JSON.stringify(this.willMasteringList);
    }

    // 打乱陌生的单词
    randomData() {
        const arr = this.willMasteringList;
        for (let i = 1; i < arr.length; i++) {
            const random = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[random]] = [arr[random], arr[i]];
        }
        this.refresh();
        return arr;
    }

    // 更新数据
    updateData() {
        // 添加新数据
        this.willMasteringProvider.loadData(this.willMasteringList);
        this.didMasteredProvider.loadData(this.didMasteredList);
    }

    // 触发显隐
    toggle(item: any) {
        this.willMasteringList = this.willMasteringList.map(i => {
            
            if (i.word === item.label) {
                const visibility = i.visibility === 'hidden' ? 'visible' : 'hidden';
                console.log('有相等的', visibility, {
                    ...i,
                    visibility
                });
                return {
                    ...i,
                    visibility: visibility
                };
            } else {
                console.log('不相等', i.word, item.label);
            }
            return i;
        });

        this.didMasteredList = this.didMasteredList.map(i => {
            if (i.word === item.label) {
                const visibility = i.visibility === 'hidden' ? 'visible' : 'hidden';
                console.log('有相等的', visibility, {
                    ...i,
                    visibility
                });
                return {
                    ...i,
                    visibility: visibility
                };
            } else {
                console.log('不相等', i.word, item.label);
            }
            return i;
        });
    }

    private refresh() {
        this.willMasteringProvider.refresh();
        this.didMasteredProvider.refresh();
    }

    // 陌生 => 掌握
    willMastering(item: any) {
        console.log('item', item);
        // 点击图标
        if (typeof item === 'object') {
            // 找到对应的单词
            const word: Word | undefined = this.willMasteringList.find((obj: Word) => obj.word === item.label);
            if (word) {
                // 在陌生单词中过滤掉
                this.willMasteringList = this.willMasteringList.filter(i => i.word !== item.label);
                // 掌握单词中添加上
                this.didMasteredList = this.didMasteredList.concat(word);

                // 添加新数据
                this.updateData();

                // 移到下一个
                // let pos = Math.max(this.didMasteredList.indexOf(item.label) + 1, this.didMasteredList.length-1);
                // vscode.commands.executeCommand('yryr.read', this.didMasteredList[pos].word);
            }
        } else {
            // this.toggle(item);
        }

        this.refresh();
    }

    // 掌握 => 陌生
    didMastered(item: any) {
        // 点击图标
        if (typeof item === 'object') {
            const word: Word | undefined = this.didMasteredList.find((obj: Word) => obj.word === item.label);
            if (word) {
                // 在掌握单词中过滤掉
                this.didMasteredList = this.didMasteredList.filter(i => i.word !== item.label);
                // 陌生单词中添加上
                this.willMasteringList = this.willMasteringList.concat(word);
                // 添加新数据
                this.updateData();
            }
        } else {
            // this.toggle(item);
        }

        this.refresh();
    }

    // 发音
    read(item: any) {
        console.log('需要发音的', item);
        readPanel().postMessage(item);
    }
}

export default Words;