import {IsNotEmpty, IsNumber, IsString} from "class-validator";


export class KeyResultDto {
    @IsString()
    @IsNotEmpty()
    description : string;

    @IsNumber()
    @IsNotEmpty()
    progress : number;
}