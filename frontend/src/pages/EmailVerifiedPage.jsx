import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const EmailVerifiedPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 p-4">
      <div className="bg-white/10 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <FiCheckCircle className="text-green-400" size={72} />
        <h2 className="text-2xl font-bold mt-4 mb-2 text-white text-center">¡Correo verificado correctamente!</h2>
        <p className="text-white text-center mb-4">
          Serás redirigido al login en 5 segundos…
        </p>
      </div>
    </div>
  );
};

export default EmailVerifiedPage;
