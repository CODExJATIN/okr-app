import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjectiveModule } from './objective/objective.module';

@Module({
  imports: [ObjectiveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
