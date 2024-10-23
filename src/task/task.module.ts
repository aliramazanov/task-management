import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TaskController } from './task.controller';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), AuthModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
