import { 
    IsDefined,
    IsInt
} from 'class-validator';

export class Memory {
    @IsDefined()
    @IsInt()
    bufferSize : number

    @IsDefined()
    @IsInt()
    maxMem : number

    @IsDefined()
    @IsInt()
    fileSize : number
}