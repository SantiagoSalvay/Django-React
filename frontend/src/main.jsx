import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('Intentando renderizar la aplicación React...');
    
    const rootElement = document.getElementById('root');
    console.log('Elemento root encontrado:', rootElement);
    
    if (!rootElement) {
      console.error('No se pudo encontrar el elemento con id "root"');
      return;
    }
    
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
    
    console.log('Aplicación React renderizada correctamente');
  } catch (error) {
    console.error('Error al renderizar la aplicación React:', error);
  }
}); 