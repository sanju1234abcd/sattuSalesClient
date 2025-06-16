import React from 'react'
import { Navigate, Outlet, useParams, useSearchParams } from 'react-router-dom'

const Protected = ({children}) => {
  const {id} = useParams()
  
  if( id == "jackwell"){
          return children ? children : <Outlet/>
        }
        else{
          return <Navigate to ={'/'}/>
        }

}

export default Protected