import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ObjectiveModule} from './objective/objective.module';
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [ObjectiveModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
