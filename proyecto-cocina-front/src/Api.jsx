import axios from "axios"

const BASE_URL = 'http://192.168.1.52:5000/'

export const api_Service = {
    checkUserExist: checkUserExist,
    getAllRecetas: getAllRecetas,
    getRecetaById: getRecetaById,
    checkLogIn: checkLogIn,
    insertUser: insertUser,
    getIngredientesFromRecetaById: getIngredientesFromRecetaById,
    getPasosFromRecetaById: getPasosFromRecetaById,
    insertReceta: insertReceta,
    checkNombreRecetaExist: checkNombreRecetaExist,
    getRecetaByNombre: getRecetaByNombre,
    checkNombreIngredienteExist: checkNombreIngredienteExist,
    insertIngrediente: insertIngrediente,
    getIngredienteByNombre: getIngredienteByNombre,
    insertIngredienteReceta: insertIngredienteReceta,
    insertPaso: insertPaso
}

/* Metodo que comprueba si un usuario existe */
export default async function checkUserExist(username){
    try{
        const result = await axios.get(`${BASE_URL}checkUserExist?username=${username}`)
        return result.data
    } catch(e){
        console.error(e.message)
    }
}

/* Metodo que obtiene todas las recetas */
async function getAllRecetas(){
    try{
        const result = await axios.get(`${BASE_URL}getAllRecetas`)
        return result.data
    } catch(e){
        console.error(e.message)
    }
}

/* Metodo que obtiene una receta por Id */
async function getRecetaById(id){
    try{
        const result = await axios.get(`${BASE_URL}getRecetaById?recetaId=${id}`)
        return result.data
    }catch(e){
        console.error(e.message)
    }
}

/* Metodo comprueba si el usuario y la contraseña son correctos */
async function checkLogIn(username, password){
    try{
        const result = await axios.get(`${BASE_URL}checkLogIn?username=${username}&password=${password}`)
        return result.data
    }catch(e){
        console.error(e.message)
    }
}

/* Metodo que inserta un usuario que recibe por parametros */
async function insertUser(username, password, email, genero){
    try{
        await axios.post(`${BASE_URL}insertUser?username=${username}&password=${password}&email=${email}&genero=${genero}`)
    }catch(e){
        console.error(e.message)
    }
}

/* Metodo que obtiene todos los ingredientes de una receta con sus cantidades */
async function getIngredientesFromRecetaById(id){
    try{
        const result = await axios.get(`${BASE_URL}getIngredientesFromRecetaById?id=${id}`)
        return result.data
    }catch(e){
        console.error(e.message)
    }
}

/* Metodo que obtiene todos los pasos de una receta con sus cantidades */
async function getPasosFromRecetaById(id){
    try{
        const result = await axios.get(`${BASE_URL}getPasosFromRecetaById?id=${id}`)
        return result.data
    }catch(e){
        console.error(e.message)
    }
}

/* Metodo que inserta una receta */
async function insertReceta(receta, userId){
    try{
        const result = await axios.post(`${BASE_URL}insertReceta?nombre=${receta.nombreReceta}&descripcion=${receta.descripcionReceta}&tiempo=${receta.tiempoReceta}&tipoId=${receta.tipoReceta}&userId=${userId}&dificultad=${receta.dificultadReceta}&imagen=${receta.imagenReceta}`)
        return result.data
    }catch(e){
        console.error(e.message)
    }
}

/* Metodo que inserta un ingrediente */
async function insertIngrediente(ingrediente){
    try{
        const result = await axios.post(`${BASE_URL}insertIngrediente?nombre=${ingrediente.nombreIngrediente}&descripcion=${ingrediente.descripcionIngrediente}&tipoId=${ingrediente.tipoIngrediente}`)
        return result.data
    }catch(e){
        console.error(e.message)
    }
}

/* Metodo que inserta un IngredienteReceta */
async function insertIngredienteReceta(recetaId, ingredienteId, cantidad){
    try{
        const result = await axios.post(`${BASE_URL}insertIngredienteReceta?recetaId=${recetaId}&ingredienteId=${ingredienteId}&cantidad=${cantidad}`)
        return result.data
    }catch(e){
        console.error(e.message)
    }
}

/* Metodo que inserta un Paso */
async function insertPaso(descripcion, recetaId, orden){
    try{
        const result = await axios.post(`${BASE_URL}insertPaso?descripcion=${descripcion}&recetaId=${recetaId}&orden=${orden}`)
        return result.data
    }catch(e){
        console.error(e.message)
    }
}

/* Metodo que comprueba si el nombre de la receta ya existe */
async function checkNombreRecetaExist(nombre){
    try{
        const result = await axios.get(`${BASE_URL}checkNombreRecetaExist?name=${nombre}`)
        return result.data
    }catch(e){
        console.error(e.message)
    }
}

/* Metodo que comprueba si el nombre de la receta ya existe */
async function checkNombreIngredienteExist(nombre){
    try{
        const result = await axios.get(`${BASE_URL}checkNombreIngredienteExist?name=${nombre}`)
        return result.data
    }catch(e){
        console.error(e.message)
    }
}

/* Metodo que obtiene una receta por el Nombre */
async function getRecetaByNombre(nombre){
    try{
        const result = await axios.get(`${BASE_URL}getRecetaByNombre?name=${nombre}`)
        return result.data
    }catch(e){
        console.error(e.message)
    }
}

/* Metodo que obtiene una receta por el Nombre */
async function getIngredienteByNombre(nombre){
    try{
        const result = await axios.get(`${BASE_URL}getIngredienteByNombre?name=${nombre}`)
        return result.data
    }catch(e){
        console.error(e.message)
    }
}