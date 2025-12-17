import React from 'react';
import { Link, QrCode, Grid3x3, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileCreateMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLink: () => void;
  onCreateQRCode: () => void;
  onCreateLinkInBio: () => void;
}

export function MobileCreateMenu({
  isOpen,
  onClose,
  onCreateLink,
  onCreateQRCode,
  onCreateLinkInBio
}: MobileCreateMenuProps) {
  // Bloquer le scroll du body quand le menu est ouvert
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          />

          {/* Menu Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl pb-safe"
          >
            {/* Handle bar */}
            <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#0066ff]">+</span>
                    <h2 className="text-gray-900">Créer...</h2>
                  </div>
                  <p className="text-sm text-gray-500">Choisissez ce que vous voulez créer.</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="px-6 py-6 pb-8 space-y-3">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onCreateLink();
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-2xl hover:border-[#0066ff] hover:bg-blue-50/50 transition-all duration-200 group active:scale-[0.97]"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-[#0066ff] transition-colors duration-200">
                  <Link className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-200" />
                </div>
                <span className="text-gray-900 flex-1 text-left">Un nouveau lien</span>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onCreateQRCode();
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-2xl hover:border-[#0066ff] hover:bg-blue-50/50 transition-all duration-200 group active:scale-[0.97]"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-[#0066ff] transition-colors duration-200">
                  <QrCode className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-200" />
                </div>
                <span className="text-gray-900 flex-1 text-left">Un nouveau QR Code</span>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onCreateLinkInBio();
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-2xl hover:border-[#0066ff] hover:bg-blue-50/50 transition-all duration-200 group active:scale-[0.97]"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-[#0066ff] transition-colors duration-200">
                  <Grid3x3 className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-200" />
                </div>
                <span className="text-gray-900 flex-1 text-left">Un nouveau Link in bio</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
