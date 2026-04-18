import { dockApps } from '#constants';
import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react'
import { Tooltip } from 'react-tooltip';
import gsap from 'gsap';
import useWindowStore from '../store/window';

const BASE_SIZE = 56;
const MAX_SIZE = 96;
const SPREAD = 60;
const CUTOFF = 130;

function gaussianScale(dist) {
    if (dist >= CUTOFF) return 1;
    const maxScale = MAX_SIZE / BASE_SIZE;
    const t = Math.exp(-(dist * dist) / (2 * SPREAD * SPREAD));
    return 1 + (maxScale - 1) * t;
}

const Dock = () => {
    const openWindow = useWindowStore((state) => state.openWindow);
    const closeWindow = useWindowStore((state) => state.closeWindow);
    const focusWindow = useWindowStore((state) => state.focusWindow);
    const windows = useWindowStore((state) => state.windows);
    const dockRef = useRef(null);

    const { contextSafe } = useGSAP({ scope: dockRef });

    const handleMouseMove = contextSafe((e) => {
        const icons = gsap.utils.toArray('.dock-icon');
        const mouseX = e.clientX;

        icons.forEach((icon) => {
            const rect = icon.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const dist = Math.abs(mouseX - center);

            const scale = gaussianScale(dist);
            const yShift = -(scale - 1) * BASE_SIZE * 0.55;

            gsap.to(icon, {
                scale,
                y: yShift,
                duration: 0.2,
                ease: 'power2.out',
                transformOrigin: 'bottom center',
                overwrite: 'auto',
            });
        });
    });

    const resetIcons = contextSafe(() => {
        const icons = gsap.utils.toArray('.dock-icon');

        icons.forEach((icon) => {
            gsap.to(icon, {
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1.2, 0.5)', // Snappier return with more distinct bounce
                transformOrigin: 'bottom center',
                overwrite: 'auto',
            });
        });
    });

    const toggleApp = contextSafe((id, canOpen, element) => {
        if (!canOpen) return;
        
        const windowState = windows[id];

        // Double jump bounce sequence
        const tl = gsap.timeline();
        tl.to(element, { y: -28, duration: 0.12, ease: "power2.out" })
          .to(element, { y: 0, duration: 0.12, ease: "power2.in" })
          .to(element, { y: -14, duration: 0.1, ease: "power2.out" })
          .to(element, { y: 0, duration: 0.1, ease: "power2.in" });

        const rect = element.getBoundingClientRect();
        const clickPosition = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

        if (!windowState?.isOpen) {
            openWindow(id, null, clickPosition);
        } else {
            // If already open, just focus it
            focusWindow(id);
        }
    });

    return (
        <div id="dock">
            <div ref={dockRef} className='dock-container' onMouseMove={handleMouseMove} onMouseLeave={resetIcons}>
                {dockApps.map(({ id, name, icon, canOpen }) => (
                    <div key={id} className='relative flex flex-col items-center group'>
                        <button 
                            type='button' 
                            className='dock-icon' 
                            aria-label={name} 
                            data-tooltip-id='dock-tooltip' 
                            data-tooltip-content={name} 
                            data-tooltip-delay-show={150} 
                            disabled={!canOpen} 
                            onClick={(e) => toggleApp(id, canOpen, e.currentTarget)}
                        >
                            <img 
                                src={`/images/${icon}`} 
                                alt={`${name} icon`} 
                                loading='lazy' 
                                className={canOpen ? '' : 'opacity-60'} 
                            />
                        </button>
                        
                        {/* MacOS Active Indicator Dot */}
                        {windows[id]?.isOpen && (
                            <div className="absolute -bottom-1.5 size-1 rounded-full bg-[#3c3c3c]/80 shadow-[0_0_2px_rgba(255,255,255,0.5)]" />
                        )}
                    </div>
                ))}

                <Tooltip id='dock-tooltip' place='top' className='font-inter font-medium tooltip text-xs' />
            </div>
        </div>
    )
}

export default Dock