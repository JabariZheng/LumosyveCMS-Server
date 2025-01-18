/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 15:13:08
 * @Description: 权限管理
 */
import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.dto';
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator';

@Controller('/sys/auth')
@ApiTags('⭕️权限管理')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @AllowAnon()
  login(@Body() loginParams: LoginDto) {
    return this.authService.login(loginParams);
  }

  @Get('logout')
  @ApiOperation({ summary: '登出' })
  logout(@Headers() headers: Record<string, string>) {
    return this.authService.logout(headers['authorization']);
  }

  @Get('info')
  @ApiOperation({ summary: '获取当前登录用户信息' })
  getInfo(@Headers() headers: Record<string, string>) {
    return this.authService.getInfo(headers['authorization']);
  }
  @Get('permissions')
  @ApiOperation({ summary: '获取当前登录用户的权限信息' })
  getPermissions(@Headers() headers: Record<string, string>) {
    return this.authService.getPermissions(headers['authorization']);
  }

  @Get('menuRoute')
  @ApiOperation({ summary: '获取当前登录用户的菜单信息' })
  getMenuRoute(@Headers() headers: Record<string, string>) {
    return this.authService.getMenuRoute(headers['authorization']);
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
