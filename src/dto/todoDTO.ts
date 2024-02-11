import { User } from '../entity/User.entity';

export class TodoDTO {
  readonly title: string;
  readonly description: string;
  readonly user: User;
  readonly isPublish: boolean;
  readonly numberLike: number;
  readonly numberDisLike: number;
  pictureName: string;
  jwt?: string;
}
