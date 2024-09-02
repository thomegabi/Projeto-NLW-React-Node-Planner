import { ArrowRight, Calendar, MapPin, Settings2, X } from "lucide-react";
import { Button } from "../../../components/button";
import { useState } from "react";
import { DateRange, DayPicker} from "react-day-picker";
import "react-day-picker/style.css";
import { format } from 'date-fns'

interface DestinationAndDateStepProps{
  isGuestInputOpen: boolean
  eventStartAndEndDates: DateRange | undefined
  closeGuestInput: () => void
  openGuestInput: () => void
  setDestination: (destination: string) => void
  setEventStartAndEndDates: (dates: DateRange | undefined) => void
}


export function DestinationAndDateStep({ closeGuestInput, isGuestInputOpen, openGuestInput, setDestination, eventStartAndEndDates, setEventStartAndEndDates } : DestinationAndDateStepProps ) {
  const [isDatePickerOpen, setDatePickerOpen] = useState(false)
  //const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>(undefined) // isso serve pra conseguir visualizar a seleção de datas

  function openDatePicker(){
    return setDatePickerOpen(true)
  }

  function closeDatePicker(){
    return setDatePickerOpen(false)
  }

  const displayedDate = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to // esse .from serve pra mostrar a data de inicio e o to a de fim
  ? format(eventStartAndEndDates.from, "d' de 'LLL").concat(' até ').concat(format(eventStartAndEndDates.to, "d' de 'LLL")) : null

  return (
    <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
      <div className="flex items-center gap-2 flex-1">
        <MapPin className="size-5 text-zinc-400"/>
        <input 
          disabled={isGuestInputOpen} 
          type="text" 
          placeholder="Para onde você vai?" 
          className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" 
          onChange={event => setDestination(event.target.value)} /*esse event.target.value passa o valor do evento js como parametro da função */
        />
      </div>

      <button onClick={openDatePicker} disabled={isGuestInputOpen} className="flex items-center gap-2 text-left w-[240px]">
        <Calendar className="size-5 text-zinc-400"/>
        <span className="text-lg text-zinc-400 w-40 flex-1">
          {displayedDate || 'Quando?'}
        </span>
      </button>

      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold h- ">Selecione uma data</h2>
                <button type="button" onClick={closeDatePicker}>
                  <X className="size-5 text-zinc-400"/>
                </button>
              </div>
            </div>
            <DayPicker 
              mode="range" 
              selected={eventStartAndEndDates} 
              onSelect={setEventStartAndEndDates}
              classNames={{
                selected: `text-white`, // Highlight the selected day
              }}
            />
          </div>
        </div>
      )}

      <div className="w-px h-6 bg-zinc-800"/>

      {isGuestInputOpen ? (
        <Button onClick={closeGuestInput} variant="secondary">
          Alterar local/data
          <Settings2 className="size-5 text-zinc-200"/>
        </Button>
      ) : (
        <Button onClick={openGuestInput} variant="primary">
          Continuar
          <ArrowRight className="size-5 text-lime-950"/>
        </Button>
      )}

    </div>
  )
}