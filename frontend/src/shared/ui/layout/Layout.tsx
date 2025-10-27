import { Header } from '@shared/ui/header/Header'
export const Layout: React.FC <React.PropsWithChildren>= ({children}) => {
  return (
    <>
    <Header/>
      {children}
    </>

  )
}