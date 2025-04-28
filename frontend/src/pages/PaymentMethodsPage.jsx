import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCreditCard, FiDollarSign, FiSmartphone, FiGlobe } from 'react-icons/fi'
import { getPaymentMethods } from '../api/productApi'

const PaymentMethodsPage = () => {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true)
        const data = await getPaymentMethods()
        setPaymentMethods(data)
      } catch (err) {
        setError('Error al cargar los métodos de pago')
        console.error('Error fetching payment methods:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPaymentMethods()
  }, [])
  
  // Default payment methods if API doesn't return any
  const defaultPaymentMethods = [
    {
      id: 'card',
      name: 'Tarjetas de Crédito/Débito',
      description: 'Aceptamos Visa, MasterCard, American Express y otras tarjetas de crédito principales. Procesamiento seguro de pagos con cifrado de extremo a extremo.',
      icon: <FiCreditCard className="text-4xl text-neon-blue" />
    },
    {
      id: 'transfer',
      name: 'Transferencia Bancaria',
      description: 'Transferencia directa a nuestra cuenta bancaria. Los productos se enviarán una vez que se confirme el pago.',
      icon: <FiDollarSign className="text-4xl text-neon-blue" />
    },
    {
      id: 'mobile',
      name: 'Pagos Móviles',
      description: 'Paga con tu dispositivo móvil a través de aplicaciones como Apple Pay, Google Pay o Samsung Pay para una experiencia rápida y sin contacto.',
      icon: <FiSmartphone className="text-4xl text-neon-blue" />
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Paga de forma segura utilizando tu cuenta de PayPal. Protección del comprador y proceso de pago simplificado.',
      icon: <FiGlobe className="text-4xl text-neon-blue" />
    }
  ]
  
  // Use API payment methods or fallback to defaults
  const displayPaymentMethods = paymentMethods.length > 0 ? paymentMethods : defaultPaymentMethods
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-orbitron text-red-400 mb-4">Error</h2>
        <p className="text-white/70">{error}</p>
      </div>
    )
  }
  
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-orbitron font-bold mb-4">
          <span className="text-white">Métodos de </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
            Pago
          </span>
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          En Todo Electro, ofrecemos varias opciones de pago seguras para que puedas elegir la que mejor se adapte a tus necesidades.
        </p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {displayPaymentMethods.map((method, index) => (
          <motion.div 
            key={method.id || index} 
            className="glassmorphism p-8 flex flex-col md:flex-row items-center gap-6 hover:border-neon-blue/50 transition-all"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 5px 15px rgba(0, 195, 255, 0.3)' 
            }}
          >
            <div className="bg-black/50 p-6 rounded-full">
              {method.icon || <FiCreditCard className="text-4xl text-neon-blue" />}
            </div>
            
            <div>
              <h3 className="text-xl font-orbitron font-bold mb-2 text-white">
                {method.name}
              </h3>
              <p className="text-white/70">
                {method.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-16 glassmorphism p-8">
        <h2 className="text-2xl font-orbitron font-bold mb-4 text-white">
          Información Importante
        </h2>
        <ul className="list-disc list-inside space-y-2 text-white/70">
          <li>Todos los pagos se procesan de forma segura con cifrado de 256 bits.</li>
          <li>No almacenamos información de tarjetas de crédito en nuestros servidores.</li>
          <li>Las órdenes se procesan una vez confirmado el pago.</li>
          <li>Para transferencias bancarias, por favor contacta a nuestro equipo de atención al cliente.</li>
          <li>Cualquier consulta sobre pagos, contáctanos a payments@todoelectro.com</li>
        </ul>
      </div>
    </div>
  )
}

export default PaymentMethodsPage 