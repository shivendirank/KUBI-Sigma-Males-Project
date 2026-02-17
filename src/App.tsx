import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza, ChevronDown } from 'lucide-react';
import { GLSLHills } from '@/components/ui/glsl-hills';

const TEAMS = [
  'My Pen Is Long',
  'Thousand Monkeys Thousand Typewriters',
  'Wrapsynth',
  'Bebop',
  'Golti Bros',
  'KUBI Sigma Males',
  'PizzaBlitz',
  'Sergei Chain.Love',
  'MarcoPolo',
  'moonmono',
  'Arrive',
  'Trust Me Bro',
  'Tharun Ekambaram',
  'CPL',
  'EthKiller',
  'Pizza Rush',
  'sexy',
  '$BLUFF',
  'BuzzBallz Enjoyers',
  'DVB HyperStream',
  'The Last Slice',
  'Solo',
  'Formula Zero',
  'upsilon',
  'Team Boston',
  'Friday',
  'Mace',
];

const PizzaSliceIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor"
  >
    <path d="M50 50 L50 10 A40 40 0 0 1 78.28 28.28 Z" fill="#FFA500" />
    <circle cx="60" cy="25" r="3" fill="#FF0000" />
    <circle cx="70" cy="35" r="3" fill="#FF0000" />
    <circle cx="58" cy="35" r="2.5" fill="#FFFF00" />
    <path d="M50 50 L50 10 A40 40 0 0 1 78.28 28.28 Z" fill="none" stroke="#D2691E" strokeWidth="2" />
  </svg>
);

const DynamicPizzaBackground = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeam) {
      console.log('Selected Team:', selectedTeam);
      // Proceed with selected team
    }
  };

  const handleSelectTeam = (team: string) => {
    setSelectedTeam(team);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden cursor-none bg-black">
      {/* GLSL Hills Background */}
      <div className="absolute inset-0">
        <GLSLHills speed={0.3} />
      </div>

      {/* Custom Pizza Cursor */}
      <motion.div
        className="fixed pointer-events-none z-50"
        animate={{
          x: cursorPosition.x - 20,
          y: cursorPosition.y - 20,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
          mass: 0.5,
        }}
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <PizzaSliceIcon className="w-10 h-10" />
        </motion.div>
      </motion.div>

      {/* Central Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-full max-w-3xl text-center"
        >
          {/* Pizza Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="mb-6 flex justify-center"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Pizza className="w-12 h-12 text-orange-500" strokeWidth={1} />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl md:text-7xl mb-4 text-white"
            style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, letterSpacing: '0.02em' }}
          >
            Confession Slice
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-sm md:text-base text-gray-500 mb-20 font-light tracking-wide uppercase"
            style={{ letterSpacing: '0.2em' }}
          >
            Let out your greatest secrets
          </motion.p>

          {/* Team selector dropdown */}
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="relative w-full max-w-xl mx-auto"
            >
              {/* Trigger button */}
              <motion.button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="w-full flex items-center justify-center gap-2 bg-transparent border-none outline-none text-2xl md:text-4xl text-center text-white pb-4 pt-2 relative z-10 cursor-pointer"
                style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, letterSpacing: '0.02em' }}
              >
                <span className={selectedTeam ? 'text-white' : 'text-gray-500'}>
                  {selectedTeam ?? 'Select your team'}
                </span>
                <motion.span
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-8 h-8 text-orange-500/80 shrink-0" />
                </motion.span>
              </motion.button>

              {/* Underline Effect */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                animate={{
                  scaleX: isDropdownOpen ? 1 : 0.3,
                  opacity: isDropdownOpen ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Glow when dropdown open */}
              <motion.div
                className="absolute -inset-x-20 -inset-y-4 bg-orange-500/20 blur-3xl rounded-full pointer-events-none"
                animate={{
                  opacity: isDropdownOpen ? 0.6 : 0,
                  scale: isDropdownOpen ? 1 : 0.8,
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Dropdown panel */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 max-h-[min(60vh,320px)] overflow-y-auto rounded-xl bg-black/90 backdrop-blur-md border border-white/10 py-2 z-50 shadow-xl"
                  >
                    {TEAMS.map((team) => (
                      <motion.button
                        key={team}
                        type="button"
                        onClick={() => handleSelectTeam(team)}
                        className="w-full px-4 py-3 text-left text-white/90 hover:bg-white/10 hover:text-white transition-colors text-sm md:text-base font-light"
                        style={{ fontFamily: 'Raleway, sans-serif', letterSpacing: '0.02em' }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {team}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Proceed button - only when a team is selected */}
            {selectedTeam && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                type="submit"
                className="mt-12 px-12 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300 text-sm font-light tracking-wider uppercase relative overflow-hidden group"
                style={{ letterSpacing: '0.15em' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
                <span className="relative z-10">Proceed</span>
              </motion.button>
            )}
          </form>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 text-xs text-gray-600 font-light tracking-wider uppercase"
            style={{ letterSpacing: '0.2em' }}
          >
            Select a team to continue
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default DynamicPizzaBackground;
