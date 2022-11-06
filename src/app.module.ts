import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { FileModule } from './modules/file/file.module';
import { AssetsModule } from './modules/assets/assets.module';
import { EventsModule } from './events/events.module';
import { Attachment } from './model/attachment.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FriendModule } from './modules/friend/friend.module';
import { EmailModule } from './modules/email/email.module';
import { RoomModule } from './modules/room/room.modules';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/upload/file',
      rootPath: join(process.cwd(), '/upload/file'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '',
      port: 3306,
      username: '',
      password: '',
      database: '',
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'upload',
      type: 'mongodb',
      host: '',
      port: 27017,
      username: '',
      password: '',
      database: '',
      entities: [Attachment],
      useUnifiedTopology: true,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CacheModule.register({
      isGlobal: true,
      // store: redisStore,
      // host: '',
      // port: 6379,
      // auth_pass: '',
      // db: 3,
    }),
    EventsModule,
    UserModule,
    RoleModule,
    FileModule,
    AssetsModule,
    FriendModule,
    EmailModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
