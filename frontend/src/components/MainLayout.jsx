import Navbar from './Navbar'

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 max-w-7xl">
        {children}
      </main>
      <footer className="text-center p-4 sm:p-6 text-white/60 mt-10 sm:mt-20">
        <p>© {new Date().getFullYear()} Todo Electro. Todos los derechos reservados.</p>
      </footer>
    </>
  )
}

export default MainLayout