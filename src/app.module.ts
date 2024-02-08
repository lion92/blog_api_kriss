import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TodosModule} from './todos/todos.module';
import {ConnectionModule} from './connection/connection.module';
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: "",
            database: 'blog_api',
            entities: ['src/../**/*.entity.js'],
            synchronize: true,
        }),
        JwtModule.register({
            secret: process.env.secret,
            signOptions: {expiresIn: '1d'}
        }),
        TodosModule,
        ConnectionModule

    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
    }
}
