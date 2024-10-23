import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/auth/user.entitiy';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity[]> {
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTask(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    return this.taskService.getTask(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTasktatus(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskEntity> {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, user, status);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.taskService.deleteTask(id, user);
  }
}
