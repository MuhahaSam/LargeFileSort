import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { BUFFER_SIZE } from '../consts';

export class TmpFile {
    public async write(sortedData:string[], tmpFileNumber: number, tmpFileNames: string[]) {
        const tmpFileName = `tmp_sort_${tmpFileNumber}.txt`;
        tmpFileNames.push(tmpFileName);
        console.log(`creating tmp file: ${tmpFileName}`);
        await pipeline(
            sortedData!.map(e => `${e}\n`),
            createWriteStream(`./files/tmpFiles/${tmpFileName}`, { highWaterMark: BUFFER_SIZE })
        );
    };
};