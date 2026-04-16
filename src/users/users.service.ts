import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; email: string; password: string }) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new BadRequestException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    //CRUD Create - INSERT INTO
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  //CRUD Update - UPDATE SET name = ?, email = ?, password = ? WHERE id = ?
  async update(
    id: number,
    data: {
      name?: string;
      email?: string;
      password?: string;
    },
  ) {
    await this.findOne(id);
    if (data.email) {
      const emailinUse = await this.prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id },
        },
      });
      if (emailinUse) {
        throw new BadRequestException('Email em uso por outro usuário');
      }
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      return this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    }
  }

  //CRUD Delete - DELETE FROM WHERE id = ?
  async delete(id: number) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });
  }

  //CRUD Read - SELECT * FROM WHERE id = ?
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    return user;
  }

  //CRUD Read - SELECT * FROM
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  //CRUD Read - SELECT * FROM WHERE email = ?
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
  }

  //CRUD Update - UPDATE SET name = ?, email = ? WHERE id = ?
  async login(data: { email: string; password: string }) {
    const user = await this.findByEmail(data.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isValid = await bcrypt.compare(data.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
