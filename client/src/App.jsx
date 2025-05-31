import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Body from './Pages/Body'
import Auth from './Pages/Auth'

import Notifications from './Pages/Notifications'
import { RouterProvider } from 'react-router'
import { Toaster } from './components/ui/sonner'
import Home from './Pages/Home'
import { SocketProvider } from './lib/Socketcontext'

const App = () => {

  const app=createBrowserRouter([{
    path:"/",
    element:<Body/>,
    children:[
      {
        path:"/auth",
        element:<Auth/>

      },
      {
        path:"/",
        element:<Home/>
      },{
        path:'/notifications',
        element:<Notifications/>
      }
    ]
  }])
  return (
    <SocketProvider>
      <main>
        <Toaster position="bottom-right" />
        <RouterProvider router={app} />
      </main>
    </SocketProvider>
  );
}

export default App