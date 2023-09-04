import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { api_Service } from "../Api"
import { TIPO_INGREDIENTE } from "../Constants"

export function Receta(){
    const { id } = useParams()

    const [receta, setReceta] = useState({})
    const [ingredientes, setIngredientes] = useState([])
    const [pasos, setPasos] = useState([])

    useEffect(() => {
      const updateReceta = async () => {
        setReceta(await api_Service.getRecetaById(id))
      }

      const updateIngredientes = async () => {
        setIngredientes(await api_Service.getIngredientesFromRecetaById(id))
      }

      const updatePasos = async () => {
        setPasos(await api_Service.getPasosFromRecetaById(id))
      }
    
      updateReceta()
      updateIngredientes()
      updatePasos()
    }, [id])

    return(
        <div className="container m-auto">
            <div className="grid md:grid-cols-3 grid-cols-1 mt-3 gap-2">
                <div className="col-span-1 m-auto">
                    <img
                        className="h-70 w-full object-cover shadow-md rounded-2xl"
                        src={receta.imagen}
                        alt="Imagen de la card"
                        />
                </div>
                <div className="md:col-span-2 col-span-1 p-3 rounded-2xl bg-indigo-600 shadow-md">
                    <p className="text-2xl text-white font-semibold pb-1">{receta.nombreReceta}</p>
                    <hr />
                    <p className="text-lg text-white font-semibold pt-1 pl-3">{receta.descripcion}</p>
                </div>
            </div>
            <div className="grid md:grid-cols-3 grid-cols-1 mt-2 gap-2">
                <div className="col-span-1 p-3 rounded-2xl bg-indigo-600 shadow-md">
                    <p className="text-2xl text-white font-semibold pb-1">Ingredientes</p>
                    <hr />
                    {ingredientes.map((ingrediente, index) => {
                        return(
                            <div key={index} className="grid grid-cols-2 gap-2">
                                <div className="col-span-1">
                                    <p className="text-lg text-white font-semibold pt-1 pl-3">{ingrediente.nombre}</p>
                                </div>
                                <div className="col-span-1">
                                    <p className="text-lg text-white font-semibold pt-1 pr-3 text-right">{ingrediente.cantidad + ' ' + TIPO_INGREDIENTE[ingrediente.tipo_id]}</p>
                                </div>
                            </div>
                        )
                    })}                    
                </div>
                <div className="md:col-span-2 col-span-1 p-3 rounded-2xl bg-gray-600 shadow-md">
                    <p className="text-2xl text-white font-semibold pb-1">Pasos</p>
                    <hr />
                    {pasos.map((paso, index) => {
                        return(
                            <div key={index} className="grid md:grid-cols-12 grid-cols-4 gap-4 p-3">
                                <div className="col-span-1 self-center bg-indigo-600 rounded-2xl">
                                    <p className="text-xl text-white font-semibold text-center">{index}</p>
                                </div>
                                <div className="md:col-span-11 col-span-3">
                                    <p className="text-lg text-white font-semibold">{paso.descripcion}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>          
        </div>
    )
}