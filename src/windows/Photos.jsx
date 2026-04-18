import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import { photosLinks, gallery, projects } from '#constants';
import useWindowStore from '#store/window';
import { motion, AnimatePresence } from 'framer-motion';
// import gsap from 'gsap'; 
import { 
  Mail,
  ChevronLeft,
  ChevronRight,
  Share,
  Plus,
  LayoutGrid,
  List,
  MoreHorizontal,
  Tag
} from 'lucide-react';
import { SearchIcon } from '@/components/ui/search';
import { HeartIcon as Heart } from '../components/ui/heart';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

const TAG_COLORS = [null, '#ff6b6b', '#ffb347', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff'];

const ImageWithLoader = ({ src, className, alt, showText = false, spinnerSize = "h-6 w-6" }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-50/30">
            {!loaded && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] z-10 transition-all duration-300">
                    <div className={`animate-spin rounded-full ${spinnerSize} border-b-2 border-gray-400/80 shadow-sm`}></div>
                    {showText && <p className="mt-3 text-[11px] font-medium text-gray-400/80 animate-pulse tracking-tight">Opening image...</p>}
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 z-10">
                    <span className="text-[10px] text-gray-400 font-medium">Failed to load</span>
                </div>
            )}
            <img 
                src={src} 
                alt={alt || ""} 
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                className={`${className} transition-opacity duration-700 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`} 
            />
        </div>
    );
};

