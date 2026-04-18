import React, { useState, useEffect, useRef } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import { locations } from '#constants';
import useWindowStore from '#store/window';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  Columns, 
  Square, 
  Share, 
  Tag, 
  MoreHorizontal,
  Folder,
  User,
  Trash2,
  Briefcase,
  FileText
} from 'lucide-react';
import { SearchIcon } from '@/components/ui/search';
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

const Finder = ({ item }) => {
    const closeWindow = useWindowStore((state) => state.closeWindow);
    const openWindow = useWindowStore((state) => state.openWindow);
    const [currentFolder, setCurrentFolder] = useState(item || locations.work);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMaximized, setIsMaximized] = useState(false);
    const [tagColor, setTagColor] = useState(null);
    const [tagIdx, setTagIdx] = useState(0);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
    const [toast, setToast] = useState(null);
    const contentRef = useRef(null);

    // Navigation history
    const [history, setHistory] = useState([locations.work]);
    const [historyIdx, setHistoryIdx] = useState(0);
    const canGoBack = historyIdx > 0;
    const canGoForward = historyIdx < history.length - 1;

    const navigateTo = (folder) => {
        const newHistory = history.slice(0, historyIdx + 1);
        newHistory.push(folder);
        setHistory(newHistory);
        setHistoryIdx(newHistory.length - 1);
        setCurrentFolder(folder);
        setSearchQuery('');
    };

    const goBack = () => {
        if (!canGoBack) return;
        const idx = historyIdx - 1;
        setHistoryIdx(idx);
        setCurrentFolder(history[idx]);
        setSearchQuery('');
    };

    const goForward = () => {
        if (!canGoForward) return;
        const idx = historyIdx + 1;
        setHistoryIdx(idx);
        setCurrentFolder(history[idx]);
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

    const favorites = [
      { id: 'about', label: 'About me', icon: User, folder: locations.about },
      { id: 'resume', label: 'Resume', icon: FileText, folder: locations.resume },
      { id: 'trash', label: 'Archive', icon: Trash2, folder: locations.trash },
    ];

    const workProjects = locations.work.children;

    const getFormattedDate = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `Today, ${hours}:${minutes}`;
    };

    const filteredChildren = currentFolder?.children?.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    useEffect(() => {
        if (item) {
            setCurrentFolder(item);
            setHistory([item]);
            setHistoryIdx(0);
        }
    }, [item]);

    useEffect(() => {
        if (contentRef.current) {
            const items = contentRef.current.querySelectorAll('.finder-item');
            gsap.fromTo(items, 
                { opacity: 0, y: 15, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
            );
        }
    }, [currentFolder, viewMode]);

    const handleItemClick = (item) => {
        if (item.kind === 'file') {
            if (item.fileType === 'pdf') openWindow('resume');
            else if (item.fileType === 'url') window.open(item.href, '_blank');
            else if (item.fileType === 'txt') openWindow('txtfile', item);
            else if (item.fileType === 'fig') window.open(item.href, '_blank');
            else if (item.fileType === 'img') openWindow('imgfile', item);
        } else if (item.kind === 'folder') {
            navigateTo(item);
        }
    };

    return (
        <div className={`bg-[#ffffff] flex flex-col font-inter select-none overflow-hidden rounded-xl shadow-2xl border border-white/20 transition-all duration-300 ${isMaximized ? 'fixed inset-0 z-[999] rounded-none' : 'h-full'}`}>
            {/* Toast */}
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

            {/* Finder Toolbar */}
            <div id="window-header" className="window-header h-[52px] bg-[#f6f6f6] border-b border-gray-200/60 flex items-center px-4 gap-4 shrink-0 transition-colors duration-300">
                {/* Traffic Lights */}
                <div id="window-controls" className="flex gap-2 min-w-[70px]">
                    <button className="close" onClick={() => closeWindow("finder")} aria-label="Close Finder" title="Close" />
                    <button className="minimize" onClick={() => closeWindow("finder")} aria-label="Minimize Finder" title="Minimize" />
                    <button className="maximize" onClick={() => setIsMaximized(v => !v)} aria-label={isMaximized ? 'Restore' : 'Maximize'} title={isMaximized ? 'Restore' : 'Maximize'} />
                </div>

                {/* Navigation & View Group */}
                <div className="flex items-center gap-6">
                    {/* Back/Forward */}
                    <div className="flex items-center gap-4 text-gray-400">
                        <ChevronLeft
                            size={18} strokeWidth={2.5}
                            className={`transition-colors ${canGoBack ? 'cursor-pointer hover:text-gray-600' : 'opacity-25 cursor-default'}`}
                            onClick={goBack}
                        />
                        <ChevronRight
                            size={18} strokeWidth={2.5}
                            className={`transition-colors ${canGoForward ? 'cursor-pointer hover:text-gray-600' : 'opacity-25 cursor-default'}`}
                            onClick={goForward}
                            aria-label="Go Forward"
                        />
                    </div>

                    {/* View Switcher */}
                    <div className="flex bg-gray-200/50 p-0.5 rounded-md border border-gray-300/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                        <button className={`p-1 px-1.5 rounded-[4px] transition-all transform duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm ring-1 ring-black/5 text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`} onClick={() => setViewMode('grid')} aria-label="Grid View"><LayoutGrid size={13} strokeWidth={2.5} /></button>
                        <button className={`p-1 px-1.5 rounded-[4px] transition-all transform duration-200 ${viewMode === 'list' ? 'bg-white shadow-sm ring-1 ring-black/5 text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`} onClick={() => setViewMode('list')} aria-label="List View"><List size={13} strokeWidth={2.5} /></button>
                        <button className={`p-1 px-1.5 rounded-[4px] transition-all transform duration-200 hidden sm:block ${viewMode === 'columns' ? 'bg-white shadow-sm ring-1 ring-black/5 text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`} onClick={() => setViewMode('columns')} aria-label="Column View"><Columns size={13} strokeWidth={2.5} /></button>
                        <button className={`p-1 px-1.5 rounded-[4px] transition-all transform duration-200 hidden sm:block ${viewMode === 'gallery' ? 'bg-white shadow-sm ring-1 ring-black/5 text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`} onClick={() => setViewMode('gallery')} aria-label="Gallery View"><Square size={13} strokeWidth={2.5} /></button>
                    </div>
                </div>

                {/* Path/Directory Name */}
                <div className="flex-1 flex justify-center overflow-hidden text-center mx-2 pointer-events-none">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentFolder?.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="text-[13px] font-bold text-gray-700 tracking-tight truncate flex items-center gap-1.5"
                        >
                            {tagColor && <span className="w-2.5 h-2.5 rounded-full shrink-0 inline-block" style={{ background: tagColor }} />}
                            {currentFolder?.name || 'Portfolio'}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Actions Group */}
                <div className="hidden lg:flex items-center gap-1.5 text-gray-500 relative">
                    <button className="p-1.5 hover:bg-gray-200 rounded-md transition-colors" title="Share" onClick={handleShare} aria-label="Share">
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
                    <button className="p-1.5 hover:bg-gray-200 rounded-md transition-colors mr-2" title="More options" onClick={() => setShowMoreMenu(v => !v)} aria-label="More Options">
                        <MoreHorizontal size={15} strokeWidth={2} />
                    </button>
                    {/* More Menu Dropdown */}
                    <AnimatePresence>
                        {showMoreMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                transition={{ duration: 0.12 }}
                                className="absolute top-9 right-2 w-[190px] bg-white rounded-xl shadow-xl border border-gray-200/80 z-50 py-1.5 px-1.5 text-[13px] text-gray-700 origin-top-right"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {[
                                    { label: 'Sort by Name', action: () => showToast('Sorted by name') },
                                    { label: 'Sort by Date', action: () => showToast('Sorted by date') },
                                    { label: 'New Folder', action: () => showToast('📁 New folder created') },
                                    { label: 'Get Info', action: () => showToast(`ℹ️ ${currentFolder?.name || 'Folder'} — ${filteredChildren.length} items`) },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="relative px-1"
                                        onMouseEnter={() => setHoveredMenuItem(item.label)}
                                        onMouseLeave={() => setHoveredMenuItem(null)}
                                    >
                                        {hoveredMenuItem === item.label && (
                                            <motion.div
                                                layoutId="more-menu-hover"
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
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                            <SearchIcon size={13} className={`${searchQuery ? 'text-blue-500' : 'text-gray-400'} transition-colors`} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-gray-300/60 rounded-[6px] py-1 pl-8 pr-3 text-[12px] w-32 focus:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all duration-300 placeholder:text-gray-400 shadow-sm"
                            placeholder="Search"
                        />
                    </div>
                </div>
            </div>

            {/* Finder UI Shell using shadcn sidebar */}
            <div className="flex-1 flex overflow-hidden">
                <SidebarProvider defaultOpen={true} className="min-h-0 h-full w-full flex-row">
                    <Sidebar collapsible="none" className="w-[180px] md:w-[200px] bg-[#f6f6f6]/80 border-r border-gray-200/60 h-full">
                        <SidebarContent className="custom-scrollbar">
                            <SidebarGroup>
                                <SidebarGroupLabel className="text-[11px] font-semibold text-gray-400/80 tracking-widest uppercase py-3 px-4 border-b-0">Favorites</SidebarGroupLabel>
                                <SidebarGroupContent className="px-2">
                                    <SidebarMenu className="gap-0.5">
                                        <SidebarMenuItem className="relative">
                                            <SidebarMenuButton 
                                                isActive={currentFolder.type === 'work'} 
                                                onClick={() => { setCurrentFolder(locations.work); setSearchQuery(''); }}
                                                className={`relative transition-colors duration-200 z-10 w-full rounded-md px-3 py-1.5 ${
                                                    currentFolder.type === 'work' 
                                                    ? 'text-[#007aff] font-semibold' 
                                                    : 'text-gray-600 font-medium hover:bg-gray-200/50'
                                                }`}
                                            >
                                                <Briefcase size={16} className={currentFolder.type === 'work' ? 'text-[#007aff]' : 'text-gray-400'} />
                                                <span className="tracking-tight text-[13px]">Work</span>
                                            </SidebarMenuButton>
                                            {currentFolder.type === 'work' && (
                                                <motion.div 
                                                    layoutId="sidebar-active"
                                                    className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-md z-0 shadow-sm"
                                                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                                />
                                            )}
                                        </SidebarMenuItem>
                                        {favorites.map((item) => (
                                            <SidebarMenuItem key={item.id} className="relative">
                                                <SidebarMenuButton 
                                                    isActive={currentFolder.id === item.folder.id && currentFolder.type === item.folder.type} 
                                                    onClick={() => { setCurrentFolder(item.folder); setSearchQuery(''); }}
                                                    className={`relative transition-colors duration-200 z-10 w-full rounded-md px-3 py-1.5 ${
                                                        currentFolder.id === item.folder.id && currentFolder.type === item.folder.type
                                                        ? 'text-[#007aff] font-semibold' 
                                                        : 'text-gray-600 font-medium hover:bg-gray-200/50'
                                                    }`}
                                                >
                                                    <item.icon size={16} className={currentFolder.id === item.folder.id && currentFolder.type === item.folder.type ? 'text-[#007aff]' : 'text-gray-400'} />
                                                    <span className="tracking-tight text-[13px]">
                                                        {item.label}
                                                    </span>
                                                </SidebarMenuButton>
                                                {currentFolder.id === item.folder.id && currentFolder.type === item.folder.type && (
                                                    <motion.div 
                                                        layoutId="sidebar-active"
                                                        className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-md z-0 shadow-sm"
                                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                                    />
                                                )}
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                            
                            <SidebarGroup className="mt-2">
                              <SidebarGroupLabel className="text-[11px] font-semibold text-gray-400/80 tracking-widest uppercase py-3 px-4">Works</SidebarGroupLabel>
                              <SidebarGroupContent className="px-2">
                                <SidebarMenu className="gap-0.5">
                                  {workProjects.map((project) => (
                                    <SidebarMenuItem key={project.id} className="relative">
                                      <SidebarMenuButton 
                                          isActive={currentFolder.id === project.id} 
                                          onClick={() => { setCurrentFolder(project); setSearchQuery(''); }}
                                          className={`relative transition-colors duration-200 z-10 w-full rounded-md px-3 py-1.5 group/item ${
                                              currentFolder.id === project.id 
                                              ? 'text-[#007aff] font-semibold' 
                                              : 'text-gray-600 font-medium hover:bg-gray-200/50'
                                          }`}
                                      >
                                        <div className="size-4 shrink-0 overflow-hidden">
                                            <img 
                                                src="/images/folder.png" 
                                                alt="" 
                                                className={`w-full h-full object-contain transition-all ${currentFolder.id === project.id ? 'brightness-110' : 'opacity-80 group-hover/item:opacity-100 grayscale-[0.3]'}`} 
                                            />
                                        </div>
                                        <span className="tracking-tight text-[13px] truncate">
                                            {project.name}
                                        </span>
                                      </SidebarMenuButton>
                                      {currentFolder.id === project.id && (
                                          <motion.div 
                                              layoutId="sidebar-active"
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
                    
                    <main className="flex-1 bg-white relative overflow-auto custom-scrollbar">
                        {filteredChildren.length > 0 ? (
                            viewMode === 'grid' ? (
                                <div 
                                    ref={contentRef}
                                    className="p-6 md:p-8 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 h-fit"
                                >
                                    {filteredChildren.map((item) => (
                                        <div 
                                            key={`${currentFolder.id}-${item.id}`} 
                                            className="finder-item flex flex-col items-center justify-start gap-1 group cursor-default p-2 pt-3 rounded-lg hover:bg-gray-100/80 active:bg-blue-100/50 transition-colors duration-150"
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <div className="w-16 h-16 flex items-center justify-center mb-1 bg-transparent">
                                                <img 
                                                    src={item.icon} 
                                                    alt={item.name} 
                                                    className="w-12 h-12 object-contain group-active:scale-95 transition-transform duration-200 pointer-events-none drop-shadow-sm" 
                                                />
                                            </div>
                                            <div className="w-full h-[32px] flex items-start justify-center overflow-hidden">
                                                <p className="text-[12px] font-medium text-gray-700 group-hover:text-black transition-colors duration-200 text-center leading-tight break-words px-0.5 w-[110px] line-clamp-2">
                                                    {item.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : viewMode === 'list' ? (
                                <div ref={contentRef} className="w-full flex flex-col">
                                    <div className="flex border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-2 sticky top-0 bg-white/95 backdrop-blur-sm z-20">
                                        <div className="w-[45%] pl-8">Name</div>
                                        <div className="w-[20%]">Date Modified</div>
                                        <div className="w-[15%]">Size</div>
                                        <div className="w-[20%]">Kind</div>
                                    </div>
                                    {filteredChildren.map((item) => (
                                        <div 
                                            key={`${currentFolder.id}-${item.id}`}
                                            className="finder-item flex items-center px-4 py-1.5 hover:bg-blue-50/50 group cursor-default border-b border-gray-50/50"
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <div className="w-[45%] flex items-center gap-3">
                                                <img src={item.icon} alt="" className="w-4 h-4 object-contain" />
                                                <span className="text-[12px] text-gray-700 truncate font-medium">{item.name}</span>
                                            </div>
                                            <div className="w-[20%] text-[11px] text-gray-400">{getFormattedDate()}</div>
                                            <div className="w-[15%] text-[11px] text-gray-400">{item.kind === 'folder' ? '--' : item.size || 'KB'}</div>
                                            <div className="w-[20%] text-[11px] text-gray-400">{item.fileType?.toUpperCase() || (item.kind === 'folder' ? 'Folder' : 'File')}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : viewMode === 'columns' ? (
                                <div ref={contentRef} className="flex h-full divide-x divide-gray-100 overflow-hidden">
                                    <div className="w-1/2 overflow-y-auto">
                                        {filteredChildren.map((item) => (
                                            <div 
                                                key={`${currentFolder.id}-${item.id}`}
                                                className="finder-item flex items-center px-4 py-2.5 hover:bg-gray-100 group cursor-default transition-colors border-b border-gray-50/30"
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <img src={item.icon} alt="" className="w-4 h-4 mr-3 object-contain" />
                                                <span className="text-[13px] text-gray-700 font-medium flex-1 truncate">{item.name}</span>
                                                <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-1/2 bg-gray-50/30 p-8 flex flex-col items-center justify-center text-center">
                                        <div className="w-32 h-32 bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6 flex-center">
                                            <img src={filteredChildren[0]?.icon} alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-800 mb-1">{filteredChildren[0]?.name || currentFolder.name} Info</h3>
                                        <p className="text-[11px] text-gray-400 mb-6">{filteredChildren.length} items</p>
                                        <div className="w-full space-y-3 px-4">
                                            <div className="flex justify-between text-[11px]">
                                                <span className="text-gray-400">Kind</span>
                                                <span className="text-gray-700 font-medium">{filteredChildren[0]?.fileType?.toUpperCase() || (filteredChildren[0]?.kind === 'folder' ? 'Folder' : 'File')}</span>
                                            </div>
                                            <div className="flex justify-between text-[11px]">
                                                <span className="text-gray-400">Size</span>
                                                <span className="text-gray-700 font-medium">{filteredChildren[0]?.size || '--'}</span>
                                            </div>
                                            <div className="flex justify-between text-[11px]">
                                                <span className="text-gray-400">Modified</span>
                                                <span className="text-gray-700 font-medium">{filteredChildren[0]?.created || getFormattedDate()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div ref={contentRef} className="h-full w-full bg-gray-900 overflow-hidden flex flex-col">
                                    <div className="flex-1 flex flex-col items-center justify-center p-12">
                                        <motion.div 
                                            key={currentFolder.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border border-white/5 relative"
                                        >
                                            <img src="/images/wallpaper.jpg" alt="" className="w-full h-full object-cover blur-md opacity-30 absolute inset-0" />
                                            <div className="absolute inset-0 flex-center flex-col p-8 bg-black/20">
                                                <img src={filteredChildren[0]?.icon} alt="" className="w-32 h-32 object-contain mb-8 drop-shadow-2xl" />
                                                <h2 className="text-2xl font-bold text-white mb-2">{currentFolder.name}</h2>
                                                <p className="text-white/60 text-sm max-w-md text-center">Open this project to explore case studies, prototypes, and design systems built in Figma and Webflow.</p>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <div className="h-40 bg-black/40 backdrop-blur-xl border-t border-white/5 flex-center gap-4 px-8 overflow-x-auto">
                                        {filteredChildren.map((item) => (
                                            <div 
                                                key={item.id} 
                                                className="shrink-0 w-20 h-24 flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <img src={item.icon} alt="" className="w-12 h-12 object-contain" />
                                                <span className="text-[10px] text-white/50 font-medium text-center line-clamp-1">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="flex-center flex-col h-full gap-4 text-gray-300">
                                <SearchIcon size={48} />
                                <p className="text-sm font-medium">No results found for "{searchQuery}"</p>
                            </div>
                        )}
                    </main>
                </SidebarProvider>
            </div>
        </div>
    );
};

export default WindowWrapper(Finder, "finder");