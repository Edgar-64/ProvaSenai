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
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(Number(+id));
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Post('signup')
  create(@Body() body: { name: string; email: string; password: string }) {
    return this.productService.create(body);
  }

  @Post('signin')
  login(@Body() body: { email: string; password: string }) {
    return this.productService.login(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; password?: string },
  ) {
    return this.productService.update(+id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(+id);
  }
}
