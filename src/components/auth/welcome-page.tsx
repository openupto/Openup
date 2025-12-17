import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import openupLogo from 'figma:asset/10fb543094c34b061a3706fe85bbb343a6812697.png';

export function WelcomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignUp = () => {
    window.location.href = '/signup';
  };

  const handleSignIn = () => {
    window.location.href = '/login';
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#006EF7] via-[#4A9FFF] to-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Social Media Icons Floating */}
        <motion.div
          className="absolute top-[15%] left-[8%] w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
            <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
            <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
            <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-[25%] left-[15%] w-14 h-14 md:w-16 md:h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 48 48">
            <radialGradient id="yOrnnhliCrdS2gy~4tD8ma" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fd5"/>
              <stop offset=".328" stopColor="#ff543f"/>
              <stop offset=".348" stopColor="#fc5245"/>
              <stop offset=".504" stopColor="#e64771"/>
              <stop offset=".643" stopColor="#d53e91"/>
              <stop offset=".761" stopColor="#cc39a4"/>
              <stop offset=".841" stopColor="#c837ab"/>
            </radialGradient>
            <path fill="url(#yOrnnhliCrdS2gy~4tD8ma)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"/>
            <radialGradient id="yOrnnhliCrdS2gy~4tD8mb" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#4168c9"/>
              <stop offset=".999" stopColor="#4168c9" stopOpacity="0"/>
            </radialGradient>
            <path fill="url(#yOrnnhliCrdS2gy~4tD8mb)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"/>
            <path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"/>
            <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"/>
            <path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-[45%] left-[5%] w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 48 48">
            <path fill="#0078d4" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5	V37z"/>
            <path d="M30,37V26.901c0-1.689,0.819-2.698,2.192-2.698c0.815,0,1.086,0.535,1.086,1.735V37h5.039v-11.459	c0-3.804-1.586-5.471-4.796-5.471c-2.233,0-3.218,1.153-3.521,1.93V20.5h-5v16.5H30z M11.923,20.5h5.025V37h-5.025V20.5z M14.517,13.5c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3S16.174,13.5,14.517,13.5z" opacity=".05"/>
            <path d="M30.5,36.5v-9.599c0-1.973,1.031-2.898,2.692-2.898c0.887,0,1.308,0.661,1.308,2.235v10.262h4.039v-11.459	c0-3.452-1.476-4.941-4.296-4.941c-2.09,0-3.015,1.065-3.443,1.816v-1.216h-4.5v15.8H30.5z M12.423,21h4.025v15h-4.025V21z M14.517,14c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5s2.5-1.119,2.5-2.5S15.898,14,14.517,14z" opacity=".07"/>
            <path fill="#fff" d="M12.923,35.5h3.025V21.5h-3.025V35.5z M14.517,14.5c-1.105,0-2,0.895-2,2s0.895,2,2,2s2-0.895,2-2	S15.622,14.5,14.517,14.5z M31,35.5h3.039V24.041c0-1.574-0.421-2.041-1.308-2.041c-1.661,0-2.192,0.925-2.192,2.898V35.5H31z M26.539,22.5h3.5v1.215c0.428-0.75,1.354-1.816,3.443-1.816c2.82,0,4.296,1.489,4.296,4.941v10.66h-3.039V26.738	c0-1.574-0.421-2.235-1.308-2.235c-1.661,0-2.692,0.925-2.692,2.898v7.598h-3V22.5z"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-[60%] left-[12%] w-11 h-11 md:w-13 md:h-13 bg-black rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-[30%] left-[22%] w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        >
          <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 48 48">
            <path fill="#1ed760" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"/>
            <path fill="#fff" d="M32.5,28.5c-0.276,0-0.5-0.224-0.5-0.5c0-3.59-2.91-6.5-6.5-6.5S19,24.41,19,28c0,0.276-0.224,0.5-0.5,0.5S18,28.276,18,28c0-4.142,3.358-7.5,7.5-7.5s7.5,3.358,7.5,7.5C33,28.276,32.776,28.5,32.5,28.5z"/>
            <path fill="#fff" d="M36,26c-0.276,0-0.5-0.224-0.5-0.5c0-6.065-4.935-11-11-11s-11,4.935-11,11c0,0.276-0.224,0.5-0.5,0.5S12,25.776,12,25.5c0-6.617,5.383-12,12-12s12,5.383,12,12C36.5,25.776,36.276,26,36,26z"/>
            <path fill="#fff" d="M39.5,23.5c-0.276,0-0.5-0.224-0.5-0.5c0-8.271-6.729-15-15-15S9,14.729,9,23c0,0.276-0.224,0.5-0.5,0.5S8,23.276,8,23c0-8.822,7.178-16,16-16s16,7.178,16,16C40,23.276,39.776,23.5,39.5,23.5z"/>
          </svg>
        </motion.div>

        {/* Right side icons */}
        <motion.div
          className="absolute top-[20%] right-[10%] w-11 h-11 md:w-13 md:h-13 bg-white rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [0, 15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        >
          <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 48 48">
            <path fill="#9146FF" d="M40,5H8C6.343,5,5,6.343,5,8v32c0,1.657,1.343,3,3,3h32c1.657,0,3-1.343,3-3V8C43,6.343,41.657,5,40,5z"/>
            <g>
              <path fill="#FFF" d="M18,31.5L18,31.5c-0.828,0-1.5-0.672-1.5-1.5V21c0-0.828,0.672-1.5,1.5-1.5h0c0.828,0,1.5,0.672,1.5,1.5v9C19.5,30.828,18.828,31.5,18,31.5z"/>
              <path fill="#FFF" d="M24,31.5L24,31.5c-0.828,0-1.5-0.672-1.5-1.5V18c0-0.828,0.672-1.5,1.5-1.5h0c0.828,0,1.5,0.672,1.5,1.5v12C25.5,30.828,24.828,31.5,24,31.5z"/>
              <path fill="#FFF" d="M30,31.5L30,31.5c-0.828,0-1.5-0.672-1.5-1.5V21c0-0.828,0.672-1.5,1.5-1.5h0c0.828,0,1.5,0.672,1.5,1.5v9C31.5,30.828,30.828,31.5,30,31.5z"/>
              <path fill="#FFF" d="M34,15l-3-3l-9,9l-6-6l-3,3l9,9L34,15z"/>
            </g>
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-[35%] right-[15%] w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [0, -20, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
          }}
        >
          <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 48 48">
            <path fill="#FF3D00" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"/>
            <path fill="#FFF" d="M20 31L20 17 32 24z"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-[35%] right-[8%] w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [0, 10, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
        >
          <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 48 48">
            <path fill="#0ea5e9" d="M4 14A2 2 0 0 1 6 12h12a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V14z"/>
            <path fill="#14b8a6" d="M24 14a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2v-8z"/>
            <circle cx="32" cy="32" r="6" fill="#8b5cf6"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-[25%] right-[20%] w-11 h-11 md:w-13 md:h-13 bg-white rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.8,
          }}
        >
          <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 48 48">
            <path fill="#0288d1" d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z"/>
            <path fill="#fff" d="M32 24c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 3.993 2.913 7.293 6.75 7.907V26h-2.25v-2H24v2h2.5v5.907C30.337 31.293 32 27.993 32 24z"/>
          </svg>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen px-6 py-8 md:py-12">
        {/* Logo Section */}
        <div className="flex-1 flex items-center justify-center w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img 
              src={openupLogo} 
              alt="OpenUp Logo" 
              className="w-[280px] md:w-[400px] lg:w-[500px] h-auto"
            />
          </motion.div>
        </div>

        {/* Buttons Section */}
        <motion.div
          className="w-full max-w-md space-y-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.button
            onClick={handleSignUp}
            className="w-full bg-[#006EF7] text-white py-4 rounded-full shadow-lg hover:bg-[#0052CC] transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            S'inscrire
          </motion.button>

          <motion.button
            onClick={handleSignIn}
            className="w-full bg-transparent text-[#006EF7] py-4 rounded-full border-2 border-transparent hover:border-[#006EF7] transition-all duration-300"
            whileHover={{ scale: 1.02, borderColor: '#006EF7' }}
            whileTap={{ scale: 0.98 }}
          >
            Se connecter
          </motion.button>
        </motion.div>

        {/* Bottom Spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
