export interface DeleteProProfileCommand {
  id: string;
}

export interface DeleteProProfileUseCase {
  execute(command: DeleteProProfileCommand): Promise<void>;
}
