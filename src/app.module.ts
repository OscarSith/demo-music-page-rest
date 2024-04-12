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
import { AuthModule } from './auth/auth.module';
import { LibrariesModule } from './libraries/libraries.module';
import { LibrariesDataModule } from './libraries-data/libraries-data.module';
import { Library } from './libraries/entities/library.entity';
import { LibraryData } from './libraries-data/entities/library-data.entity';
import { Artist } from './artists/entities/artist.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api/(.*)'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'pruebamusica',
      entities: [User, Song, Album, Library, LibraryData, Artist],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    SongModule,
    AlbumModule,
    ArtistsModule,
    AuthModule,
    LibrariesModule,
    LibrariesDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
