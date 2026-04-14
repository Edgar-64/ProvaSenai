import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    code: string;
    logo: string;
    price: string;
  }) {
    const productExists = await this.prisma.product.findUnique({
      where: { name: data.name },
    });
  }
}
