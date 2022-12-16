import { LargeFile } from './src/largeFile';
import { MainSort } from './src/mainSort';
import { FILE_NAME } from './consts';


async function main (){
  const largeFile = new LargeFile();
  await largeFile.init(FILE_NAME);

  const mainSort = new MainSort(FILE_NAME);
  await mainSort.action();

};


main();

