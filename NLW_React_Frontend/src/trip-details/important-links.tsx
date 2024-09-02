import { Link2, Plus } from "lucide-react";
import { Button } from "../components/button";
import { useEffect, useState } from "react";
import { CreateLinkModal } from "./links-modal";
import { useParams } from "react-router-dom";
import { api } from "../lib/axios";

interface Links{
  title: string
  url: string
}[]



export function ImportantLinks(){
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false)


  function openCreateLinkModal(){
    setIsCreateLinkModalOpen(true)
  }

  function closeCreateLinkModal(){
    setIsCreateLinkModalOpen(false)
  }

  const { tripId } = useParams()
  const[links, setLinks] = useState<Links[]>([]) 
    useEffect(() => {
      api.get(`/trips/${tripId}/links`).then(response => setLinks(response.data.links))
    }, [tripId])

   return (
    <div className="space-y-6 w-80">
      <h2 className="text-zinc-50 font-semibold">Links Importantes</h2>
      {links.map(links => {
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-zinc-100 block font-medium">{links.title}</span>
                <a href="#" className="text-zinc-400 text-xs block truncate hover:text-zinc-200">{links.url}</a>
              </div>
              <Link2 className="size-5 text-zinc-400 shrink-0" />
            </div>
          </div>
        )
      })}
      <Button onClick={openCreateLinkModal} variant="secondary" size="full">
      <Plus className="size-5 text-zinc-200"/>
        Cadastrar novo link
      </Button>

      {isCreateLinkModalOpen && (
         <CreateLinkModal 
          closeCreateLinkModal={closeCreateLinkModal}
        /> 
      )}
    </div>
   )
}