import "reflect-metadata"
import { 
    IsDefined,
    IsString,
    ValidateNested,
} from 'class-validator';

import {Type} from 'class-transformer';

import { Memory } from './memopry';



export class Settings {

    @IsDefined()
    @Type(() => Memory)
    @ValidateNested()
    memory: Memory


    @IsDefined()
    @IsString()
    fileName : string
}