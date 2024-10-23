import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/auth/user.entitiy';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
  private logger = new Logger('TaskController');
  constructor(private taskService: TaskService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity[]> {
    const getTasksLog = `User: ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`;
    this.logger.verbose(getTasksLog);
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
    const createTasksLog = `User: ${user.username} retrieving all tasks. Data: ${JSON.stringify(createTaskDto)}`;
    this.logger.verbose(createTasksLog);
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
