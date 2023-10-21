/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 15:13:08
 * @Description: 权限管理
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.dto';
import { ApiBody } from '@nestjs/swagger';
import { ResultData } from 'src/utils/result';
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator';

@Controller('/sys/auth')
@ApiTags('权限管理')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @AllowAnon()
  login(@Body() loginParams: LoginDto) {
    return this.authService.login(loginParams);
  }

  @Get('info')
  getInfo(@Headers() headers: Record<string, string>) {
    return this.authService.getInfo(headers['authorization']);
  }

  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
