import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(2)
  @IsNotEmpty()
  public name: string;

  @MinLength(2)
  @IsNotEmpty()
  public lastname: string;

  @IsEmail()
  public email: string;

  @MinLength(4)
  @IsNotEmpty()
  public password: string;
}
