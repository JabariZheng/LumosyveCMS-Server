/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: user.controller
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getControllerName } from 'src/utils';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ActionByIdDot, GetUserInfoDto, GetUserPageDto } from './dto/user.dto';
import { ResultData } from 'src/utils/result';

@Controller(getControllerName(__dirname))
@ApiTags('用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '新增' })
  registerUser(@Body() createDto: CreateUserDto, @Headers() headers: any) {
    return this.userService.create(createDto, headers.authorization);
  }

  @Post('add')
  @ApiOperation({ summary: '新增' })
  add(@Body() createDto: CreateUserDto, @Headers() headers: any) {
    return this.userService.create(createDto, headers.authorization);
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除' })
  remove(@Query() query: ActionByIdDot) {
    console.log('query', query, query.id);
    return this.userService.remove(+query.id);
  }

  @Patch('update')
  @ApiOperation({ summary: '更新' })
  update(@Body() updateUserDto: UpdateUserDto, @Headers() headers: any) {
    return this.userService.update(updateUserDto, headers.authorization);
  }

  @Get('page')
  @ApiOperation({ summary: '分页' })
  getPage(@Query() page: GetUserPageDto) {
    return this.userService.getUserPage(page);
  }

  @Get('list')
  @ApiOperation({ summary: '列表' })
  getList() {
    return this.userService.getUserList();
  }

  @Get('info')
  @ApiOperation({ summary: '详情' })
  getInfo(@Query() query: ActionByIdDot) {
    return this.userService.getInfo(+query.id);
  }

  // @Get('page')
  // @ApiOperation({ summary: '用户分页' })
  // getUserPage(@Query() userPage: GetUserPageDto) {
  //   return this.userService.getUserPage(userPage);
  // }

  // @Get('list')
  // @ApiOperation({ summary: '用户列表' })
  // getUserList() {
  //   return this.userService.getUserList();
  // }

  // @Get('info')
  // @ApiOperation({ summary: '查询用户信息' })
  // getInfo(@Query() query: GetUserInfoDto): Promise<ResultData> {
  //   return this.userService.getInfo(query.id);
  // }

  // @Post('register')
  // register(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.registerUser(createUserDto);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
