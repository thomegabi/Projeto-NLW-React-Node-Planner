import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import nodemailer from "nodemailer";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { ClientError } from "../errors/client-errors";
import { env } from "../env";



export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/invite',{
    schema: { // Nesse schema que ocorre a validação dos dados do zod
      params: z.object({
        tripId: z.string().uuid()
      }),
      body: z.object({ 
        email: z.string().email(), 
      })
    }
  } ,async (request) => {
    const { tripId } = request.params
    const { email } = request.body

    const trip = await prisma.trip.findUnique({
      where: {id: tripId}
    })

    if(!trip){
      throw new ClientError("Trip not found")
    }

    const participant = await prisma.participants.create({
      data: {
        email,
        trip_id: tripId
      }
    })

    const formattedStartDate = dayjs(trip.starts_at).format('LL')
    const formattedEndDate = dayjs(trip.ends_at).format('LL')

    const mail = await getMailClient()

      const confirmationLink = `${env.API_BASE_URL}/trips/participants/${participant.id}/confirm`

      const message = await mail.sendMail({
        from: {
          name: "Equipe plann.er",
          address: "oi@plann.er"
        },
        to: participant.email,
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

    return { participantId:  participant.id}
  })
}