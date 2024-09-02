import { MapPin, Calendar, Settings2 } from "lucide-react";
import { Button } from "../components/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { format } from "date-fns";

interface Trip{
  id: string,           
  destination: string  
  starts_at: string    
  ends_at: string      
  is_confirmed: boolean
  created_at: string 
}

export function DestinationAndDateHeader(){
  const { tripId } = useParams() // retorna todos os parametros  da URL
  const[trip, setTrip] = useState<Trip | undefined>() // o useState vai receber um objeto do tipo Trip ou indefinido, no caso ele fica indefinido até não receber parametros, por delay do sistema
  
  useEffect(() => {
    api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
  }, [tripId]) // a função passada no (), só vai mudar caso o tripId [], mude, caso contrario não muda

  const displayedDate = trip
    ? format(trip.starts_at, "d' de 'LLL").concat(' até ').concat(format(trip.ends_at, "d' de 'LLL")) 
    : null

  return (
    <div className="px-4 h-16 bg-zinc-900 rounded-xl shadow-shape flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-zinc-100 text-lg">{trip?.destination}</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-zinc-100 text-lg">{displayedDate}</span>
        </div>

        <div className="w-px h-6 bg-zinc-800"/>

        <Button variant="secondary">
          Alterar local/data
          <Settings2 className="size-5"/>
        </Button>
      </div>
    </div>
  )
}