import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from 'src/helpers/enum/task-status.enum';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskEntity } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    const { status, search } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status: 'open' });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTask(id: string): Promise<TaskEntity> {
    return this.taskRepository.findOneOrFail({ where: { id } });
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.open,
    });

    return await this.taskRepository.save(task);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskEntity> {
    const result = await this.taskRepository.update(id, { status });
    if (!result.affected) {
      throw new NotFoundException(`Item has not been found`);
    }
    return this.getTask(id);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Item has not been found`);
    }
  }
}
