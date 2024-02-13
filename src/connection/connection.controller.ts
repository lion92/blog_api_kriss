import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { UserDTO } from '../dto/UserDTO';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entity/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoDTO } from '../dto/todoDTO';
import { LoginDTO } from '../dto/LoginDTO';

@Controller('connection')
export class ConnectionController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly connectionService: ConnectionService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async findAll(): Promise<TodoDTO[] | string> {
    return await this.connectionService.findAll();
  }

  @Post('signup')
  async signup(
    @Body() user: UserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const msg = await this.connectionService
      .signup(user, res)
      .catch((reason) => reason);

    return '' + msg;
  }

  @Post('/login')
  async login(
    @Body() user: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void | {
    id: number;
    email: string;
    prenom: string;
    nom: string;
  }> {
    return await this.connectionService
      .login(user, res)
      .then((value) => value)
      .catch((reason) => console.log(reason));
  }

  @Put(':id')
  async update(
    @Param('id') id,
    @Body() user: UserDTO,
    @Body() jwt: { jwt: string },
  ): Promise<void> {
    const data = await this.jwtService.verifyAsync(jwt.jwt, {
      secret: 'Je veux pas donner mon mot de passe',
    });
    if (!data) {
      throw new UnauthorizedException();
    }
    const str = await this.connectionService.update(id, user);
    return str;
  }

  @Post('user')
  async user(@Body() jwt: { jwt: string }) {
    try {
      await console.log(jwt);
      const data = await this.jwtService.verifyAsync(jwt.jwt, {
        secret: 'Je veux pas donner mon mot de passe',
      });
      await console.log(data);
      if (!data) {
        throw new UnauthorizedException();
      }
      const qb = await this.userRepository.createQueryBuilder('User');
      await qb.select('id, nom, prenom');
      await qb.where({ id: data.id });
      await console.log(qb.getSql());

      const user = await qb.execute();

      const { password, ...result } = await user;
      await console.log(user[0]);
      await console.log('ee');
      return { id: user[0].id, nom: user[0].nom, prenom: user[0].prenom };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success',
    };
  }
}
