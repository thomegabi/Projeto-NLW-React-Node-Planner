import { FastifyInstance } from "fastify";
import { ClientError } from "./errors/client-errors";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance['errorHandler'] // isso vai mostrar a tipagem que a função deve serguir para que seja uma função pra tratar erros do fastify

export const errorHandler : FastifyErrorHandler = (error, request, reply) => {
  if(error instanceof ZodError){
    return reply.status(400).send({
      message: "Invalid Input",
      errors: error.flatten().fieldErrors // isso retorna exatamente oq está ocorrendo de errado, quando o erro passa pela validação do zod
    })
  }

  if(error instanceof ClientError){ //Isso basicamente significa que por ser uma instancia de CLientError, ele é um erro de tipo 400, ja q é um erro gerado pelo cliente
    return reply.status(400).send({
      message: error.message
    })
  }

  reply.status(500).send("An Internal Error has occured")
}