import { useForm, useFieldArray } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { api_Service } from "../Api";
import { GlobalContext } from "../Context";
import { useNavigate } from "react-router-dom";

export function AddReceta(){
    const { user } = useContext(GlobalContext)
    const navigate = useNavigate()
    const [numIngredientes, setNumIngredientes] = useState(0);
    const [numPasos, setNumPasos] = useState(0)

    const schema = yup.object().shape({
        nombreReceta: yup.string().required('El campo Nombre es obligatorio'),
        descripcionReceta: yup.string().required('El campo Descripcion es obligatorio'),
        tiempoReceta: yup.string().required('El campo Tiempo es obligatorio'),
        dificultadReceta: yup.string().required('El campo Dificultad es obligatorio'),
        imagenReceta: yup.string().required('El campo Imagen es obligatorio'),
        tipoReceta: yup.string().required('El campo Imagen es obligatorio'),
        ingredientes: yup.array().of(
        yup.object().shape({
            nombreIngrediente: yup.string().required('Nombre del ingrediente es obligatorio'),
            descripcionIngrediente: yup.string().required('Descripción del ingrediente es obligatoria'),
            cantidadIngrediente: yup.number().required('Cantidad del ingrediente es obligatoria'),
            tipoIngrediente: yup.string().required('Tipo de ingrediente es obligatorio'),
        })),
        pasos: yup.array().of(
            yup.object().shape({
                descripcionPaso: yup.string().required('Descripción de los pasos es obligatoria'),
                ordenPaso: yup.string().required('Descripción de los pasos es obligatoria')
            })),
    });

    const { handleSubmit, register, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const { fields: ingredientesFields, append: ingredientesAppend, remove: ingredientesRemove } = useFieldArray({
        control,
        name: 'ingredientes',
    });

    const { fields: pasosFields, append: pasosAppend, remove: pasosRemove } = useFieldArray({
        control,
        name: 'pasos',
    });

    const onSubmit = async (data) => {
        if(numPasos === 0){
            alert('Debe añadir al menos 1 paso')
        } else if(numIngredientes === 0) {
            alert('Debe añadir al menos 1 ingrediente')
        } else {
            if (await api_Service.checkNombreRecetaExist(data.nombreReceta) === false){
                await api_Service.insertReceta(data, user.id)
                const idReceta = await api_Service.getRecetaByNombre(data.nombreReceta)
                data.ingredientes.map(async (ingrediente) => {
                    if(await api_Service.checkNombreIngredienteExist(ingrediente.nombreIngrediente) === false){
                        await api_Service.insertIngrediente(ingrediente)
                    }
                    const idIngrediente = await api_Service.getIngredienteByNombre(ingrediente.nombreIngrediente)
                    await api_Service.insertIngredienteReceta(idReceta, idIngrediente, ingrediente.cantidadIngrediente)
                })
                data.pasos.map(async (paso, index) => {
                    await api_Service.insertPaso(paso.descripcionPaso, idReceta, (index + 1))
                })

                navigate('/Receta/' + idReceta)
            } else {
                alert('El nombre de la Receta ya existe')
            }
        }
    };

    return(
    <div className="container m-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-3 rounded-t-2xl bg-indigo-600 shadow-md mt-3">
                <p className="text-2xl text-white font-semibold pb-1">Receta</p>
            </div>
            <div className="grid md:grid-cols-4 grid-cols-1 bg-gray-200 shadow-md gap-2 p-3">
                <div className="md:col-span-2 col-span-1">
                    <input 
                        type="text"
                        id="nombreReceta"
                        name="nombreReceta"
                        {...register('nombreReceta')}
                        className={errors.nombreReceta ? 'border rounded-lg px-4 py-2 w-full border-red-500' : 'border rounded-lg px-4 py-2 w-full'}
                        placeholder="Nombre"/>
                        {errors.nombreReceta && <p className="text-red-500 text-xs mt-1">{errors.nombreReceta.message}</p>}
                </div>
                <div className="col-span-1">
                    <div className="relative rounded-md shadow-sm">
                        <input
                        type="number"
                        name="tiempoReceta"
                        id="tiempoReceta"
                        {...register('tiempoReceta')}
                        className={errors.tiempoReceta ? 'border rounded-lg px-4 py-2 w-full border-red-500' : 'border rounded-lg px-4 py-2 w-full'}
                        placeholder="Tiempo"
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center">
                            <p>min</p>
                        </div>
                    </div>
                </div>
                <div className="col-span-1">
                    <select
                    id="dificultadReceta"
                    name="dificultadReceta"
                    {...register('dificultadReceta')}
                    className={errors.dificultadReceta ? 'border rounded-lg px-4 py-2 w-full border-red-500' : 'border rounded-lg px-4 py-2 w-full'}>
                            <option value={'Facil'}>Fácil</option>
                            <option value={'Medio'}>Medio</option>
                            <option value={'Dificil'}>Difícil</option>
                    </select>
                    {errors.dificultadReceta && <p className="text-red-500 text-xs mt-1">{errors.dificultadReceta.message}</p>}
                </div>
            </div>
            <div className="grid md:grid-cols-8 grid-cols-1 rounded-b-2xl bg-gray-200 shadow-md gap-2 md:pt-3 pr-3 pl-3 pb-3">
                <div className="md:col-span-4 col-span-1">
                    <input 
                        type="descripcionReceta"
                        id="descripcionReceta"
                        name="descripcionReceta"
                        {...register('descripcionReceta')}
                        className={errors.descripcionReceta ? 'border rounded-lg px-4 py-2 w-full border-red-500' : 'border rounded-lg px-4 py-2 w-full'}
                        placeholder="Descripcion"/>
                    {errors.descripcionReceta && <p className="text-red-500 text-xs mt-1">{errors.descripcionReceta.message}</p>}
                </div>
                <div className="md:col-span-2 col-span-1">
                    <input 
                        type="imagenReceta"
                        id="imagenReceta"
                        name="imagenReceta"
                        {...register('imagenReceta')}
                        className={errors.imagenReceta ? 'border rounded-lg px-4 py-2 w-full border-red-500' : 'border rounded-lg px-4 py-2 w-full'}
                        placeholder="Imagen"/>
                    {errors.imagenReceta && <p className="text-red-500 text-xs mt-1">{errors.imagenReceta.message}</p>}
                </div>
                <div className="md:col-span-2 col-span-1">
                    <select
                    id="tipoReceta"
                    name="tipoReceta"
                    {...register('tipoReceta')}
                    className={errors.tipoReceta ? 'border rounded-lg px-4 py-2 w-full border-red-500' : 'border rounded-lg px-4 py-2 w-full'}>
                            <option value={'1'}>Repostería</option>
                            <option value={'2'}>Cocina</option>
                    </select>
                    {errors.tipoReceta && <p className="text-red-500 text-xs mt-1">{errors.tipoReceta.message}</p>}
                </div>
            </div>
            <div className="p-3 rounded-t-2xl bg-indigo-600 shadow-md mt-3">
                <p className="text-2xl text-white font-semibold pb-1">Ingredientes</p>
            </div>
            {ingredientesFields.map((item, index) => (
                <div key={item.id} className="grid md:grid-cols-12 grid-cols-3 bg-gray-200 shadow-md gap-2 p-3">
                    <div className="col-span-3">
                        <input 
                            type="text"
                            id={`ingredientes[${index}].nombreIngrediente`}
                            name={`ingredientes[${index}].nombreIngrediente`}
                            {...register(`ingredientes[${index}].nombreIngrediente`)}
                            className="border rounded-lg px-4 py-2 w-full"
                            placeholder="Nombre"/>
                    </div>
                    <div className="md:col-span-6 col-span-3">
                        <div className="relative rounded-md shadow-sm">
                            <input 
                                type="text"
                                id={`ingredientes[${index}].descripcionIngrediente`}
                                name={`ingredientes[${index}].descripcionIngrediente`}
                                className="border rounded-lg px-4 py-2 w-full"
                                placeholder="Descripcion"
                                {...register(`ingredientes[${index}].descripcionIngrediente`)}/>                    
                            </div>
                    </div>
                    <div className="col-span-1">
                        <div className="relative rounded-md shadow-sm">
                            <input 
                                type="number"
                                id={`ingredientes[${index}].cantidadIngrediente`}
                                name={`ingredientes[${index}].cantidadIngrediente`}
                                className="border rounded-lg px-4 py-2 w-full"                            
                                placeholder="Cantidad"
                                {...register(`ingredientes[${index}].cantidadIngrediente`)}/>                    
                        </div>
                    </div>
                    <div className="col-span-1">
                        <select
                        id="tipoIngrediente"
                        name="tipoIngrediente"
                        className="border rounded-lg px-4 py-2 w-full"                    
                        {...register(`ingredientes[${index}].tipoIngrediente`)}>
                                <option value={'1'}>g</option>
                                <option value={'2'}>ml</option>
                                <option value={'3'}>ud</option>
                        </select>                
                    </div>
                    <div className="col-span-1 text-center">
                        <button
                            type="button"
                            onClick={() =>{ ingredientesRemove(index); setNumIngredientes(numIngredientes - 1) }}
                            className="w-full wd:w-10 h-10 rounded-md bg-red-600 px-1 font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                            <MinusIcon aria-hidden="true" width={40} height={40} className="m-auto"/>
                        </button>
                    </div>
                </div>
            ))}
            <div className="rounded-b-2xl bg-gray-200 shadow-mdp-3 text-center p-3">
                <button
                    type="button"
                    onClick={() => {
                        ingredientesAppend({
                        nombreIngrediente: '',
                        descripcionIngrediente: '',
                        cantidadIngrediente: 0,
                        tipoIngrediente: '1',
                        });
                        setNumIngredientes(numIngredientes + 1);
                    }}
                    className="md:w-32 w-full h-10 rounded-md bg-green-600 px-1 font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                    <PlusIcon aria-hidden="true" width={40} height={40} className="m-auto" />
                </button>
            </div>
            <div className="p-3 rounded-t-2xl bg-indigo-600 shadow-md mt-3">
                <p className="text-2xl text-white font-semibold pb-1">Pasos</p>
            </div>
            {pasosFields.map((item, index) => (
                <div key={item.id} className="grid md:grid-cols-12 grid-cols-1 bg-gray-200 shadow-md gap-2 p-3">
                    <div className="col-span-1">
                        <input 
                                type="text"
                                id={`pasos[${index}].ordenPaso`}
                                name={`pasos[${index}].ordenPaso`}
                                {...register(`pasos[${index}].ordenPaso`)}
                                className="border rounded-lg px-4 py-2 w-full text-center bg-indigo-600 text-md text-white"
                                placeholder="Descripcion"
                                value={index + 1}
                                readOnly/>
                    </div>
                    <div className="md:col-span-10 col-span-1">
                        <input 
                            type="text"
                            id={`pasos[${index}].descripcionPaso`}
                            name={`pasos[${index}].descripcionPaso`}
                            {...register(`pasos[${index}].descripcionPaso`)}
                            className="border rounded-lg px-4 py-2 w-full"
                            placeholder="Descripcion"/>
                    </div>
                    <div className="col-span-1 text-center">
                        <button
                            type="button"
                            onClick={() => { pasosRemove(index); setNumPasos(numPasos - 1 ) }}
                            className="w-full wd:w-10 h-10 rounded-md bg-red-600 px-1 font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                            <MinusIcon aria-hidden="true" width={40} height={40} className="m-auto"/>
                        </button>
                    </div>
                </div>
            ))}
            <div className="rounded-b-2xl bg-gray-200 shadow-mdp-3 text-center p-3">
                <button
                    type="button"
                    onClick={() => {
                        pasosAppend({
                        descripcionPaso: ''
                        });
                        setNumPasos(numPasos + 1);
                    }}
                    className="md:w-32 w-full h-10 rounded-md bg-green-600 px-1 font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                    <PlusIcon aria-hidden="true" width={40} height={40} className="m-auto" />
                </button>
            </div>
            <div className="mt-3 m-auto text-right">
                <button 
                    className="w-fit rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
                    type="submit">
                        Añadir
                </button>
            </div>
        </form>
    </div>
    )
}