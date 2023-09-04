import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar';
import { useContext } from 'react';
import { GlobalContext } from './Context';
import { LogIn } from './pages/LogIn';
import { Receta } from './pages/Receta';
import { Recetas } from './pages/Recetas';
import { AddReceta } from './pages/AddReceta';


function App() {
  const { user } = useContext(GlobalContext)

  if (user === null) {
    return <LogIn />
  }
  return (
    <>  
    <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/Recetas' element={<Recetas />} />
          <Route path='/Receta/:id' element={<Receta />} />
          <Route path='AddReceta' element={<AddReceta />} />
        </Routes>    
    </BrowserRouter>
    </>
  )
}

export default App
