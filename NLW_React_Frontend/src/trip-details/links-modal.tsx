import { Calendar, Tag, X } from "lucide-react"
import { Button } from "../components/button"
import { FormEvent } from "react"
import { api } from "../lib/axios"
import { useParams } from "react-router-dom"

interface CreateLinkModalProps{
  closeCreateLinkModal: () => void
}

export function CreateLinkModal({ closeCreateLinkModal } : CreateLinkModalProps){
  const { tripId } = useParams()

  async function createLink(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const title = data.get('title')?.toString()
    const url = data.get('url')?.toString()

    console.log(title, url)

    await api.post(`/trips/${tripId}/links`, {
      title,
      url,
    })

    window.document.location.reload() // não é a melhor forma de atualizar uma pagina, mas atualiza e adiciona automaticamente as atividades
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cadastrar Link</h2>
            <button type="button" onClick={closeCreateLinkModal}>
              <X className="size-5 text-zinc-400"/>
            </button>
          </div>
          <p className="text-zinc-400 text-sm">
            Todos convidados podem visualizar os links importantes.
          </p>
        </div>

        <form onSubmit={createLink} className="space-y-3">
          <div className="h-14 px-5 bg-zinc-950  border border-zinc-800 rounded-lg flex items-center gap-2.5">
            <Tag className="text-zinc-400 size-5"/>
            <input 
              name="title" 
              placeholder="Titulo do Link" 
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-14 flex-1 px-5 bg-zinc-950  border border-zinc-800 rounded-lg flex items-center gap-2.5">
              <Calendar className="text-zinc-400 size-5"/>
              <input 
                type="url"
                name="url" 
                placeholder="URL" 
                className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="full">
            Salvar link
          </Button>
        </form>
      </div>
    </div>
  )
}