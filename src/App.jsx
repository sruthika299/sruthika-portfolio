import React, { Suspense, lazy } from 'react'
import gsap from 'gsap';
import { LockScreen, Welcome, Home } from '#components'
const Dock = lazy(() => import('#components/Dock'));
const Navbar = lazy(() => import('#components/Navbar'));

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import useWindowStore from '#store/window';

// Lazy-load heavy window applications to strictly reduce main thread blocking
const Terminal = lazy(() => import('#windows/Terminal'));
const Safari = lazy(() => import('#windows/Safari'));
const Resume = lazy(() => import('#windows/Resume'));
const Finder = lazy(() => import('#windows/Finder'));
const ImageViewer = lazy(() => import('#windows/ImageViewer'));
const TextFile = lazy(() => import('#windows/text'));
const Contact = lazy(() => import('#windows/Contact'));
const Photos = lazy(() => import('#windows/Photos'));
const Archive = lazy(() => import('#windows/Archive'));

const LazyWindow = ({ id, Component }) => {
  const isOpen = useWindowStore((state) => state.windows[id]?.isOpen);
  const hasMounted = React.useRef(false);

  if (isOpen) {
    hasMounted.current = true;
  }

  // Only start downloading the heavy JS chunks if the user actually clicks to open the app!
  if (!hasMounted.current) return null;
  
  return <Component />;
}

const App = () => {
  const isLocked = useWindowStore((state) => state.isLocked);

  React.useEffect(() => {
    const preboot = document.getElementById("preboot");
    if (preboot) {
      preboot.style.transition = "opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)";
      preboot.style.opacity = "0";
      setTimeout(() => preboot.remove(), 1200);
    }
  }, []);

  return (
    <main id="main-screen">
      <LockScreen />
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <motion.div
        className="size-full absolute inset-0"
        initial="initial"
        animate={isLocked ? "initial" : "animate"}
        variants={{
          initial: { opacity: 0, y: 40, filter: "blur(10px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" }
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Home />
        <Welcome />
      </motion.div>
      <Suspense fallback={null}>
        <Dock />
      </Suspense>

      <div className='hidden md:block'>
          <Suspense fallback={null}>
            <LazyWindow id="terminal" Component={Terminal} />
          </Suspense>
          <Suspense fallback={null}>
            <LazyWindow id="safari" Component={Safari} />
          </Suspense>
          <Suspense fallback={null}>
            <LazyWindow id="resume" Component={Resume} />
          </Suspense>
          <Suspense fallback={null}>
            <LazyWindow id="finder" Component={Finder} />
          </Suspense>
          <Suspense fallback={null}>
            <LazyWindow id="imgfile" Component={ImageViewer} />
          </Suspense>
          <Suspense fallback={null}>
            <LazyWindow id="txtfile" Component={TextFile} />
          </Suspense>
          <Suspense fallback={null}>
            <LazyWindow id="contact" Component={Contact} />
          </Suspense>
          <Suspense fallback={null}>
            <LazyWindow id="photos" Component={Photos} />
          </Suspense>
          <Suspense fallback={null}>
            <LazyWindow id="trash" Component={Archive} />
          </Suspense>
      </div>
    </main>
  )
}

export default App