import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Folder, FileText, Globe, X, Clock, ArrowRight, ArrowUp, ArrowDown, CornerDownLeft, Command } from 'lucide-react';
import { SearchIcon } from '@/components/ui/search';
import useWindowStore from '#store/window';
import { projects, locations } from '#constants';
import { navLinks, dockApps } from '#constants';

// ─── Searchable Data ───────────────────────────────────────────────────────────
const SEARCH_DATA = [
  // Navigation Links
  { id: 'nav-projects',   type: 'nav',     title: 'Projects',    subtitle: 'Open Portfolio Window',  icon: Folder,   action: 'finder',   category: 'Navigation' },
  { id: 'nav-contact',    type: 'nav',     title: 'Contact',     subtitle: 'Get in Touch',            icon: Globe,    action: 'contact',  category: 'Navigation' },
  { id: 'nav-resume',     type: 'nav',     title: 'Resume',      subtitle: 'View Full Resume (PDF)',  icon: FileText, action: 'resume',   category: 'Navigation' },

  // Apps
  { id: 'app-finder',     type: 'app',     title: 'Portfolio',   subtitle: 'Browse Projects',         icon: Folder,   action: 'finder',   category: 'Applications', img: '/images/finder.png' },
  { id: 'app-safari',     type: 'app',     title: 'Articles',    subtitle: 'Read Blog Posts',         icon: Globe,    action: 'safari',   category: 'Applications', img: '/images/safari.png' },
  { id: 'app-terminal',   type: 'app',     title: 'Skills',      subtitle: 'Tech Skills & Tools',     icon: FileText, action: 'terminal', category: 'Applications', img: '/images/terminal.png' },
  { id: 'app-contact',    type: 'app',     title: 'Contact',     subtitle: 'Get in Touch',            icon: Globe,    action: 'contact',  category: 'Applications', img: '/images/contact.png' },
  { id: 'app-photos',     type: 'app',     title: 'Gallery',     subtitle: 'Design Gallery',          icon: Folder,   action: 'photos',   category: 'Applications', img: '/images/photos.png' },

  // Projects
  { id: 'proj-1', type: 'project', title: 'JBL Redesign',        subtitle: 'E-Commerce',    icon: Folder, action: 'finder',   category: 'Projects', img: '/images/project-1.png' },
  { id: 'proj-2', type: 'project', title: 'Vivid Lux',           subtitle: 'Retail',        icon: Folder, action: 'finder',   category: 'Projects', img: '/images/project-2.png' },
  { id: 'proj-3', type: 'project', title: 'Pattio - Burger App', subtitle: 'Food Tech',     icon: Folder, action: 'finder',   category: 'Projects', img: '/images/project-3.png' },

  // Skills
  { id: 'skill-figma',   type: 'skill', title: 'Figma',          subtitle: 'Design Software',  icon: FileText, action: 'terminal', category: 'Skills' },
  { id: 'skill-sk',      type: 'skill', title: 'Sketch',         subtitle: 'Design Software',  icon: FileText, action: 'terminal', category: 'Skills' },
  { id: 'skill-xd',      type: 'skill', title: 'Adobe XD',       subtitle: 'Design Software',  icon: FileText, action: 'terminal', category: 'Skills' },
  { id: 'skill-pp',      type: 'skill', title: 'Protopie',       subtitle: 'Prototyping',       icon: FileText, action: 'terminal', category: 'Skills' },
  { id: 'skill-framer',  type: 'skill', title: 'Framer',         subtitle: 'Prototyping',       icon: FileText, action: 'terminal', category: 'Skills' },
  { id: 'skill-miro',    type: 'skill', title: 'Miro',           subtitle: 'User Research',     icon: FileText, action: 'terminal', category: 'Skills' },
  { id: 'skill-wf',      type: 'skill', title: 'Webflow',        subtitle: 'Web Building',      icon: Globe,    action: 'terminal', category: 'Skills' },
];

