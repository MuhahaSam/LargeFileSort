import settings from "./settings";


export const BUFFER_SIZE = settings.memory.bufferSize;
export const MAX_MEM = settings.memory.maxMem; 
export const FILE_SIZE = settings.memory.fileSize;
export const FILE_NAME = settings.fileName

export const MAX_WORD_SIZE = 7
export const MAX_WORD = Array.from(Array(7).keys()).reduce((prev, cur)=>{
    prev += 'z';
    return prev;
}, '');