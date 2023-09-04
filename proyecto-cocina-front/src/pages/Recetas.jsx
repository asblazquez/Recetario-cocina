import { useState, useEffect } from "react"
import { api_Service } from "../Api"
import { useNavigate, Link } from 'react-router-dom';

export function Recetas(){
    const [ recetas, setRecetas ] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
      const updateRecetas = async () => {
        setRecetas(await api_Service.getAllRecetas())
      }
    
      updateRecetas()
    }, [])

    const navigateToReceta = (id) => {
        navigate('/receta/' + id)
    }

    return(
        <div className="container m-auto">
            <Link 
                className="fixed bottom-14 right-14 z-10 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
                to='/AddReceta'>
                    Añadir Receta
            </Link>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
            {recetas.map((receta, index) => {
                return(
                <div key={index}
                    onClick={() => { navigateToReceta(receta.id) }}
                    className="border-2 cursor-pointer border-transparent col-span-1 w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-3 transform transition duration-300 hover:border-indigo-600">
                    <div className="absolute rounded-br-xl bg-indigo-600 text-sm text-white font-semibold pt-1 pb-1 pl-2 pr-2">
                        {receta.tiempo + ' min'}
                    </div>
                    <div className="md:flex">
                        <div className="md:flex-shrink-0">
                            <img
                            className="h-48 w-full object-cover md:w-48"
                            src={receta.imagen}
                            alt="Imagen de la card"
                            />
                        </div>
                        <div className="p-8">
                            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                            {receta.nombre}
                            </div>
                            <p className="mt-2 text-gray-500">{receta.descripcion}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 grid grid-cols-2 p-4">
                        <div className="col-span-1">
                            <p className="text-sm font-medium text-indigo-600">{receta.tipo}</p>
                        </div>
                        <div className="col-span-1">
                            <p className="text-sm font-medium text-indigo-600 text-right">{receta.dificultad}</p>
                        </div>
                    </div>
                </div>
                )
            })}
            </div>         
        </div>
    )
}