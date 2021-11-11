import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ToDoListModule } from './todolist/todolist.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        console.log('PASSWORD', configService.get('PASSWORD'));
        console.log('Username', configService.get('USERNAME'));
        console.log('User', configService.get('USER'));
        console.log('database', configService.get('DATABASE'));
        return {
          type: 'postgres',
          host: configService.get('HOST'),
          port: +configService.get<number>('PORT'),
          username: configService.get('USER'),
          password: configService.get('PASSWORD'),
          database: configService.get('DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },

      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    ToDoListModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
