import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-errors";



export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/links',{
    schema: { // Nesse schema que ocorre a validação dos dados do zod
      params: z.object({
        tripId: z.string().uuid()
      }),
      body: z.object({ 
        title: z.string().min(4),
        url: z.string().url(), 
      })
    }
  } ,async (request) => {
    const { tripId } = request.params
    const { title, url } = request.body

    const trip = await prisma.trip.findUnique({
      where: {id: tripId}
    })

    if(!trip){
      throw new ClientError("Trip not found")
    }

    const links = await prisma.link.create({
      data: {
        title,
        url,
        trip_id: tripId
      }
    })

    return { linkId: links.id }
  })
}