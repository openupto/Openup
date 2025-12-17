import { X, Link2, QrCode, Grid3x3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreateMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLink: () => void;
  onCreateQRCode: () => void;
  onCreateBio: () => void;
  isMobile?: boolean;
}

export function CreateMenu({ 
  isOpen, 
  onClose, 
  onCreateLink, 
  onCreateQRCode, 
  onCreateBio,
  isMobile = false
}: CreateMenuProps) {
  const menuItems = [
    {
      icon: Link2,
      label: 'Un nouveau lien',
      onClick: () => {
        onCreateLink();
        onClose();
      }
    },
    {
      icon: QrCode,
      label: 'Un nouveau QR Code',
      onClick: () => {
        onCreateQRCode();
        onClose();
      }
    },
    {
      icon: Grid3x3,
      label: 'Un nouveau Link in bio',
      onClick: () => {
        onCreateBio();
        onClose();
      }
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop avec blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ 
              opacity: 0,
              scale: 0.95,
              y: isMobile ? 20 : 0
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{ 
              opacity: 0,
              scale: 0.95,
              y: isMobile ? 20 : 0
            }}
            transition={{ 
              type: "spring",
              duration: 0.3,
              bounce: 0.3
            }}
            className={`
              fixed z-[61] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl
              ${isMobile 
                ? 'bottom-20 left-4 right-4 max-w-[calc(100vw-2rem)]' 
                : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md'
              }
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3399ff] rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">+</span>
                </div>
                <h2 className="text-gray-900 dark:text-white">Créer...</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Subtitle */}
            <p className="px-6 pb-4 text-sm text-gray-500 dark:text-gray-400">
              Choisissez ce que vous voulez créer.
            </p>

            {/* Menu Items */}
            <div className="px-4 pb-4 space-y-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#3399ff] hover:bg-[#3399ff]/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#3399ff] group-hover:text-white transition-colors">
                    <item.icon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
