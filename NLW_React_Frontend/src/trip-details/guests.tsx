import { CheckCircle, CircleDashed, UserCog } from "lucide-react";
import { Button } from "../components/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Participant {
  id: string           
  name: string  | null       
  email: string        
  is_confirmed: boolean 
}


export function GuestsList(){
  const { tripId } = useParams() // retorna todos os parametros  da URL
  const[participants, setParticipants] = useState<Participant[]>([]) 
  useEffect(() => {
    api.get(`/trips/${tripId}/participants`).then(response => setParticipants(response.data.participants))
  }, [tripId])

  return (
    <div className="space-y-6 w-80"> 
      <h2 className="text-zinc-50 font-semibold">Convidados</h2>
      <div className="space-y-5">
        {participants.map((participants, index )=> {
          return (
            <div key={participants.id} className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-zinc-100 block font-medium"> {participants.name ?? `Convidado ${index}`} </span>
                <span className="text-zinc-400 text-sm block truncate">{participants.email}</span>
              </div>
              {participants.is_confirmed ? (
                <CheckCircle className="size-5 text-green-400 shrink-0"/>
              ) : (
                <CircleDashed className="size-5 text-zinc-400 shrink-0" />
              )}
            </div>
          )
        })}
      </div>
      <Button size="full" variant="secondary">
      <UserCog className="size-5 text-zinc-200"/>
        Gerenciar convidados
      </Button>
    </div>
  )
}