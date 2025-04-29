import Navbar from './Navbar'

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <footer className="text-center p-6 text-white/60 mt-20">
        <p>© {new Date().getFullYear()} Todo Electro. Todos los derechos reservados.</p>
      </footer>
    </>
  )
}

export default MainLayout