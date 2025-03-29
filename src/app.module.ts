import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module';
import { ConnectionModule } from './connection/connection.module';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ValidationArticlesModule } from './validation-articles/validation-articles.module';
import * as dotenv from 'dotenv';

// Chargement des variables d'environnement
dotenv.config();

@Module({
  imports: [
    // Configuration globale des variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configuration de Multer pour les uploads
    MulterModule.register({
      dest: './uploads',
    }),

    // Servir les fichiers statiques
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),

    // Configuration de TypeORM avec accès au service de configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'blog_api'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: configService.get('DB_SYNC', true),
      }),
    }),

    // Configuration JWT avec accès au service de configuration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get('JWT_SECRET');
        if (!secret) {
          console.warn('JWT_SECRET non défini! Utilisation d\'une valeur par défaut (non sécurisée).');
        }
        return {
          secret: secret || 'defaultSecretKeyNotSecure',
          signOptions: { expiresIn: configService.get('JWT_EXPIRES', '1d') },
        };
      },
    }),

    // Modules de l'application
    TodosModule,
    ConnectionModule,
    ValidationArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    // Vérification de la configuration au démarrage
    const jwtSecret = this.configService.get('JWT_SECRET');

  }
}