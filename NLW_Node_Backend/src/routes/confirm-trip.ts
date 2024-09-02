import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs"
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";
import { ClientError } from "../errors/client-errors";
import { env } from "../env";


export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm',{
    schema: {
      params: z.object({ 
        tripId: z.string().uuid()
      })
    }
  },
  async (request, reply) => {
    const { tripId } = request.params

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      },
      include: {
        participants: { // essa é uma forma de conseguir pegar os participantes de uma viagem que não são a pessoa que enviou o convite
          where: {
            is_owner: false
          }
        }
      }
    })

    if(!trip){
      throw new ClientError("Trip not found")
    }
    
    if(trip.is_confirmed){
      return reply.redirect(`${env.WEB_BASE_URL}/${tripId}`)
    }

    await prisma.trip.update({
      where: {id: tripId},
      data: {is_confirmed: true}
    })

    const formattedStartDate = dayjs(trip.starts_at).format('LL')
    const formattedEndDate = dayjs(trip.ends_at).format('LL')

    const mail = await getMailClient()

    await Promise.all( // A Promise all espera um array de promises, e como toda função asincrona retorna uma promise
      trip.participants.map(async (participants) => {
        const confirmationLink = `${env.API_BASE_URL}/trips/participants/${participants.id}/confirm`

        const message = await mail.sendMail({
          from: {
            name: "Equipe plann.er",
            address: "oi@plann.er"
          },
          to: participants.email,
          subject: 'Teste de envio de email',
          html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
              <p></p>
              <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
              <p></p>
              <p>
                <a href="${confirmationLink}">Confirmar viagem</a>
              </p>
              <p></p>
              <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
            </div>
          `.trim(),
        })
    
        console.log(nodemailer.getTestMessageUrl(message))
      })
    )

    return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`)
  })
}