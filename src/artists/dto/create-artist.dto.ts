import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateArtistDto {
  @MinLength(2)
  @IsNotEmpty()
  public name: string;

  @MinLength(2)
  @IsNotEmpty()
  public lastname: string;

  public avatar: string;
  public bio: string;
  public fullname: string;
}
