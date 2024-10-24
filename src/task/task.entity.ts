import { Exclude } from 'class-transformer';
import { UserEntity } from '../auth/user.entitiy';
import { TaskStatus } from '../helpers/task-status.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((type) => UserEntity, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: UserEntity;
}
