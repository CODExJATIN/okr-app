import {IsNotEmpty, IsNumber, IsString, IsOptional} from "class-validator";


export class KeyResultDto {
    @IsString()
    @IsNotEmpty()
    description : string;

    @IsNumber()
    @IsNotEmpty()
    progress : number;

    @IsNumber()
    @IsOptional()
    target?: number;

    @IsString()
    @IsOptional()
    metric?: string;
}