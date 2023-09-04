import { UserCircleIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useState } from "react";
import { GlobalContext } from "../Context";
import { api_Service } from "../Api"

export function LogIn(){
    const [loadLogIn, setLoadLogIn] = useState(true)
    return (
        <>
        { loadLogIn ? <LogInComponent setLoadLogIn={setLoadLogIn} /> : <RegisterComponent setLoadLogIn={setLoadLogIn} /> }  
        </>
    )
         
}

function LogInComponent(props){
    const { setLoadLogIn } = props
    const { updateUser } = useContext(GlobalContext)

    const schema = yup.object().shape({
        username: yup.string().required('El campo Usuario es obligatorio'),
        password: yup.string().required('El campo Contraseña es obligatorio'),
    });

    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    
    const onSubmit = async(data) => {
        try {        
            const response = await api_Service.checkLogIn(data.username, data.password)
            response !== null ? updateUser(response) : alert('Usuario o contraseña incorrectos')
          } catch (error) {
            console.error('Error al comprobar los datos con la BBDD: ', error)
          }
    };
    return(
        <div className="container h-screen m-auto flex items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 justify-center">
                    <div className="lg:col-start-4 md:col-start-3 col-start-3 lg:col-span-1 md:col-span-2 sm:col-span-2 col-span-2 self-center">
                        <UserCircleIcon className="block h-9 w-9 m-auto"/>
                    </div>
                    <div className="lg:col-span-5 md:col-span-5 sm:col-span-10 col-span-5">
                        <input 
                        type="text"
                        id="username"
                        name="username"
                        {...register('username')}
                        className={errors.password ? 'border rounded-lg px-4 py-2 w-full border-red-500' : 'border rounded-lg px-4 py-2 w-full'}
                        placeholder="Usuario"/>
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-12 justify-center mt-3">
                    <div className="lg:col-start-4 md:col-start-3 col-start-3 lg:col-span-1 md:col-span-2 sm:col-span-2 col-span-2 self-center">
                        <LockClosedIcon className="block h-9 w-9 m-auto"/>
                    </div>
                    <div className="lg:col-span-5 md:col-span-5 sm:col-span-10 col-span-5">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Contraseña"
                        {...register('password')}
                        className={errors.password ? 'border rounded-lg px-4 py-2 w-full border-red-500' : 'border rounded-lg px-4 py-2 w-full'}
                        />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-12 justify-center mt-3">
                    <div className="lg:col-start-9 md:col-start-9 sm:col-start-11 col-start-8 lg:col-span-1 md:col-span-1 sm:col-span-2 col-span-2">
                        <button 
                            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
                            type="submit">
                                Log In
                        </button>
                    </div>
                </div>
                <div className="w-full mt-3 text-center">
                    <p onClick={() => setLoadLogIn(false)} className="cursor-pointer">¿No tiene una cuenta? Registrese aquí</p>
                </div>
            </form>
        </div>
    )
}

function RegisterComponent(props){
    const { setLoadLogIn } = props

    const schema = yup.object().shape({
        username: yup.string().required('El campo Usuario es obligatorio'),
        password: yup.string().required('El campo Contraseña es obligatorio'),
        email: yup.string().required('El campo Email es obligatorio'),
        genero: yup.string().required('El campo Genero es obligatorio')
    });

    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    
    const onSubmit = async(data) => {
        try {
            const checkUser = await api_Service.checkUserExist(data.username)
            console.log(checkUser)
            if(!checkUser){
                await api_Service.insertUser(data.username, data.password, data.email, data.genero)
            } else {
                alert('El nombre de usuario ya existe')
            }
            setLoadLogIn(true)
          } catch (error) {
            console.error('Error al crear un nuevo usuario', error)
          }
    };
    return(
        <div className="container h-screen m-auto flex items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 justify-center gap-2">
                    <div className="col-span-6">
                        <input 
                        type="text"
                        id="username"
                        name="username"
                        {...register('username')}
                        className={errors.username ? 'border rounded-lg px-4 py-2 w-full border-red-500' : 'border rounded-lg px-4 py-2 w-full'}
                        placeholder="Usuario"/>
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>
                    <div className="col-span-6">
                        <input 
                        type="text"
                        id="password"
                        name="password"
                        {...register('password')}
                        className={errors.password ? 'border rounded-lg px-4 py-2 w-full border-red-500' : 'border rounded-lg px-4 py-2 w-full'}
                        placeholder="Password"/>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                </div>  
                <div className="grid grid-cols-12 justify-center gap-2 mt-3">
                    <div className="col-span-9">
                        <input 
                        type="email"
                        id="email"
                        name="email"
                        {...register('email')}
                        className={errors.email ? 'border rounded-lg px-4 py-2 w-full border-red-500' : 'border rounded-lg px-4 py-2 w-full'}
                        placeholder="Email"/>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="col-span-3">
                        <select
                        id="genero"
                        name="genero"
                        {...register('genero')}
                        className={errors.genero ? 'border rounded-lg px-4 py-2 w-full border-red-500' : 'border rounded-lg px-4 py-2 w-full'}>
                            <option value={'Masculino'}>Masculino</option>
                            <option value={'Femenino'}>Femenino</option>
                            <option value={'Otro'}>Otro</option>
                        </select>
                        {errors.genero && <p className="text-red-500 text-xs mt-1">{errors.genero.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-12 justify-center mt-3">
                    <div className="lg:col-start-9 md:col-start-9 sm:col-start-11 col-start-8 lg:col-span-1 md:col-span-1 sm:col-span-2 col-span-2">
                        <button 
                            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
                            type="submit">
                                Registrarse
                        </button>
                    </div>
                </div>
                <div className="w-full mt-3 text-center">
                    <p onClick={() => setLoadLogIn(true)} className="cursor-pointer w-fit m-auto">¿Ya tiene una cuenta? Inicie sesión aquí</p>
                </div>
            </form>
        </div>
    )
}