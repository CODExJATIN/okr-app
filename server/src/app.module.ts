import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ObjectiveModule} from './objective/objective.module';
import {ConfigModule} from "@nestjs/config";
import { AiModule } from './ai/ai.module';

@Module({
    imports: [ObjectiveModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AiModule,],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
