import { Event, ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState, EventEmitter } from 'vscode';
import { Word } from './types';

class WordProvider implements TreeDataProvider<WordItem> {
    visibility: 'hidden' | 'visible';// 控制释义的显示隐藏
    type: string;
    list: Array<Word>;

    constructor(type: string) {
        this.type = type;
        this.list = [
            {
                word: 'word',
                paraphrase: '单词'
            },{
                word: 'dsgfgd',
                paraphrase: '单词'
            },{
                word: 'haha',
                paraphrase: '单词'
            },
        ];
        this.visibility = 'hidden';
    }
    private _onDidChangeTreeData = new EventEmitter<void | WordItem | null | undefined>();
    onDidChangeTreeData?: Event<void | WordItem | null | undefined> | undefined = this._onDidChangeTreeData.event;

    // 实现接口方法
    getTreeItem(element: WordItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    // 实现接口方法
    getChildren(element?: WordItem): ProviderResult<WordItem[]> {
        return this.list.map(item => {
            const { word, paraphrase, visibility } = item;

            return new WordItem(word, TreeItemCollapsibleState.None, this.type, paraphrase);
        });
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    loadData(data: Array<Word>) {
        this.list = data;
    }
}

class WordItem extends TreeItem {
    /**
     * 
     * @param label treeItem的标题
     * @param collapsibleState 该项是否折叠状态：C
     */
    type: string;
    
    constructor(
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
        type: string,
        paraphrase: string,
    ) {
        super(label, collapsibleState);
        // console.log('意思', this.label + paraphrase);
        this.type = type;
        this.command = {
            title: this.label,
            command: this.type,       // 点击命令 ID
            tooltip: this.label + paraphrase,        // 鼠标覆盖时的小小提示框
            arguments: [                // 向 registerCommand 传递的参数。
                this.label,             // 目前这里我们只传递一个 label
            ]
        };
        this.tooltip = this.label + paraphrase;
    }

    // 这个是用来表示树后面的action操作的，在package.json中写viewItem="word"就能匹配到这个item
    contextValue = 'word';
}


export default WordProvider;