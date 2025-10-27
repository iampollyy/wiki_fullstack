import { Routes, Route } from 'react-router-dom'
import { RoutesConfig } from './router.tsx'


export const AppRoutes = () => {
  return (
    <Routes>
      {
        RoutesConfig.map(
          ({ path, element}) =>
             <Route key={path} path={path} element={element} />
        )
      }
    </Routes>
  )
}