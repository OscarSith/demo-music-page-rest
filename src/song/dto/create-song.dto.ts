import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateSongDto {
  @IsNotEmpty()
  public name: string;

  public picture: string;
  public duration: number;
  public playcount: string;

  @IsNumberString()
  @IsNotEmpty()
  public albumId: number;
}
