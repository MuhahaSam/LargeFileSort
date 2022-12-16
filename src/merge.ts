import {
  BUFFER_SIZE,
  MAX_WORD
} from '../consts';

import { createReadStream, createWriteStream } from 'fs';
import readline from 'readline';
import { pipeline } from 'stream/promises';

export class Merge {
    private sortedFileName: string
    private values: string[]
    private activeReaders: AsyncIterableIterator<string>[]

    constructor(fileName: string){
        this.sortedFileName = `${fileName.split('.txt')[0]}-sorted.txt`;
    }
    public async action(tmpFileNames: string[]){
        await this.stream2Gen(tmpFileNames);
        await this.merge()
    }

    private async stream2Gen(tmpFileNames: string[]){
        this.activeReaders = tmpFileNames.map(
            name => readline.createInterface(
              { input: createReadStream(`./files/tmpFiles/${name}`, { highWaterMark: BUFFER_SIZE }), crlfDelay: Infinity }
            )[Symbol.asyncIterator]());
        this.values = await Promise.all<string>(this.activeReaders.map(r => r.next().then(e => e.value)));
    }

    private async merge(){
        console.log('starting merging....')
        let activeReaders = this.activeReaders
        let values = this.values
        return pipeline(
            async function* () {
              while (activeReaders.length > 0) {
                const [minVal, i] = values.reduce((prev, cur, idx) => {
                  return cur < prev[0] ? [cur, idx]: prev}, [ MAX_WORD , -1]);
                yield `${minVal}\n`;
                const res = await activeReaders[i].next();
                if (!res.done) {
                  values[i] = res.value;
                } else {
                  values.splice(i, 1);
                  activeReaders.splice(i, 1);
                }
              }
            },
            createWriteStream(`./files/afterSort/${this.sortedFileName}`, { highWaterMark: BUFFER_SIZE })
          );
    }
}