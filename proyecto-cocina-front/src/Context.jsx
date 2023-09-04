import { useState, createContext } from 'react'

const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')))

  const updateUser = (newUser) => {
    setUser(newUser)
    sessionStorage.setItem('user', JSON.stringify(newUser))
  }

  const contextValue = {
    user,
    updateUser
  }

  return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
  )
}

export { GlobalContext, GlobalProvider }