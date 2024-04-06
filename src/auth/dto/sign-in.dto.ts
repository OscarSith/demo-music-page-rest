import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  public email: string;

  @MinLength(4)
  @IsNotEmpty()
  public password: string;
}
