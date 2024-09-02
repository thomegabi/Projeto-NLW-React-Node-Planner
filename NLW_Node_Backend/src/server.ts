import fastify from "fastify";
import cors from "@fastify/cors" // A biblioteca cors server para manter um controle sobre quem pode ou não acessar a api
import { createTrip } from "./routes/create-trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipants } from "./routes/confirm-participant";
import { createActivity } from "./routes/create-activity";
import { getActivity } from "./routes/get-activities";
import { createLink } from "./routes/create-links";
import { getLinks } from "./routes/get-links";
import { getParticipants } from "./routes/get-participants";
import { createInflate } from "zlib";
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipant } from "./routes/get-participant";
import { errorHandler } from "./error-handler";
import { env } from "./env";

const app = fastify();

app.register(cors, {
  origin: '*',       //Isso diz que qualquer um consegue acessar a frontend, durante o desenvolvimento não tem problema, porém depois é recomendado que coloque a URL correta
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler) // seta o handler padrão de erros do fastify para o criado a mão

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipants)
app.register(createActivity)
app.register(getActivity)
app.register(createLink)
app.register(getLinks)
app.register(getParticipants)
app.register(createInvite)
app.register(updateTrip)
app.register(getTripDetails)
app.register(getParticipant)

app.listen({ port : env.PORT }).then(() => { // Iniciando um servidor na porta 3333 com fastify
  console.log(`Server running on port 3333`)
})