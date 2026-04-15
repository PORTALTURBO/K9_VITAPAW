import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PawPrint, Activity, Fingerprint, Lock } from 'lucide-react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#1B3A34] to-[#2E7D6F] flex flex-col items-center justify-center overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative flex flex-col items-center text-center"
      >
        <div className="relative mb-6">
          <div className="relative flex items-center justify-center w-32 h-32">
            <PawPrint className="text-white w-24 h-24 fill-current" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 flex justify-center">
              <Activity className="text-white w-12 h-12" strokeWidth={2.5} />
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h1 className="font-headline font-bold text-[28px] text-white tracking-wide">
            K9 VitalPaw
          </h1>
          <p className="font-body text-white/70 text-sm font-medium tracking-wide">
            Centro de Salud Canino
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const LockScreen: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [usePin, setUsePin] = useState(false);
  const [pin, setPin] = useState('');

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(onUnlock, 300); // Simulate verification
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-gradient-to-br from-[#1B3A34] to-[#2E7D6F] flex flex-col items-center justify-between py-16 px-8 overflow-hidden">
      <header className="relative z-10 flex flex-col items-center mt-12">
        <div className="w-16 h-16 mb-4 flex items-center justify-center bg-white/10 rounded-2xl backdrop-blur-sm shadow-lg">
          <PawPrint className="text-white w-8 h-8 fill-current" />
        </div>
        <h1 className="font-headline font-bold text-3xl tracking-tight text-white">K9 VitalPaw</h1>
      </header>

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs">
        <AnimatePresence mode="wait">
          {!usePin ? (
            <motion.div 
              key="biometric"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={onUnlock}
                className="relative group mb-8"
              >
                <div className="absolute inset-0 bg-[#14ffd1]/20 rounded-full blur-2xl group-hover:bg-[#14ffd1]/40 transition-colors"></div>
                <div className="relative w-32 h-32 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-[#14ffd1]/50"
                  ></motion.div>
                  <Fingerprint className="w-16 h-16 text-[#14ffd1]" strokeWidth={1.5} />
                </div>
              </motion.button>
              <p className="text-white text-lg font-semibold mb-6">Toca el sensor para desbloquear</p>
              <button 
                onClick={() => setUsePin(true)}
                className="text-white/70 text-sm font-medium hover:text-white transition-colors underline underline-offset-4"
              >
                Usar PIN
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="pin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center w-full"
            >
              <Lock className="w-8 h-8 text-white/80 mb-6" />
              <div className="flex gap-4 mb-10">
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      i < pin.length ? 'bg-white border-white scale-110' : 'border-white/30 bg-transparent'
                    }`}
                  ></div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePinInput(num.toString())}
                    className="h-16 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl font-medium transition-colors active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setUsePin(false)}
                  className="h-16 rounded-full text-white/70 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handlePinInput('0')}
                  className="h-16 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl font-medium transition-colors active:scale-95"
                >
                  0
                </button>
                <button
                  onClick={() => setPin(pin.slice(0, -1))}
                  className="h-16 rounded-full text-white/70 hover:text-white text-sm font-medium transition-colors"
                >
                  Borrar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="relative z-10 w-full flex flex-col items-center gap-8">
        <div className="flex items-center gap-2 opacity-40">
          <span className="text-[10px] font-medium tracking-widest uppercase text-white">Encriptación de Grado Clínico</span>
        </div>
      </footer>
    </div>
  );
};

