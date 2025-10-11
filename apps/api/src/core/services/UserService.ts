import { injectable, inject } from 'tsyringe';
import type { UserRepository } from '../ports/out/UserRepository';
import type { CreateUserCommand } from '../ports/in/CreateUserUseCase';
import type { UpdateUserCommand } from '../ports/in/UpdateUserUseCase';
import type { DeleteUserCommand } from '../ports/in/DeleteUserUseCase';
import type {
  GetUserUseCase,
  GetUserByIdQuery,
  GetUserByClerkIdQuery,
  GetUserByEmailQuery,
  GetUsersQuery,
} from '../ports/in/GetUserUseCase';
import { User } from '../domain/entities/User';
import { NotFoundError } from '../domain/errors/DomainError';

@injectable()
export class UserService implements GetUserUseCase {
  constructor(@inject('UserRepository') private userRepository: UserRepository) {}

  // CreateUserUseCase
  async createUser(command: CreateUserCommand): Promise<User> {
    const user = User.create({
      id: command.id,
      email: command.email,
      role: command.role,
      firstName: command.firstName,
      lastName: command.lastName,
    });

    return await this.userRepository.create(user);
  }

  // UpdateUserUseCase
  async updateUser(command: UpdateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findById(command.id);

    if (!existingUser) {
      throw new NotFoundError('User', command.id);
    }

    // Mise à jour via méthodes métier
    if (command.email) {
      existingUser.updateEmail(command.email);
    }

    existingUser.updateProfile({
      firstName: command.firstName,
      lastName: command.lastName,
      phone: command.phone,
      avatar: command.avatar,
    });

    if (command.role) {
      existingUser.changeRole(command.role);
    }

    return await this.userRepository.update(command.id, existingUser);
  }

  // DeleteUserUseCase
  async deleteUser(command: DeleteUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findById(command.id);

    if (!existingUser) {
      throw new NotFoundError('User', command.id);
    }

    return await this.userRepository.delete(command.id);
  }

  // GetUserUseCase
  async getById(query: GetUserByIdQuery): Promise<User | null> {
    return await this.userRepository.findById(query.id);
  }

  // Alias pour compatibilité: clerkId EST maintenant l'id
  async getByClerkId(query: GetUserByClerkIdQuery): Promise<User | null> {
    return await this.userRepository.findById(query.clerkId);
  }

  async getByEmail(query: GetUserByEmailQuery): Promise<User | null> {
    return await this.userRepository.findByEmail(query.email);
  }

  async getMany(query: GetUsersQuery): Promise<User[]> {
    return await this.userRepository.findMany(query.filter);
  }
}
