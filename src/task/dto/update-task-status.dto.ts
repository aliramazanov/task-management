import { IsEnum } from 'class-validator';
import { TaskStatus } from 'src/helpers/enum/task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
