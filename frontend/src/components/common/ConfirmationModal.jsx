import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'danger' 
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: {
      bg: 'from-rose-600 to-orange-600',
      icon: 'text-rose-400',
      button: 'bg-rose-600 hover:bg-rose-700',
      border: 'border-rose-500/30'
    },
    warning: {
      bg: 'from-amber-500 to-orange-500',
      icon: 'text-amber-400',
      button: 'bg-amber-500 hover:bg-amber-600',
      border: 'border-amber-500/30'
    },
    info: {
      bg: 'from-blue-500 to-cyan-500',
      icon: 'text-blue-400',
      button: 'bg-blue-500 hover:bg-blue-600',
      border: 'border-blue-500/30'
    }
  };

  const currentColors = colors[type];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

       
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-slate-800 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        >
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
          >
            <FaTimes className="w-5 h-5" />
          </button>

        
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${currentColors.bg} bg-opacity-20 mb-4`}>
            <FaExclamationTriangle className={`w-7 h-7 ${currentColors.icon}`} />
          </div>

        
          <h3 className="text-xl font-bold text-white mb-2">
            {title}
          </h3>

       
          <p className="text-slate-400 mb-6">
            {message}
          </p>

        
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 ${currentColors.button} text-white rounded-xl font-medium transition shadow-lg`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;