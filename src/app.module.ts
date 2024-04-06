import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { SongModule } from './song/song.module';
import { AlbumModule } from './album/album.module';
import { Album } from './album/entities/album.entity';
import { Song } from './song/entities/song.entity';
import { ArtistsModule } from './artists/artists.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'pruebamusica',
      entities: [User, Song, Album],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    SongModule,
    AlbumModule,
    ArtistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
