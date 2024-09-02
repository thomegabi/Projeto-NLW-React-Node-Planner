import {  // tudo o que foi contruido desses imports está no tutorial do react router
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { CreateTripPage } from "./pages/create-trip";
import { TripDetailsPage } from "./trip-details";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateTripPage />,
  },

  {
    path: "/trips/:tripId",
    element: <TripDetailsPage/>,
  },
]);



export function App() { // ao colocar o export aqui ele obriga a colocar o nome correto da função ao invez de qualquer nome ao exportar default
  return <RouterProvider router={router} />
}
