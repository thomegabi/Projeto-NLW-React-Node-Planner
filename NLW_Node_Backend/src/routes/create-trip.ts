import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs"
import { ClientError } from "../errors/client-errors";
import { env } from "../env";



export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips',{
    schema: { // Nesse schema que ocorre a validação dos dados do zod
      body: z.object({ // Aqui basicamente diz que ele espera que z seja um objeto que contenha os atributos, com as especificações abaixo
        destination: z.string().min(4),
        starts_at: z.coerce.date(), // O coerce manda o zod converter o starts_at para uma data, se ele conseguir, ele armazena, se n, acusa erro
        ends_at: z.coerce.date(),
        owner_name: z.string(),
        owner_email: z.string().email(),
        emails_to_invite: z.array(z.string().email())
      })
    }
  } ,async (request) => {
    const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite } = request.body

    if(dayjs(starts_at).isBefore(new Date())){
      throw new ClientError("Invalid start date!");
    }

    if(dayjs(ends_at).isBefore(starts_at)){
      throw new ClientError("Invalid end date!")
    }

    const trip = await prisma.trip.create({
      data:{
        destination,
        starts_at,
        ends_at,
        participants: {
          createMany: {
            data: [
              {
              name: owner_name,
              email: owner_email,
              is_owner: true,
              is_confirmed: true,
            },
            ...emails_to_invite.map(email => { // o ... é um spread operator, serve para indicar que isso é um array, e pode retornar multiplos dados
              return { email }
            })
          ]
          }
        }
      }
    })

    const mail = await getMailClient()

    const formattedStartDate = dayjs(starts_at).format('LL')
    const formattedEndDate = dayjs(ends_at).format('LL')

    const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`

    const message = await mail.sendMail({
      from: {
        name: "Equipe plann.er",
        address: "oi@plann.er"
      },
      to: {
        name: owner_name,
        address: owner_email,
      },
      subject: 'Teste de envio de email',
      html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
          <p></p>
          <p>Para confirmar sua viagem, clique no link abaixo:</p>
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

    return { tripId: trip.id }
  })
}