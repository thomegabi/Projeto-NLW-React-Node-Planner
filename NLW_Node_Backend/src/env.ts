import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  WEB_BASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333) // esse .coerce serve pra sempre converter para numero, pois as vezes ele pode ler como string, dessa forma não
})

export const env = envSchema.parse(process.env) // o process é uma variavel global do node e senver para indicar de onde vem as variaveis globais