// ─── Result Icon ───────────────────────────────────────────────────────────────
const ResultIcon = ({ item }) => {
  if (item.img) {
    return (
      <div className="spotlight-icon-wrap">
        <img src={item.img} alt={item.title} className="spotlight-icon-img" onError={(e) => { e.target.style.display = 'none'; }} />
      </div>
    );
  }
  const Icon = item.icon || SearchIcon;
  const colors = {
    nav:     'spotlight-icon-nav',
    app:     'spotlight-icon-app',
    project: 'spotlight-icon-proj',
    skill:   'spotlight-icon-skill',
  };
  return (
    <div className={`spotlight-icon-wrap ${colors[item.type] || 'spotlight-icon-nav'}`}>
      <SearchIcon size={15} />
    </div>
  );
};

// ─── Result Row ────────────────────────────────────────────────────────────────
const ResultRow = ({ item, isActive, onClick, refEl }) => {
  const rowRef = useRef(null);

  useEffect(() => {
    if (isActive && rowRef.current) {
      rowRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isActive]);

  const handleMouseEnter = () => {
    if (!isActive) {
      gsap.to(rowRef.current, { x: 2, duration: 0.15, ease: 'power2.out' });
    }
  };
  const handleMouseLeave = () => {
    if (!isActive) {
      gsap.to(rowRef.current, { x: 0, duration: 0.2, ease: 'power2.out' });
    }
  };

  return (
    <div
      ref={(el) => { rowRef.current = el; if (refEl) refEl.current = el; }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-row ${isActive ? 'spotlight-row-active' : ''}`}
      style={{ position: 'relative' }}
    >
      {/* Shared layout indicator — glides between active rows like Finder sidebar */}
      {isActive && (
        <motion.div
          layoutId="spotlight-active"
          className="spotlight-active-indicator"
          transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
        />
      )}
      <ResultIcon item={item} />
      <div className="spotlight-row-text" style={{ position: 'relative', zIndex: 1 }}>
        <span className="spotlight-row-title">{item.title}</span>
        <span className="spotlight-row-sub">{item.subtitle}</span>
      </div>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, x: 14, scale: 0.6 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 8, scale: 0.7 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22, mass: 0.6 }}
          className="spotlight-row-enter"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <ArrowRight size={12} />
        </motion.div>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const SpotlightSearch = ({ isOpen, onClose }) => {
  const [query, setQuery]           = useState('');
  const [results, setResults]       = useState([]);
  const [activeIdx, setActiveIdx]   = useState(0);
  const [categories, setCategories] = useState([]);
  const { openWindow }              = useWindowStore();

  const inputRef      = useRef(null);
  const containerRef  = useRef(null);
  const overlayRef    = useRef(null);
  const gsapCtxRef    = useRef(null);

  // ── Search Logic ─────────────────────────────────────────────────────────────
  const doSearch = useCallback((q) => {
    if (!q.trim()) {
      setResults([]);
      setCategories([]);
      setActiveIdx(0);
      return;
    }
    const lower = q.toLowerCase();
    const matched = SEARCH_DATA.filter(
      (d) =>
        d.title.toLowerCase().includes(lower) ||
        d.subtitle.toLowerCase().includes(lower) ||
        d.category.toLowerCase().includes(lower)
    );
    setResults(matched);
    const cats = [...new Set(matched.map((r) => r.category))];
    setCategories(cats);
    setActiveIdx(0);
  }, []);

  useEffect(() => { doSearch(query); }, [query, doSearch]);

  // ── Focus Input ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery('');
      setResults([]);
      setCategories([]);
      setActiveIdx(0);
    }
  }, [isOpen]);

  // ── Entrance / Exit Logic ───────────────────────────────────────────────────
  // We let Framer Motion handle the entrance/exit animations for reliability,
  // especially in production environments like Vercel.
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setCategories([]);
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // ── Keyboard Navigation ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') { onClose(); return; }
      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleAction(results[activeIdx]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, results, activeIdx]);

  // ── Action Handler ────────────────────────────────────────────────────────────
  const handleAction = useCallback((item) => {
    if (!item) return;

    // macOS Spotlight selection exit:
    // Phase 1 — micro confirm flash (scale up slightly)
    // Phase 2 — decisive snap-dismiss (scale down + fade)
    const tl = gsap.timeline();

    tl.to(containerRef.current, {
      scale: 1.03,
      duration: 0.07,
      ease: 'power1.out',
    }).to(containerRef.current, {
      scale: 0.88,
      opacity: 0,
      duration: 0.14,
      ease: 'expo.in',
      onComplete: () => {
        openWindow(item.action);
        onClose();
      },
    });

    // Fade overlay in parallel
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.18,
        ease: 'power2.in',
      });
    }
  }, [openWindow, onClose]);

  // ── Preview Panel (rightside detail) ──────────────────────────────────────────
  const activeItem = results[activeIdx];

  // ── Category-grouped results ───────────────────────────────────────────────────
  const grouped = categories.map((cat) => ({
    cat,
    items: results.filter((r) => r.category === cat),
  }));

  // Global result index → group item index for keyboard nav
  let globalIdx = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            key="spotlight-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeIn' }}
            className="spotlight-overlay"
            onClick={onClose}
          />

          {/* Main Panel */}
          <motion.div
            key="spotlight-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
            className={`spotlight-panel ${results.length > 0 ? 'spotlight-panel-expanded' : ''}`}
            ref={containerRef}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Bar */}
            <div className="spotlight-bar">
              <SearchIcon size={22} className="spotlight-search-icon" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Spotlight Search"
                className="spotlight-input"
                autoComplete="off"
                spellCheck="false"
              />
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="spotlight-clear"
                  onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                >
                  <X size={14} strokeWidth={2.5} />
                </motion.button>
              )}
            </div>

            {/* Results Area */}
            <AnimatePresence mode="wait">
              {results.length > 0 ? (
                <motion.div
                  key="with-results"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="spotlight-body"
                >
                  {/* Left: Results */}
                  <div className="spotlight-list">
                    {grouped.map(({ cat, items }) => (
                      <div key={cat} className="spotlight-group">
                        <div className="spotlight-cat">{cat}</div>
                        {items.map((item) => {
                          const myIdx = globalIdx++;
                          return (
                            <ResultRow
                              key={item.id}
                              item={item}
                              isActive={activeIdx === myIdx}
                              onClick={() => handleAction(item)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Right: Preview */}
                  <AnimatePresence mode="wait">
                    {activeItem && (
                      <motion.div
                        key={activeItem.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="spotlight-preview"
                      >
                        {/* Preview image if present */}
                        {activeItem.img ? (
                          <div className="spotlight-prev-img-wrap">
                            <img
                              src={activeItem.img}
                              alt={activeItem.title}
                              className="spotlight-prev-img"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        ) : (
                          <div className="spotlight-prev-icon-wrap">
                            <SearchIcon size={40} className='spotlight-prev-icon' />
                          </div>
                        )}

                        <p className="spotlight-prev-title">{activeItem.title}</p>
                        <p className="spotlight-prev-sub">{activeItem.subtitle}</p>
                        <p className="spotlight-prev-cat">{activeItem.category}</p>

                        <button
                          className="spotlight-prev-btn"
                          onClick={() => handleAction(activeItem)}
                        >
                          Open <ArrowRight size={13} strokeWidth={2.5} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : query.length > 0 ? (
                /* No results */
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="spotlight-empty"
                >
                  <SearchIcon size={28} className="opacity-20" />
                  <p className="spotlight-empty-text">No results for "{query}"</p>
                  <p className="spotlight-empty-sub">Try searching for projects, skills, or apps</p>
                </motion.div>
              ) : (
                /* Default idle hint */
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="spotlight-idle"
                >
                  <SearchIcon size={32} className="spotlight-idle-icon" />
                  <p className="spotlight-idle-text">Search Sruthika's Portfolio</p>
                  <div className="spotlight-hints">
                    <span className="spotlight-hint"><Command size={11} /> Space</span>
                    <span className="spotlight-hint-sep">to toggle</span>
                    <span className="spotlight-hint"><ArrowUp size={12} strokeWidth={2.5} /><ArrowDown size={12} strokeWidth={2.5} /></span>
                    <span className="spotlight-hint-sep">to navigate</span>
                    <span className="spotlight-hint"><CornerDownLeft size={12} strokeWidth={2.5} /></span>
                    <span className="spotlight-hint-sep">to open</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SpotlightSearch;
