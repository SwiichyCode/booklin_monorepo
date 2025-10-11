import { User } from '../../domain/entities/User';

export interface DeleteUserCommand {
  id: string;
}

export interface DeleteUserUseCase {
  execute(command: DeleteUserCommand): Promise<User>;
}
