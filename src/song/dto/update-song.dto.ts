import { IsNotEmpty } from 'class-validator';

export class UpdateSongDto {
  @IsNotEmpty()
  public name: string;
}
