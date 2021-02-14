import React, { useState } from 'react'

const MainContext = React.createContext()

const MainProvider = ({ children }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [modCode, setModCode] = useState('')
    const [isMod, setIsMod] = useState(false)

    return (
        <MainContext.Provider value={{ name, room, setName, setRoom, isMod, setIsMod, modCode, setModCode}}>
            {children}
        </MainContext.Provider>
    )
}

export { MainContext, MainProvider } 