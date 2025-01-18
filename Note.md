<!--
 * @Author: ZhengJie
 * @Date: 2025-01-19 02:22:23
 * @LastEditTime: 2025-01-19 02:29:19
 * @Description: 问题记录
-->
# 问题记录

### 问题1：Module之间互相引用

模块导入中使用forwardRef

```typescript
// authModule
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(()=>UserModule)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]

// userModule
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(()=> AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})

```

### 问题2：Service之间也会存在互相引用

使用forwardRef()方法来创建延迟加载的服务引用

```typescript
// auth.service
import { Injectable, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}
  // ...
}

// user.service
import { Injectable, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {} 
  // ...
}
```