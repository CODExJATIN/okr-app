import {Body, Controller, Post} from '@nestjs/common';
import {AiService} from "./ai.service";
import {type ChatDto} from "./chatDto";

export default interface OkrDto {


}

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) {

    }

    @Post('chat')
    sendMessage(@Body() chatDto:ChatDto[]){
        return this.aiService.send(chatDto);
    }

}
