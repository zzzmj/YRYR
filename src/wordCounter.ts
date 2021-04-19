import { window, StatusBarItem, StatusBarAlignment } from 'vscode';
class WordCounter {
    statusBar: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    wordList: Array<any> = [];
    count: number = 0;
    constructor() {
        this.init();
    }
 
    init() {
        // 如果该属性不存在就创建一个
        this.statusBar.text = '这是我创建的第一个 StatusBar';
        this.statusBar.show();
    }

    loadData(data: Array<any>) {
        this.count = 0;
        this.wordList = data;
        console.log('加载数据', data);
        this.showWord();
    }
    // 掌握这个单词
    mastering() {
        const word = this.getWord();
        this.nextWord();
        return {
            label: word
        };
    }

    // 没掌握
    notMastering() {
        this.nextWord();
    }
    getWord() {
        const { word } = this.wordList[this.count];
        return word;
    }

    showParaphrase() {
        const { word, paraphrase } = this.wordList[this.count];
        this.statusBar.text = `${word} ${paraphrase}`;
        this.statusBar.show();
        return word;
    }

    showWord() {
        // 一个是单词一个是释义
        const { word } = this.wordList[this.count];
        this.statusBar.text = word;
        this.statusBar.show();
        return word;
    }

    nextWord() {
        this.count++;
        if (this.count >= this.wordList.length) {
            this.statusBar.text = '一轮已过，重载数据';
            this.statusBar.show();
            return ;
        }
        this.showWord();
    }

    preWord() {
        this.count--;
        this.showWord();
    }
}

export default WordCounter;