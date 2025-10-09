import { User } from '../../domain/entities/User';

export interface DeleteUserCommand {
  clerkId: string;
}

export interface DeleteUserUseCase {
  execute(command: DeleteUserCommand): Promise<User>;
}
