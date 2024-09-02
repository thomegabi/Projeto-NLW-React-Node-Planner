import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InviteGuestsModal } from "./invite-guests-modal";
import { ConfirmTripModal } from "./confirm-trip-modal";
import { DestinationAndDateStep } from "./steps/destination-and-date-step";
import { InviteGuestsStep } from "./steps/invite-guest-step";
import { DateRange } from "react-day-picker";
import { api } from "../../lib/axios";

export function CreateTripPage() { // ao colocar o export aqui ele obriga a colocar o nome correto da função ao invez de qualquer nome ao exportar default
  const navigate = useNavigate()

  const [isGuestInputOpen, setIsGuestInputOpen] = useState(false) // isso é utilizado no react para atualizar a pagina atual com mais informações
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)

  const [destination, setDestination] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>(undefined)


  const [emailsToInvite, setEmailsToInvite] = useState([
    'teste@mail.com',
    'konodiodah@zawarudo.com'
  ])

  

  function openGuestModal(){
    setIsGuestModalOpen(true)
  }

  function closeGuestModal() {
    setIsGuestModalOpen(false)
  }

  function openConfirmTripModal(){
    setIsConfirmTripModalOpen(true)
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false)
  }

  function openGuestInput() {
    setIsGuestInputOpen(true)
  }

  function closeGuestInput(){
    setIsGuestInputOpen(false)
  } 

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>){ // esse HTMLFormElement serve para indicar que o evento esta partindo de um elemento do formluario html
    event.preventDefault() // evita que ele envie o usuário para uma nova pagina ou reinicie a mesma
    
    const data = new FormData(event.currentTarget) // essa função add um email novo ao array de emails usando o principio da imutabilidade
    const email = data.get('email')?.toString() // torna o dado uma string que pode ser nula

    if(!email){
      return
    }

    if(emailsToInvite.includes(email)){
      return
    }

    setEmailsToInvite([
      ...emailsToInvite, // esse ...emailsToInvite serve para pegar todos os dados atuais do array e a de baixo add um novo
      email
    ])

    event.currentTarget.reset() // reseta o formulário para que o email digitado não fique por la
  }

  function removeEmailToInvite(emailToRemove: string){
    const newEmailList = emailsToInvite.filter(email => email !== emailToRemove)

    setEmailsToInvite(newEmailList)
  }

  async function createTrip(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    console.log(eventStartAndEndDates)
    console.log(destination) 
    console.log(emailsToInvite)
    console.log(ownerEmail)
    console.log(ownerName)

    if(!destination){
      return
    }

    if(!ownerName || !ownerEmail){
      return
    }

    if(emailsToInvite.length === 0){
      return
    }

    if(!eventStartAndEndDates?.from || !eventStartAndEndDates.to){
      return
    }

    const response = await api.post('/trips', {
      destination,
      starts_at: eventStartAndEndDates?.from,
      ends_at: eventStartAndEndDates?.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail,
    })

    const { tripId } = response.data

    navigate(`/trips/${tripId}`)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10"> 
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua proxima viagem!</p>
        </div>

        <div className="space-y-4">
          <DestinationAndDateStep
            closeGuestInput={closeGuestInput}
            isGuestInputOpen={isGuestInputOpen}
            openGuestInput={openGuestInput}
            setDestination={setDestination}
            setEventStartAndEndDates={setEventStartAndEndDates}
            eventStartAndEndDates={eventStartAndEndDates}
          />

          {isGuestInputOpen && (
            <InviteGuestsStep 
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
              openGuestModal={openGuestModal}
            />
          )}
        </div>

        <p className="text-zinc-500 text-sm">Ao planejar uma viagem com plann.er você automaticamente concorda <br/>
        com os nossos <a className="text-zinc-300 underline" href="#"> termos de uso </a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>
        </p>
      </div>

      {isGuestModalOpen && (
        < InviteGuestsModal
            addNewEmailToInvite={addNewEmailToInvite}
            closeGuestModal={closeGuestModal}
            emailsToInvite={emailsToInvite}
            removeEmailToInvite={removeEmailToInvite}
        />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
        />
      )}

    </div>
  )
}
