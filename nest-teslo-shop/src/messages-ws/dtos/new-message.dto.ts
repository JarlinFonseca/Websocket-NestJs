﻿import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class NewMessageDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    message: string;


}