const Photos = () => {
    const { closeWindow, openWindow } = useWindowStore();
    const [activeTab, setActiveTab] = useState('Library');
    const [isMaximized, setIsMaximized] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [tagColor, setTagColor] = useState(null);
    const [tagIdx, setTagIdx] = useState(0);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
    const [hoveredListItem, setHoveredListItem] = useState(null);
    const [toast, setToast] = useState(null);
    const contentRef = useRef(null);

    // Navigation history
    const [history, setHistory] = useState(['Library']);
    const [historyIdx, setHistoryIdx] = useState(0);
    const canGoBack = historyIdx > 0;
    const canGoForward = historyIdx < history.length - 1;

    const navigateTo = (tab) => {
        if (tab === activeTab) return;
        const newHistory = history.slice(0, historyIdx + 1);
        newHistory.push(tab);
        setHistory(newHistory);
        setHistoryIdx(newHistory.length - 1);
        setActiveTab(tab);
        setSearchQuery('');
    };

    const goBack = () => {
        if (!canGoBack) return;
        const idx = historyIdx - 1;
        setHistoryIdx(idx);
        setActiveTab(history[idx]);
        setSearchQuery('');
    };

    const goForward = () => {
        if (!canGoForward) return;
        const idx = historyIdx + 1;
        setHistoryIdx(idx);
        setActiveTab(history[idx]);
        setSearchQuery('');
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2200);
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => showToast('🔗 Link copied to clipboard!'));
    };

    const handleTag = () => {
        const next = (tagIdx + 1) % TAG_COLORS.length;
        setTagIdx(next);
        setTagColor(TAG_COLORS[next]);
        showToast(TAG_COLORS[next] ? '🏷️ Tag applied' : '🏷️ Tag removed');
    };

    // Initial images data
    const INITIAL_IMAGES = [
        { id: 'g1', url: '/images/gal-1.jpeg', span: 'col-span-2 row-span-2', name: 'Childhood sruthika', categories: ['Library', 'Memories'], size: '26 KB', date: 'Oct 12, 2023 at 4:20 PM' },
        { id: 'g2', url: '/images/gal-2.jpeg', span: 'col-span-1 row-span-2', name: 'Childhood group pic', categories: ['Library', 'Closed ones'], size: '77 KB', date: 'Sep 28, 2023 at 11:15 AM' },
        { id: 'g4', url: '/images/gal-4.jpeg', span: 'col-span-2 row-span-2', name: 'Cadence Crew', categories: ['Library', 'People', 'Closed ones'], size: '963 KB', date: 'Dec 01, 2023 at 5:10 PM' },
        { id: 'g3', url: '/images/gal-3.jpeg', span: 'col-span-1 row-span-2', name: 'With Shivani', categories: ['Library', 'Memories', 'Closed ones'], size: '153 KB', date: 'Nov 05, 2023 at 8:45 PM' },
        { id: 'g5', url: '/images/gal-5.jpeg', span: 'col-span-2 row-span-2', name: 'CSBS Good Souls', categories: ['Library', 'Memories', 'Closed ones'], size: '900 KB', date: 'Feb 15, 2024 at 10:20 AM' },
        { id: 'g6', url: '/images/gal-6.jpeg', span: 'col-span-1 row-span-2', name: 'With Maddy', categories: ['Library', 'Memories'], size: '801 KB', date: 'Mar 10, 2024 at 12:30 PM' },
    ];

    // Category-mapped gallery images with persistence
    const [imagesData, setImagesData] = useState(() => {
        const savedFavorites = localStorage.getItem('gallery-favorites');
        if (!savedFavorites) return INITIAL_IMAGES;
        
        const favoriteIds = JSON.parse(savedFavorites);
        return INITIAL_IMAGES.map(img => ({
            ...img,
            categories: favoriteIds.includes(img.id) 
                ? Array.from(new Set([...img.categories, 'Favorites']))
                : img.categories.filter(c => c !== 'Favorites')
        }));
    });

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        const favoriteIds = imagesData
            .filter(img => img.categories.includes('Favorites'))
            .map(img => img.id);
        localStorage.setItem('gallery-favorites', JSON.stringify(favoriteIds));
    }, [imagesData]);

    const toggleFavorite = (e, id) => {
        e.stopPropagation();
        setImagesData(prev => prev.map(img => {
            if (img.id === id) {
                const isFav = img.categories.includes('Favorites');
                const newCats = isFav 
                    ? img.categories.filter(c => c !== 'Favorites')
                    : [...img.categories, 'Favorites'];
                
                showToast(isFav ? 'Removed from Favorites' : 'Added to Favorites');
                return { ...img, categories: newCats };
            }
            return img;
        }));
    };

    const filteredImages = imagesData.filter(img => 
        (activeTab === 'Library' || img.categories.includes(activeTab)) &&
        img.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.15,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 25, 
            scale: 0.94,
            filter: 'blur(8px)'
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            filter: 'blur(0px)',
            transition: { 
                type: 'spring', 
                stiffness: 120, 
                damping: 18,
                mass: 0.8
            } 
        }
    };

    // Scroll to top when tab changes
    useEffect(() => {
        if (contentRef.current) {
            const container = contentRef.current.parentElement;
            if (container) {
                container.scrollTop = 0;
            }
        }
    }, [activeTab]);

    const tabs = [
        { id: 'Library', icon: '/icons/gicon1.svg', label: 'Library' },
        { id: 'Memories', icon: '/icons/gicon2.svg', label: 'Memories' },
        { id: 'Closed ones', icon: '/icons/gicon5.svg', label: 'Closed ones' },
        { id: 'People', icon: '/icons/gicon4.svg', label: 'People' },
        { id: 'Favorites', icon: '/icons/gicon5.svg', label: 'Favorites' },
    ];

    const handleImageClick = (imgUrl) => {
        openWindow('imgfile', { imageUrl: imgUrl, name: imgUrl.split('/').pop() });
    };

    return (
        <div className={`flex flex-col h-full font-inter select-none overflow-hidden ${isMaximized ? 'fixed inset-0 z-[999] !rounded-none' : 'rounded-b-2xl'}`}>
            
            {/* Toast Notifications */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white text-[12px] font-medium px-4 py-2 rounded-full backdrop-blur-xl shadow-lg border border-white/10 whitespace-nowrap pointer-events-none"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div id="window-header" className="window-header h-[52px] bg-[#f6f6f6] border-b border-gray-200/60 flex items-center px-4 gap-4 shrink-0 transition-colors duration-300">
                
                {/* Traffic Lights */}
                <div id="window-controls" className="flex gap-2 min-w-[70px]">
                    <button className="close" onClick={() => closeWindow("photos")} aria-label="Close Photos" title="Close" />
                    <button className="minimize" onClick={() => closeWindow("photos")} aria-label="Minimize Photos" title="Minimize" />
                    <button className="maximize" onClick={() => setIsMaximized(v => !v)} aria-label={isMaximized ? 'Restore' : 'Maximize'} title={isMaximized ? 'Restore' : 'Maximize'} />
                </div>

                {/* Left Group */}
                <div className="flex items-center gap-6">
                    {/* Back/Forward */}
                    <div className="flex items-center gap-4 text-gray-400">
                        <ChevronLeft
                            size={18} strokeWidth={2.5}
                            className={`transition-colors ${canGoBack ? 'cursor-pointer hover:text-gray-600' : 'opacity-25 cursor-default'}`}
                            onClick={goBack}
                            aria-label="Go Back"
                        />
                        <ChevronRight
                            size={18} strokeWidth={2.5}
                            className={`transition-colors ${canGoForward ? 'cursor-pointer hover:text-gray-600' : 'opacity-25 cursor-default'}`}
                            onClick={goForward}
                            aria-label="Go Forward"
                        />
                    </div>

                    {/* View Switcher Controls (Matching Finder) */}
                    <div className="flex bg-gray-200/50 p-0.5 rounded-md border border-gray-300/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                        <button className={`p-1 px-1.5 rounded-[4px] transition-all transform duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm ring-1 ring-black/5 text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`} onClick={() => setViewMode('grid')} aria-label="Grid View"><LayoutGrid size={13} strokeWidth={2.5} /></button>
                        <button className={`p-1 px-1.5 rounded-[4px] transition-all transform duration-200 ${viewMode === 'list' ? 'bg-white shadow-sm ring-1 ring-black/5 text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`} onClick={() => setViewMode('list')} aria-label="List View"><List size={13} strokeWidth={2.5} /></button>
                    </div>
                </div>

                {/* Center Group (Title & Tags) */}
                <div className="flex-1 flex justify-center overflow-hidden text-center mx-2 pointer-events-none">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={activeTab}
                            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                            transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                            className="text-[13px] font-bold text-gray-700 tracking-tight truncate flex items-center gap-1.5"
                        >
                            {tagColor && <span className="w-2.5 h-2.5 rounded-full shrink-0 inline-block" style={{ background: tagColor }} />}
                            {activeTab}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Right Group (Actions & Search) */}
                <div className="hidden lg:flex items-center gap-1.5 text-gray-500 relative">
                    <button className="p-1.5 hover:bg-gray-200 rounded-md transition-colors" title="Share" onClick={handleShare} aria-label="Share Photos">
                        <Share size={15} strokeWidth={2} />
                    </button>
                    <button
                        className={`p-1.5 rounded-md transition-colors ${tagColor ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                        title="Tag"
                        onClick={handleTag}
                        aria-label="Toggle Tag"
                    >
                        <Tag size={15} strokeWidth={2} style={tagColor ? { color: tagColor } : {}} />
                    </button>
                    <button className="p-1.5 hover:bg-gray-200 rounded-md transition-colors mr-2 text-gray-500" title="More options" onClick={() => setShowMoreMenu(v => !v)} aria-label="More Options">
                        <MoreHorizontal size={16} strokeWidth={2} />
                    </button>
                    
                    {/* More Menu Dropdown (Matching Finder) */}
                    <AnimatePresence>
                        {showMoreMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                transition={{ duration: 0.12 }}
                                className="absolute top-9 right-[150px] w-[190px] bg-white rounded-xl shadow-xl border border-gray-200/80 z-50 py-1.5 px-1.5 text-[13px] text-gray-700 origin-top-right"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {[
                                    { label: 'Import Photos', action: () => showToast('📷 Import initiated') },
                                    { label: 'Clean Duplicates', action: () => showToast('🧹 Scanning for duplicates') },
                                    { label: 'New Album', action: () => showToast('📁 Album created') },
                                    { label: 'View Info', action: () => showToast(`ℹ️ ${filteredImages.length} items visible`) },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="relative px-1"
                                        onMouseEnter={() => setHoveredMenuItem(item.label)}
                                        onMouseLeave={() => setHoveredMenuItem(null)}
                                    >
                                        {hoveredMenuItem === item.label && (
                                            <motion.div
                                                layoutId="more-menu-hover-photos"
                                                className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-lg z-0"
                                                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                                            />
                                        )}
                                        <button
                                            className="relative z-10 w-full text-left px-2 py-1.5 text-[13px] text-gray-700 font-medium rounded-lg"
                                            onClick={() => { item.action(); setShowMoreMenu(false); }}
                                        >
                                            {item.label}
                                        </button>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Search Bar */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                            <SearchIcon size={13} className={`${searchQuery ? 'text-blue-500' : 'text-gray-400'} transition-colors`} />
                        </div>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search" 
                            className="bg-white border border-gray-300/60 rounded-[6px] py-1 pl-8 pr-3 text-[12px] w-32 focus:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all duration-300 placeholder:text-gray-400 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <SidebarProvider defaultOpen={true} className="min-h-0 h-full w-full flex-row">
                    <Sidebar collapsible="none" className="w-[180px] md:w-[200px] bg-[#f6f6f6]/80 border-r border-gray-200/60 h-full">
                        <SidebarContent className="custom-scrollbar">
                            <SidebarGroup>
                                <SidebarGroupLabel className="text-[11px] font-semibold text-gray-400/80 tracking-widest uppercase py-3 px-4 border-b-0 mt-3">Photos</SidebarGroupLabel>
                                <SidebarGroupContent className="px-2">
                                    <SidebarMenu className="gap-0.5">
                                        {tabs.map((tab) => (
                                            <SidebarMenuItem key={tab.id} className="relative">
                                                <SidebarMenuButton 
                                                    isActive={activeTab === tab.id} 
                                                    onClick={() => navigateTo(tab.id)}
                                                    className={`relative transition-colors duration-200 z-10 w-full rounded-md px-3 py-1.5 ${
                                                        activeTab === tab.id 
                                                        ? 'text-[#007aff] font-semibold' 
                                                        : 'text-gray-600 font-medium hover:bg-gray-200/50'
                                                    }`}
                                                >
                                                    <div className="size-4 shrink-0 overflow-hidden flex items-center justify-center">
                                                        <img 
                                                            src={tab.icon} 
                                                            alt="" 
                                                            className={`w-full h-full object-contain transition-all ${activeTab === tab.id ? 'brightness-110' : 'opacity-80 grayscale-[0.3]'}`} 
                                                        />
                                                    </div>
                                                    <span className="tracking-tight text-[13px]">{tab.label}</span>
                                                </SidebarMenuButton>
                                                {activeTab === tab.id && (
                                                    <motion.div 
                                                        layoutId="photos-sidebar-active"
                                                        className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-md z-0 shadow-sm"
                                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                                    />
                                                )}
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>

                    <main className="flex-1 bg-white overflow-y-auto custom-scrollbar p-6 relative">
                        <AnimatePresence mode="wait">
                            {filteredImages.length === 0 ? (
                                <motion.div 
                                    key="no-results"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-3"
                                >
                                    {activeTab === 'Favorites' ? (
                                        <>
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-1 shadow-sm border border-gray-200/50">
                                                <Heart size={28} className="text-gray-300 fill-none" strokeWidth={1.5} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 tracking-tight">No Favorites</h3>
                                            <p className="text-[13px] text-gray-400 max-w-[240px] text-center leading-relaxed">
                                                To add a photo to your Favorites, click the <Heart size={12} className="inline-block mx-0.5 text-gray-400" /> icon on any photo.
                                            </p>
                                        </>
                                    ) : searchQuery ? (
                                        <>
                                            <SearchIcon size={48} className="text-gray-300" />
                                            <p className="text-[13px] font-medium">No results found for "{searchQuery}"</p>
                                        </>
                                    ) : (
                                        <>
                                            <LayoutGrid size={48} strokeWidth={1} className="text-gray-300" />
                                            <p className="text-[13px] font-medium text-gray-400">This collection is empty</p>
                                        </>
                                    )}
                                </motion.div>
                            ) : viewMode === 'grid' ? (
                                <motion.div 
                                    key="grid"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    ref={contentRef} 
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 h-fit pb-12 will-change-transform"
                                >
                                    {filteredImages.map((img) => (
                                        <motion.div
                                            key={img.id}
                                            variants={itemVariants}
                                            layout
                                            transition={{ layout: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }}
                                            className={`photo-item relative group cursor-pointer overflow-hidden rounded-2xl shadow-sm border border-gray-100 group/image ${img.span}`}
                                            onClick={() => handleImageClick(img.url)}
                                            whileHover={{ 
                                                y: -6, 
                                                scale: 1.02,
                                                boxShadow: '0 12px 24px -10px rgba(0,0,0,0.15)',
                                                transition: { duration: 0.3, ease: "easeOut" }
                                            }}
                                        >
                                            <ImageWithLoader 
                                                src={img.url} 
                                                alt={img.name}
                                                showText={img.span.includes('col-span-2')}
                                                spinnerSize={img.span.includes('row-span-2') ? "h-8 w-8" : "h-6 w-6"}
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                            
                                            {/* Favorite Button (Grid) */}
                                            <button 
                                                onClick={(e) => toggleFavorite(e, img.id)}
                                                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40 hover:scale-110 active:scale-95"
                                            >
                                                <Heart 
                                                    size={14} 
                                                    fill={img.categories.includes('Favorites') ? '#fb7185' : 'none'} 
                                                    className={img.categories.includes('Favorites') ? 'text-rose-400 transition-colors' : 'text-white/80 transition-colors'} 
                                                />
                                            </button>

                                            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="list"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex flex-col gap-1 pb-12 will-change-transform"
                                >
                                    <div className="flex border-b border-gray-100 text-[10px] font-semibold text-gray-400/80 uppercase tracking-widest px-4 py-2.5 bg-gray-50/30 rounded-t-lg">
                                        <div className="w-[8%] text-center">Fav</div>
                                        <div className="w-[37%]">Name</div>
                                        <div className="w-[15%]">Type</div>
                                        <div className="w-[15%]">Size</div>
                                        <div className="w-[25%]">Date Added</div>
                                    </div>
                                    {filteredImages.map((img) => (
                                        <div 
                                            key={img.id}
                                            className="relative px-2"
                                            onMouseEnter={() => setHoveredListItem(img.id)}
                                            onMouseLeave={() => setHoveredListItem(null)}
                                        >
                                            {hoveredListItem === img.id && (
                                                <motion.div
                                                    layoutId="list-hover-selection"
                                                    className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-lg z-0"
                                                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                                                />
                                            )}
                                            <motion.div 
                                                className="relative z-10 flex items-center text-[13px] text-gray-600 px-2 py-2 cursor-pointer rounded-md transition-colors border-b border-gray-50/80 group"
                                                onClick={() => handleImageClick(img.url)}
                                            >
                                                <div className="w-[8%] flex justify-center">
                                                    <button 
                                                        onClick={(e) => toggleFavorite(e, img.id)}
                                                        className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-300 hover:text-rose-400"
                                                    >
                                                        <Heart size={14} className={img.categories.includes('Favorites') ? 'fill-rose-400 text-rose-400' : ''} />
                                                    </button>
                                                </div>
                                                <div className="w-[37%] flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded shrink-0 overflow-hidden bg-gray-100 border border-gray-200">
                                                        <ImageWithLoader src={img.url} alt="" className="w-full h-full object-cover" spinnerSize="h-4 w-4" />
                                                    </div>
                                                    <span className="font-medium truncate group-hover:text-blue-600 transition-colors tracking-tight text-gray-700">{img.name}</span>
                                                </div>
                                                <div className="w-[15%] text-gray-400 font-normal">JPEG</div>
                                                <div className="w-[15%] text-gray-400 font-normal">{img.size}</div>
                                                <div className="w-[25%] text-gray-400 font-normal truncate">{img.date}</div>
                                            </motion.div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </SidebarProvider>
            </div>
        </div>
    );
};

export default WindowWrapper(Photos, "photos");
