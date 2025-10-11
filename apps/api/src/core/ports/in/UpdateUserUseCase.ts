import { User, UserRole } from '../../domain/entities/User';

export interface UpdateUserCommand {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: UserRole;
  phone?: string | null;
  avatar?: string | null;
}

export interface UpdateUserUseCase {
  execute(command: UpdateUserCommand): Promise<User>;
}
