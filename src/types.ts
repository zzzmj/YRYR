
export interface Word {
    word: string;
    paraphrase: string;
    visibility?: 'hidden' | 'visible';
}

export const isWord = function(arg: any): Word{
    return (arg as Word);
};