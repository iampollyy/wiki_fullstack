import { Layout } from "@shared/ui/layout/Layout"
import { ToastProvider } from "@shared/ui/toast/ToastContext"
import { AppRoutes } from "../router/routes"

function App() {

  return (
    <ToastProvider>
      <Layout>
        <main id="skip-to-content">
          <section className="content">
            <AppRoutes/>
          </section>
        </main>
      </Layout>
    </ToastProvider>
  )
}

export default App
