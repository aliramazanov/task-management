import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {
    this.taskService = taskService;
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    return this.taskService.getTasks(filterDto);
  }

  @Get('/:id')
  getTask(@Param('id') id: string): Promise<TaskEntity> {
    return this.taskService.getTask(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.taskService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  updateTasktatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskEntity> {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.taskService.deleteTask(id);
  }
}
