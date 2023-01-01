import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/AuthDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async login(@Body() authDto: AuthDto, @Res({ passthrough: true }) response) {
    const userData = await this.authService.login(authDto);
    response.cookie('refreshToken', userData.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }

  @Post('/signup')
  async registration(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) response,
  ) {
    const userData = await this.authService.registration(userDto);
    response.cookie('refreshToken', userData.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }

  @Get('/refresh')
  async refresh(@Req() request, @Res({ passthrough: true }) response) {
    const { refreshToken } = request.cookies;
    console.log(refreshToken);
    const userData = await this.authService.refresh(refreshToken);
    response.cookie('refreshToken', userData.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }
}
