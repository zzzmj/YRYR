import { Word } from "./types";
const isJson = require('is-json');
/**
 * 处理传入的单词数据，做成合规的JSON格式，
 * [
 *  {
 *      word: 'claimant',
 *      paraphrase: 'claimant [名]申请人；原告人'
 *  },
 *  ...
 * ]
 * 
 */

// 判断char字符是不是字母
const isLetter = (char: any) => {
    const charCode = char.charCodeAt();
    const lowerA = 'a'.charCodeAt(0);
    const lowerZ = 'z'.charCodeAt(0);
    const upperA = 'A'.charCodeAt(0);
    const upperZ = 'Z'.charCodeAt(0);
    const gh = '-'.charCodeAt(0);
    const star = '*'.charCodeAt(0);
    if (charCode >= lowerA && charCode <= lowerZ) {
        return true;
    }
    if (charCode >= upperA && charCode <= upperZ) {
        return true;
    }
    if (charCode === gh || charCode === star) {
        return true;
    }
    return false;
};

// 判断单词是不是表示词性
const notWord = (word: any) => {
    const partOfSpeech = [
        'n:',
        'u:',
        'c:',
        'v:',
        'vi:',
        'vt:',
        'conj:',
        'adj:',
        'adv:',
        'n：',
        'u：',
        'c：',
        'v：',
        'vi：',
        'vt：',
        'conj：',
        'adj：',
        'adv：',
    ];
    if (partOfSpeech.includes(word)) {
        return false;
    }
    return true;
};

export const processText = (wordStr: string | undefined) => {
    if (typeof wordStr === 'undefined') {
        return [];
    } else if (isJson(wordStr)) {
        const obj = JSON.parse(wordStr);
        // 如果obj是Word类型
        if (obj as Array<Word>) {
            console.log('obj', obj);
            return obj;
        }
    }
    const str = wordStr;
    const wordJson: Array<Word> = [];
    let temp: any = {};

    let word = '';
    let paraphrase = '';
    for (let i = 0; i < str.length; i++) {
        // 判断是否被[]包裹
        if (str[i] === '{') {
            let j = 0;
            while (str[i + j - 1] !== '}' && j < 100) {
                paraphrase += str[i + j];
                j++;
            }
            temp['paraphrase'] = paraphrase;
            i += j;
            continue;
        }
        // 判断是否是字母
        if (isLetter(str[i])) {
            // 之前是否已经生成了一个释义
            if (paraphrase) {
                temp['paraphrase'] = paraphrase;
                paraphrase = '';
                wordJson.push(temp);
                temp = {};
            }
            if (str[i] === '*') {
                word += " ";
            } else {
                word += str[i];
            }
        } else {
            // 之前是否已经生成了一个单词
            if (word) {
                temp['word'] = word;
                word = '';
            }
            paraphrase += str[i];
        }
    }

    // // 提供一个显隐初始值
    // for (let i = 0; i < wordJson.length; i++) {
    //     wordJson[i].visibility = 'hidden';
    // }
    console.log('wordJson', wordJson);
    return wordJson;
};
