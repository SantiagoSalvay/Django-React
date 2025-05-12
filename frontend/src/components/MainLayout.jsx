import EnhancedNavbar from './EnhancedNavbar'
import EnhancedFooter from './EnhancedFooter'

const MainLayout = ({ children }) => {
  return (
    <>
      <EnhancedNavbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 max-w-7xl">
        {children}
      </main>
      <EnhancedFooter />
    </>
  )
}

export default MainLayout