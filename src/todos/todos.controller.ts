import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodoDTO } from '../dto/todoDTO';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('todos')
export class TodosController {
  constructor(
    private readonly todos: TodosService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async findAll(): Promise<TodoDTO[] | string> {
    return await this.todos.findAll();
  }

  @Get('isConfirm')
  async findAllPublish(): Promise<TodoDTO[] | string> {
    return await this.todos.findAllPublish();
  }

  @Get('/byuser/:user')
  async findAllByUser(@Param('user') userId): Promise<TodoDTO[] | string> {
    return await this.todos.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<TodoDTO | void> {
    return await this.todos
      .findOneBy(id)
      .then((value) => value)
      .catch((reason) => console.log(reason));
  }

  @Delete(':id')
  async remove(@Param('id') id, @Body() jwt: { jwt: string }): Promise<string> {
    const data = await this.jwtService.verifyAsync(jwt.jwt, {
      secret: 'Je veux pas donner mon mot de passe',
    });
    if (!data) {
      throw new UnauthorizedException();
    }
    await this.todos.delete(id);
    return 'ok';
  }

  @Put(':id')
  async update(
    @Param('id') id,
    @Body() todo: TodoDTO,
    @Body() jwt: { jwt: string },
  ): Promise<string> {
    const data = await this.jwtService.verifyAsync(jwt.jwt, {
      secret: 'Je veux pas donner mon mot de passe',
    });
    if (!data) {
      throw new UnauthorizedException();
    }
    await this.todos.update(id, todo);
    return 'ok';
  }

  @Put('ispublish/:id')
  async updatePublish(
    @Param('id') id,
    @Body() todo: { jwt: string; isPublish: boolean },
    @Body() jwt: { jwt: string },
  ): Promise<string> {
    const data = await this.jwtService.verifyAsync(jwt.jwt, {
      secret: 'Je veux pas donner mon mot de passe',
    });
    if (!data) {
      throw new UnauthorizedException();
    }
    await this.todos.updatePublish(id, todo);
    return 'ok';
  }
  @Put('ispublishconfirm/:id')
  async updatePublishConfirm(
    @Param('id') id,
    @Body() todo: { jwt: string; confirmPublish: boolean },
    @Body() jwt: { jwt: string },
  ): Promise<string> {
    const data = await this.jwtService.verifyAsync(jwt.jwt, {
      secret: 'Je veux pas donner mon mot de passe',
    });
    if (!data) {
      throw new UnauthorizedException();
    }
    await this.todos.updatePublishConfirme(id, todo);
    return 'ok';
  }

  @Put('moreLike/:id')
  async updateMoreLike(@Param('id') id): Promise<string> {
    const todo = await this.todos.findOneBy(id);
    const numberplusun = parseInt(String(todo.numberLike), 10) + 1;
    await this.todos.updateMoreLike(id, numberplusun);
    return 'ok';
  }

  @Put('moreDislike/:id')
  async updateMoreDisLike(@Param('id') id): Promise<string> {
    const todo = await this.todos.findOneBy(id);
    const numberplusun = parseInt(String(todo.numberDisLike), 10) + 1;
    await this.todos.updateMoreDisLike(id, numberplusun);
    return 'ok';
  }

  @Post()
  async create(@Body() todo: TodoDTO, @Body() jwt: { jwt: string }) {
    console.log(todo);
    const data = await this.jwtService.verifyAsync(jwt.jwt, {
      secret: 'Je veux pas donner mon mot de passe',
    });
    if (!data) {
      throw new UnauthorizedException();
    }
    await this.todos.create(todo);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async local(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      statusCode: 200,
      data: file.path,
    };
  }
}
