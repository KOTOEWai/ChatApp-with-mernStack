
import Home from '../src/App'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
function Index(){
   const routes = [
    {
        path: '/',
        element: <Home/>

    }
   ]


   const router = createBrowserRouter(routes, {
    future: {
      v7_startTransition: true,
    },
  });

  return <RouterProvider router={router} />;
}

export default Index;