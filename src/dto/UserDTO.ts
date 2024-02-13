import { UserRole } from '../entity/User.entity';

export class UserDTO {
  readonly id: number;
  readonly email: string;
  readonly nom: string;
  readonly prenom: string;
  role?: UserRole;
  password?: string;
  jwt?: string;
}
