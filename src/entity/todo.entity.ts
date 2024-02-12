import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  pictureName: string;

  @Column('bool')
  isPublish: boolean;

  @Column()
  numberLike: number;

  @Column()
  numberDisLike: number;

  @Column('bool', { default: false })
  confirmPublish: boolean;

  @ManyToOne((type) => User, (user) => user.id) user: User;
}
