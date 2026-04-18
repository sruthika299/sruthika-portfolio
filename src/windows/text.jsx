import '@fontsource-variable/bricolage-grotesque'
import React, { useState } from 'react';

import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import { FileText, Share, Type, Copy, Check, X } from 'lucide-react';
import { SearchIcon } from '@/components/ui/search';
import { motion, AnimatePresence } from 'framer-motion';

const TextFile = () => {
    const { closeWindow, windows } = useWindowStore();
    const data = windows.txtfile.data;
    
    const [copied, setCopied] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLargeText, setIsLargeText] = useState(false);

    if (!data) return null;

    const handleCopy = () => {
        const textToCopy = Array.isArray(data.description) ? data.description.join('\n\n') : data.description;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setShowShare(true);
        setTimeout(() => setShowShare(false), 2000);
    };

    const highlightText = (text, highlight) => {
        if (!highlight.trim() || typeof text !== 'string') {
            return text;
        }
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);
        return (
            <span>
                {parts.map((part, i) => 
                    regex.test(part) ? <mark key={i} className="bg-blue-500/20 text-blue-800 px-0.5 rounded-sm">{part}</mark> : <span key={i}>{part}</span>
                )}
            </span>
        );
    };

    return (
        <div className="bg-[#ffffff]/95 backdrop-blur-xl h-full flex flex-col font-inter overflow-hidden rounded-xl shadow-2xl border border-white/20">
            {/* macOS Preview Toolbar equivalent for TextEdit */}
            <div id="window-header" className="window-header h-[52px] border-b border-gray-200/60 flex items-center justify-between px-4 shrink-0 bg-[#f6f6f6]/95 backdrop-blur-md relative z-20 select-none cursor-grab active:cursor-grabbing">
                {/* Traffic Lights */}
                <div id="window-controls" className="flex gap-2 min-w-[70px]">
                    <button className="close" onClick={() => closeWindow("txtfile")}></button>
                    <button className="minimize"></button>
                    <button className="maximize"></button>
                </div>

                {/* File Title */}
                <div className="flex-1 flex justify-center items-center gap-2 h-full pointer-events-none absolute left-1/2 -translate-x-1/2">
                    <FileText size={15} className="text-gray-400" />
                    <span className="text-[13px] font-bold text-gray-700 tracking-tight truncate max-w-[250px]">
                        {data.name || 'Text Document'}
                    </span>
                </div>
                
                {/* Mac toolbar Actions */}
                <div className="flex items-center gap-1.5 text-gray-500 min-w-[70px] justify-end relative">
                    <button 
                        onClick={() => setIsLargeText(!isLargeText)}
                        className={`p-1.5 rounded-md transition-colors ${isLargeText ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}
                    >
                        <Type size={15} strokeWidth={2} />
                    </button>
                    <button onClick={handleCopy} className="p-1.5 hover:bg-gray-200 rounded-md transition-colors relative">
                        {copied ? <Check size={14} strokeWidth={2} className="text-green-500" /> : <Copy size={14} strokeWidth={2} />}
                    </button>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                    <button onClick={handleShare} className="p-1.5 hover:bg-gray-200 rounded-md transition-colors">
                        <Share size={15} strokeWidth={2} />
                    </button>
                    <button 
                        onClick={() => { setShowSearch(!showSearch); if(showSearch) setSearchQuery(''); }}
                        className={`p-1.5 rounded-md transition-colors ${showSearch ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}
                    >
                        <SearchIcon size={15} strokeWidth={2} />
                    </button>

                    <AnimatePresence>
                        {showShare && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="absolute top-10 right-4 bg-white shadow-xl border border-gray-200 rounded-lg p-2 text-xs text-black whitespace-nowrap z-50 pointer-events-none"
                            >
                                Link copied to clipboard
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Search Bar Sub-toolbar */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#f6f6f6] border-b border-gray-200/60 overflow-hidden relative z-10"
                    >
                        <div className="flex items-center justify-end px-4 py-2">
                            <div className="flex items-center w-full max-w-[240px] bg-white border border-gray-300/80 rounded-md px-2.5 py-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400/50 transition-all">
                                <SearchIcon size={13} className="text-gray-400 mr-2 shrink-0" />
                                <input 
                                    type="text"
                                    placeholder="Find in document"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full text-[12px] outline-none bg-transparent placeholder:text-gray-400"
                                    autoFocus
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="p-0.5 ml-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 shrink-0">
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden w-full custom-scrollbar bg-white relative z-0">
                <div className="max-w-3xl mx-auto p-8 md:p-12 flex flex-col gap-6">
                    {data.image && (
                        <div className="w-full max-w-sm mx-auto shrink-0 mb-4 rounded-xl overflow-hidden shadow-sm border border-gray-100 flex-center">
                            <img src={data.image} alt="document-visual" className="w-full h-auto object-cover" />
                        </div>
                    )}
                    
                    {data.name && (
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 border-b border-gray-100 pb-4">
                            {highlightText(data.name.replace('.txt', ''), searchQuery)}
                        </h1>
                    )}

                    {data.subtitle && (
                        <h3 className="text-xl font-medium text-gray-600 pt-2">
                            {highlightText(data.subtitle, searchQuery)}
                        </h3>
                    )}

                    <div className={`flex flex-col gap-4 ${isLargeText ? 'text-xl' : 'text-base'} text-gray-700 leading-relaxed pt-2 font-bricolage transition-all duration-300`}>
                        {data.description && Array.isArray(data.description) ? (
                            data.description.map((para, idx) => (
                                <p key={idx}>{highlightText(para, searchQuery)}</p>
                            ))
                        ) : (
                            <p>{highlightText(data.description, searchQuery)}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WindowWrapper(TextFile, 'txtfile');
