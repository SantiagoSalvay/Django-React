import { FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CheckEmailPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 p-4">
    <div className="bg-white/10 rounded-xl shadow-lg p-8 flex flex-col items-center">
      <FiMail className="text-neon-blue" size={64} />
      <h2 className="text-2xl font-bold mt-4 mb-2 text-white text-center">¡Revisa tu correo electrónico!</h2>
      <p className="text-white text-center mb-4">
        Te enviamos un email de verificación para activar tu cuenta.<br/>
        Si no lo encuentras, revisa la carpeta de spam.
      </p>
      <Link to="/login" className="btn-primary px-6 py-2 rounded-lg text-white font-bold bg-gradient-to-r from-blue-800 to-cyan-400 hover:from-blue-700 hover:to-cyan-300 transition-all">Ir a Iniciar Sesión</Link>
    </div>
  </div>
);

export default CheckEmailPage;
