import { PrismaClient } from "@prisma/client";  // Segunda pasta criada, serve para sempre que uma query é feita para o banco ele printa no terminal

export const prisma = new PrismaClient({
  log: ['query']
})