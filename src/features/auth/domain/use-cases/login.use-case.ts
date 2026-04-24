import { authService } from '../../data/services/auth.service';

export const loginUseCase = async (email: string, password: string): Promise<void> => {
  await authService.login(email, password);
};
