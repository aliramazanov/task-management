import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entitiy';
import { TaskStatus } from '../helpers/task-status.enum';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskService {
  private logger = new Logger('TaskService', { timestamp: true });
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async getTasks(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    const { status, search } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status: 'open' });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      const dbRetrieveTaskError = `Failed to retrieve tasks for the user: ${user.username}. Filters: ${JSON.stringify(filterDto)}`;
      this.logger.error(dbRetrieveTaskError, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async getTask(id: string, user: UserEntity): Promise<TaskEntity> {
    return this.taskRepository.findOneOrFail({ where: { id, user } });
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDto;
    const status = TaskStatus.open;

    const task = this.taskRepository.create({
      user,
      title,
      description,
      status,
    });

    return await this.taskRepository.save(task);
  }

  async updateTaskStatus(
    id: string,
    user: UserEntity,
    status: TaskStatus,
  ): Promise<TaskEntity> {
    const result = await this.taskRepository.update(id, { status });
    if (!result.affected) {
      throw new NotFoundException(`Item has not been found`);
    }
    return this.getTask(id, user);
  }

  async deleteTask(id: string, user: UserEntity): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });
    if (!result.affected) {
      throw new NotFoundException(`Item has not been found`);
    }
  }
}
