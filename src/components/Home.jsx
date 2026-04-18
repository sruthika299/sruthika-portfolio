import React from 'react';
import { motion } from 'framer-motion';
import { locations } from '#constants';
import useWindowStore from '#store/window';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Home = () => {
  const { openWindow } = useWindowStore();
  
  // Get the 3 project folders from locations.work.children
  const projectFolders = React.useMemo(() => {
    // Generate positions that avoid the center (roughly 30-70% range in both axes)
    const areas = [
      { t: [15, 30], l: [10, 30] }, // Top Left
      { t: [15, 80], l: [80, 92] }, // Right Side (common for macOS icons)
      { t: [70, 85], l: [10, 40] }, // Bottom Left
    ];
    
    return locations.work.children.map((folder, i) => {
      // Find area: JBL is usually the first one but checking name just in case
      let areaIndex = i % areas.length;
      if (folder.name.includes('JBL')) {
        areaIndex = 0; // Top Left
      } else if (areaIndex === 0) {
        areaIndex = (i + 1) % areas.length; // Don't give other icons JBL's area if not needed
      }

      const area = areas[areaIndex];
      return {
        ...folder,
        initialPos: {
          top: `${Math.floor(Math.random() * (area.t[1] - area.t[0])) + area.t[0]}%`,
          left: `${Math.floor(Math.random() * (area.l[1] - area.l[0])) + area.l[0]}%`
        }
      };
    });
  }, []);

  const floatRefs = React.useRef([]);

  useGSAP(() => {
    if (floatRefs.current.length > 0) {
      floatRefs.current.forEach((el, i) => {
        if (!el) return;
        // Wait for intro to finish (delay + duration from Framer) then start float
        gsap.to(el, {
          y: -5,
          duration: 2.2 + i * 0.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2 + i * 0.2, // Ensures it starts after the 1s intro + 0.8s delay
          force3D: true
        });
      });
    }
  }, [projectFolders]);

  const handleOpen = (folder) => {
    openWindow('finder', folder);
  };

  return (
    <div id="home" className="absolute inset-0 z-0 pointer-events-none p-10 select-none overflow-hidden h-screen w-screen">
      {projectFolders.map((folder, i) => (
        <motion.div
          key={folder.id}
          drag
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.7, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          transition={{ 
            duration: 1, 
            delay: i * 0.15 + 0.8,
            ease: [0.23, 1, 0.32, 1] 
          }}
          whileHover={{ scale: 1.02 }}
          whileDrag={{ scale: 1.08, zIndex: 40 }}
          style={{ position: 'absolute', top: folder.initialPos.top, left: folder.initialPos.left }}
          className="pointer-events-auto flex flex-col items-center gap-0.5 group cursor-default w-24 h-24 relative z-0"
          onDoubleClick={() => handleOpen(folder)}
        >
            <div 
              ref={(el) => (floatRefs.current[i] = el)}
              className="w-16 h-16 relative flex items-center justify-center pointer-events-none drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300 will-change-transform"
            >
              <img 
                src="/images/folder.png" 
                alt={folder.name} 
                className="w-14 h-14 object-contain group-hover:brightness-110 transition-all duration-300"
              />
            </div>
            <div className="w-full h-6 px-1 flex-center">
              <span className="text-white text-[12px] font-semibold leading-tight text-center px-1.5 py-0.5 rounded-[4px] bg-transparent backdrop-blur-none border-2 border-transparent group-hover:bg-white/10 group-hover:backdrop-blur-3xl group-hover:border-white/25 group-hover:saturate-200 group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-400 shadow-none group-hover:shadow-md w-full truncate whitespace-nowrap overflow-hidden box-border inline-block">
                {folder.name}
              </span>
            </div>
          </motion.div>
      ))}
    </div>
  );
};

export default Home;
