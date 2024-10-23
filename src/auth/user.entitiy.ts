import { TaskEntity } from 'src/task/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  securePassword: string;

  @OneToMany((type) => TaskEntity, (task) => task.user, { eager: true })
  tasks: TaskEntity[];
}
