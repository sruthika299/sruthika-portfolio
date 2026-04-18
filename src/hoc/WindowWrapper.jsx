import useWindowStore from '#store/window'
import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import gsap from 'gsap'; 
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(Draggable);

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { isOpen, data, zIndex } = useWindowStore((state) => state.windows[windowKey]);
        const focusWindow = useWindowStore((state) => state.focusWindow);
        const clickPosition = useWindowStore((state) => state.windows[windowKey].clickPosition);
        const dragRef = useRef(null);
        const contentRef = useRef(null);

        // Initial opening animation using GSAP
        useGSAP(() => {
            if (isOpen && dragRef.current) {
                // Initial set to prevent jump if we have a click position
                if (clickPosition) {
                    const rect = dragRef.current.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const startX = clickPosition.x - centerX;
                    const startY = clickPosition.y - centerY;
                    gsap.set(dragRef.current, { x: startX, y: startY });
                }

                // Scope handles to THIS specific window's elements to prevent multi-dragging bugs
                const headerHandle = dragRef.current.querySelector('.window-header');

                const [draggable] = Draggable.create(dragRef.current, {
                    type: "x,y",
                    edgeResistance: 0.65,
                    bounds: "#main-screen",
                    handle: headerHandle || ".window-header",
                    cancel: ".close, .minimize, .maximize, button, input, select, textarea", // Use classes instead of global IDs for cancel
                    onPress: () => focusWindow(windowKey),
                    onDragStart: () => focusWindow(windowKey),
                    force3D: true,
                    allowEventDefault: true
                });

                if (clickPosition) {
                    gsap.to(dragRef.current, 
                        { 
                            x: 0, 
                            y: 0, 
                            duration: 0.52, 
                            ease: "elastic.out(1, 0.75)",
                            overwrite: "auto",
                            onComplete: () => {
                                draggable.update();
                            }
                        }
                    );
                } else {
                    gsap.set(dragRef.current, { x: 0, y: 0 });
                    draggable.update();
                }

                return () => {
                    if (draggable) draggable.kill();
                };
            }
        }, [isOpen]);

        return (
            <AnimatePresence>
                {isOpen && (
                    <div 
                        ref={dragRef}
                        id={windowKey === 'imgfile' ? 'imgfile' : windowKey === 'txtfile' ? 'txtfile' : windowKey === 'trash' ? 'trash' : windowKey}
                        className="absolute"
                        style={{ zIndex }}
                        onMouseDown={() => focusWindow(windowKey)} // Ensure window focuses on any click
                    >
                        <motion.section
                            ref={contentRef}
                            className="size-full origin-center"
                            initial={{
                                opacity: 0,
                                scale: 0.2,
                                filter: 'blur(15px)'
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                filter: 'blur(0px)'
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.2,
                                filter: 'blur(15px)',
                                transition: { duration: 0.25, ease: "easeIn" }
                            }}
                        >
                            <Component {...props} item={data} />
                        </motion.section>
                    </div>
                )}
            </AnimatePresence>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`

    return Wrapped;
}

export default WindowWrapper