import { Activity, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"
 
interface Activity{
  date: string
  activities: {
    id: string
    title: string
    occurs_at: string
  }[]
}

export function Activities(){
  const { tripId } = useParams()
  const[activities, setActivities] = useState<Activity[]>([]) 
    useEffect(() => {
      api.get(`/trips/${tripId}/activities`).then(response => setActivities(response.data.activities))
    }, [tripId])

  return (
    <div className="space-y-8">
      {activities.map(category => {
        return (
          <div key={category.date} className="space-y-3">
            <div className="flex gap-2 items-baseline">
              <span className="text-xl text-zinc-300 font-semibold">Dia {format(category.date, 'd')}</span>
              <span className="text-xs text-zinc-500">{format(category.date, 'EEEE', { locale: ptBR })}</span>
            </div>
            {category.activities.length > 0 ? (
              <div>
                {category.activities.map(activity => {
                  return(
                    <div className="space-y-3">
                      <div key={activity.id} className="px-4 py-2.5 bg-zinc-900 rounded-xl flex items-center shadow-shape gap-3">
                        <CheckCircle className="text-lime-300 size-5"/>
                        <span className="text-zinc-100">{activity.title}</span>
                        <span className="text-zinc-400 text-sm ml-auto">
                          {format(activity.occurs_at, 'HH:mm')}h
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Nenhuma atividade cadastrada nessa data</p>
            )
          }
          </div>
        )
      })}
    </div>
  )
}