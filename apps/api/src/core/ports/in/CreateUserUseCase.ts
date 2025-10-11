import { User, UserRole } from '../../domain/entities/User';

export interface CreateUserCommand {
  id: string;
  email: string | null;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
}

export interface CreateUserUseCase {
  execute(command: CreateUserCommand): Promise<User>;
}
