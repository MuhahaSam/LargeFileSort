import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { BUFFER_SIZE, FILE_SIZE, MAX_WORD_SIZE } from '../consts';

export class LargeFile{
  private *randomStringGen(): Generator<string>{
    let readBytes = 0;
    let lastLog = 0;
    while(readBytes < FILE_SIZE){
      const data = `${(Math.random() + 1).toString(36).substring(MAX_WORD_SIZE)}\n`;
      readBytes += data.length;
      if (readBytes - lastLog > 1_000_000) {
        console.log(`${readBytes / 1_000_000.0}mb`);
        lastLog = readBytes;
      }
      yield data;
    }
  }

  public init(fileName: string) {
    console.log('Creating large file ...');
    return pipeline(
      this.randomStringGen(),
      createWriteStream(`./files/beforeSort/${fileName}`, { highWaterMark: BUFFER_SIZE })
    );
  }
}