import {  act, createContext, useState } from 'react';

export const Appcontext= createContext()

function Appcontextprovider({children}) {


    let[active,setactive]=useState('none')






let value={active,setactive} 

    return ( 
    <Appcontext.Provider value={value}>
        {children}
    </Appcontext.Provider>
     );
}

export default Appcontextprovider;
