import { IsEnum } from 'class-validator';
import { TaskStatus } from '../../helpers/task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
