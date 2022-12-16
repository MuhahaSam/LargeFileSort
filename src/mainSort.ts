import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import readline from 'readline';

import { Merge } from './merge';
import { TmpFile } from './tmpFile';

import {
  BUFFER_SIZE,
  MAX_MEM
} from '../consts';

export class MainSort{
    private readonly tmpFile: TmpFile = new TmpFile()
    private readonly merge: Merge

    private file
    private lines
    private data: string[] = [];
    private tmpFileNames: string[] = [];

    constructor(fileName: string){
        this.file =  createReadStream(`./files/beforeSort/${fileName}`, { highWaterMark: BUFFER_SIZE });
        this.lines = readline.createInterface({ input: this.file, crlfDelay: Infinity });
        this.merge = new Merge(fileName);
    }

    public async action(){
        await this.separate2TMP();
        await this.merge.action(this.tmpFileNames);
        await this.cleanUp();
    };

    private async separate2TMP(){
        let size: number = 0;
        let tmeFileNumber: number = 0;

        for await (const line of this.lines) {
            size += line.length;
            this.data.push(line);
            if (size > MAX_MEM) {
              this.data.sort();
              await this.tmpFile.write(this.data, tmeFileNumber, this.tmpFileNames);
              size = 0;
              tmeFileNumber++;
              this.data.length = 0;
            };
          }
          if (this.data.length > 0) {
            this.data.sort();
            await this.tmpFile.write(this.data, tmeFileNumber, this.tmpFileNames);
            this.data.length = 0;
          }
    };

    private cleanUp() {
        return Promise.all(this.tmpFileNames.map(fileName => rm(`./files/tmpFiles/${fileName}`)));
    };
}