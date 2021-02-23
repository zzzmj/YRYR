// 创建播放窗口
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const viewPath = path.join(__dirname, '..', 'view', 'list.html');
const viewHtml = fs.readFileSync(viewPath, {
    encoding: 'utf-8'
});

let _readPanel: any;

const readPanel = function () {
    if (!_readPanel) {

        const activeDocument = vscode.window.activeTextEditor ?
            vscode.window.activeTextEditor.document :
            null;
        const panel = _readPanel = vscode.window.createWebviewPanel(
            'ReadPanel',
            'ReadPanel',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        // WebView内容
        panel.webview.html = viewHtml;

        // 关闭事件
        panel.onDidDispose(() => {
            _readPanel = null;
        });

        // 启动后激活之前的标签
        if (activeDocument) {
            setTimeout(() => {
                vscode.window.showTextDocument(activeDocument);
            }, 200);
        }
    }
    return _readPanel.webview;
};

export default readPanel;