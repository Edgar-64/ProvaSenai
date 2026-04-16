/*
-- HTTP METHODS --
GET: Recupera dados de um recurso específico. É seguro (não altera o estado) e idempotente.
POST: Cria um novo recurso no servidor. Não é seguro e não é idempotente.
PUT: Atualiza ou substitui um recurso existente completamente. É idempotente.
DELETE: Remove um recurso específico. É idempotente.
PATCH: Aplica modificações parciais a um recurso.
HEAD: Semelhante ao GET, mas solicita apenas o cabeçalho da resposta, sem o corpo.
OPTIONS: Descreve as opções de comunicação permitidas para um recurso.
*/
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(+id));
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('signup')
  create(@Body() body: { name: string; email: string; password: string }) {
    return this.usersService.create(body);
  }

  @Post('signin')
  login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; password?: string },
  ) {
    return this.usersService.update(+id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
