import { exec } from 'child_process';
const iconv = require('iconv-lite');

const copyClipboard = (str: string) => {
    const stdin = exec('clip').stdin;
    if (stdin) {
        stdin.end(iconv.encode(str, 'gbk'));
    }
};

export default copyClipboard;