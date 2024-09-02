import { Calendar, Tag, X } from "lucide-react"
import { Button } from "../components/button"
import { FormEvent } from "react"
import { api } from "../lib/axios"
import { useParams } from "react-router-dom"

interface CreateActivityModalProps{
  closeCreateActivityModal: () => void
}

export function CreateActivityModal({ closeCreateActivityModal } : CreateActivityModalProps){
  const { tripId } = useParams()

  async function createActivity(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const title = data.get('title')?.toString()
    const occurs_at = data.get('occurs_at')?.toString()

    console.log(title, occurs_at)

    await api.post(`/trips/${tripId}/activities`, {
      title,
      occurs_at,
    })

    window.document.location.reload() // não é a melhor forma de atualizar uma pagina, mas atualiza e adiciona automaticamente as atividades
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cadastrar atividade</h2>
            <button type="button" onClick={closeCreateActivityModal}>
              <X className="size-5 text-zinc-400"/>
            </button>
          </div>
          <p className="text-zinc-400 text-sm">
            Todos convidados podem visualizar as atividades.
          </p>
        </div>

        <form onSubmit={createActivity} className="space-y-3">
          <div className="h-14 px-5 bg-zinc-950  border border-zinc-800 rounded-lg flex items-center gap-2.5">
            <Tag className="text-zinc-400 size-5"/>
            <input 
              name="title" 
              placeholder="Qual a atividade" 
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-14 flex-1 px-5 bg-zinc-950  border border-zinc-800 rounded-lg flex items-center gap-2.5">
              <Calendar className="text-zinc-400 size-5"/>
              <input 
                type="datetime-local"
                name="occurs_at" 
                placeholder="Data de horário da atividade" 
                className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="full">
            Salvar atividade
          </Button>
        </form>
      </div>
    </div>
  )
}