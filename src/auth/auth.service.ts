import * as argon2 from 'argon2';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { User } from '../user/entities/user.entity';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findByUsername(
      createUserDto.username,
    );

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await this.hashData(createUserDto.password);

    const newUser: User = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });

    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.createRefreshToken(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async signIn(data: AuthDto) {
    const user = await this.usersService.findByUsername(data.username);

    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = await argon2.verify(user.password, data.password);

    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    return this.updateToken(userId, { refresh_token: '' });
  }

  async updateToken(id: string, updateUserDto: UpdateUserDto) {
    return this.knex('token').returning('*').where('user_id', id).update({
      refresh_token: updateUserDto.refresh_token,
    });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async createRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    return this.knex('token')
      .insert({
        refresh_token: hashedRefreshToken,
        user_id: userId,
      })
      .returning('*')
      .then((res) => res[0]);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    return this.knex('token').returning('*').where('user_id', userId).update({
      refresh_token: hashedRefreshToken,
    });
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: number, refreshTokenFromReq: string) {
    const user = await this.usersService.findById(userId);
    const { refresh_token } = await this.knex('token')
      .where('user_id', userId)
      .first();

    // todo get refresh token
    if (!user || !refresh_token) throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await argon2.verify(
      refresh_token,
      refreshTokenFromReq,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
