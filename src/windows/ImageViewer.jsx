import React, { useRef, useState, useEffect } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
    ZoomIn, ZoomOut, RotateCw, Share, Info, Sidebar,
    Crop, Edit3, Check, X, RotateCcw, Lock, Unlock,
    Sun, Contrast, Droplets, Palette, Gauge, Highlighter, Moon, Thermometer, Paintbrush, History, Focus
} from 'lucide-react';
import useWindowStore from '#store/window';
import { formatBytes } from '#lib/utils';
import { ImageCrop, ImageCropContent, ImageCropApply, ImageCropReset } from '@/components/kibo-ui/image-crop';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/ui/check';



/* ─── Modal Overlay wrapper ─────────────────────────────────────────────── */
const ModalOverlay = ({ onClose, children, wide = false }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className={`bg-white rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden flex flex-col ${wide ? 'max-w-[96%] max-h-[92%] w-[780px]' : 'max-w-[90%] max-h-[88%] w-[480px]'}`}
            onClick={e => e.stopPropagation()}
        >
            {children}
        </motion.div>
    </motion.div>
);

const ModalHeader = ({ title, onClose }) => (
    <div className="h-11 bg-[#f6f6f6] border-b border-gray-200/70 flex items-center justify-between px-4 shrink-0">
        <span className="text-[13px] font-bold text-gray-700 tracking-tight">{title}</span>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-500">
            <X size={14} strokeWidth={2.5} />
        </button>
    </div>
);



/* ══════════════════════════════════════════════════════════════════════════
   ADJUST COLOR MODAL
══════════════════════════════════════════════════════════════════════════ */
const ADJUSTMENTS_DEFAULT = { 
    exposure: 100, contrast: 100, highlights: 100, shadows: 0, 
    saturation: 100, temperature: 0, tint: 0, sepia: 0, blur: 0 
};

// Per-channel macOS Preview themed config
const COLOR_CHANNELS = [
    {
        key: 'exposure', label: 'Exposure', min: 0, max: 200, unit: '%',
        Icon: Gauge,
        toProgress: (v) => (v / 200) * 100,
        indicatorClass: 'bg-amber-400',
        trackClass: 'bg-amber-50',
    },
    {
        key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%',
        Icon: Contrast,
        toProgress: (v) => (v / 200) * 100,
        indicatorClass: 'bg-gray-700',
        trackClass: 'bg-gray-100',
    },
    {
        key: 'highlights', label: 'Highlights', min: 0, max: 200, unit: '%',
        Icon: Sun,
        toProgress: (v) => (v / 200) * 100,
        indicatorClass: 'bg-yellow-300',
        trackClass: 'bg-yellow-50',
    },
    {
        key: 'shadows', label: 'Shadows', min: -100, max: 100, unit: '%',
        Icon: Moon,
        toProgress: (v) => ((v + 100) / 200) * 100,
        indicatorClass: 'bg-indigo-700',
        trackClass: 'bg-indigo-100',
    },
    {
        key: 'saturation', label: 'Saturation', min: 0, max: 200, unit: '%',
        Icon: Droplets,
        toProgress: (v) => (v / 200) * 100,
        indicatorClass: 'bg-pink-500',
        trackClass: 'bg-pink-100',
    },
    {
        key: 'temperature', label: 'Temperature', min: -50, max: 50, unit: '',
        Icon: Thermometer,
        toProgress: (v) => ((v + 50) / 100) * 100,
        indicatorClass: 'bg-gradient-to-r from-blue-400 to-orange-400',
        trackClass: 'bg-blue-50',
    },
    {
        key: 'tint', label: 'Tint', min: -50, max: 50, unit: '',
        Icon: Paintbrush,
        toProgress: (v) => ((v + 50) / 100) * 100,
        indicatorClass: 'bg-gradient-to-r from-green-400 to-purple-400',
        trackClass: 'bg-green-50',
    },
    {
        key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%',
        Icon: History,
        toProgress: (v) => v,
        indicatorClass: 'bg-orange-800',
        trackClass: 'bg-orange-100',
    },
    {
        key: 'blur', label: 'Sharpness', min: 0, max: 10, unit: 'px',
        Icon: Focus,
        toProgress: (v) => (v / 10) * 100,
        indicatorClass: 'bg-cyan-500',
        trackClass: 'bg-cyan-100',
    },
];

const AdjustColorModal = ({ imageUrl, onApply, onClose }) => {
    const [adj, setAdj] = useState(ADJUSTMENTS_DEFAULT);

    // Filter logic: combining many facets for macOS-like results
    const exposure = adj.exposure / 100;
    const highlights = adj.highlights / 100;
    const shadows = adj.shadows / 100;
    
    // We mix exposure and highlights into brightness
    const br = 100 * exposure * highlights;
    // Shadows approx with a small brightness/contrast shift
    const finalBr = br + (shadows * 10);
    const finalCt = adj.contrast + (shadows * 5);

    const filterString = `
        brightness(${finalBr}%) 
        contrast(${finalCt}%) 
        saturate(${adj.saturation}%) 
        sepia(${adj.sepia}%) 
        hue-rotate(${adj.temperature * 0.5 + adj.tint * 0.5}deg) 
        blur(${adj.blur}px)
    `.replace(/\s+/g, ' ');

    const set = (key, val, min, max) => {
        const clamped = Math.min(max, Math.max(min, val));
        setAdj(prev => ({ ...prev, [key]: clamped }));
    };

    const handleApply = () => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.filter = filterString;
            ctx.drawImage(img, 0, 0);
            onApply(canvas.toDataURL('image/png'));
        };
        img.src = imageUrl;
    };

    return (
        <ModalOverlay onClose={onClose} wide>
            <ModalHeader title="Adjust Color" onClose={onClose} />
            <div className="flex flex-1 overflow-hidden">
                {/* Preview */}
                <div className="flex-1 bg-[#efefef] flex items-center justify-center p-6 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt="preview"
                        className="max-w-full max-h-[62vh] rounded-xl shadow-2xl object-contain transition-all duration-150"
                        style={{ filter: filterString }}
                        crossOrigin="anonymous"
                    />
                </div>

                {/* Controls Panel */}
                <div className="w-[280px] shrink-0 bg-[#f6f6f6] border-l border-gray-200/60 flex flex-col overflow-y-auto shadow-inner">
                    <div className="p-4 border-b border-gray-200/60 flex items-center justify-between bg-white/40">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Adjust Color</span>
                        <button onClick={() => setAdj(ADJUSTMENTS_DEFAULT)} className="text-[10px] text-blue-500 font-semibold hover:underline">Reset</button>
                    </div>

                    {/* Channel rows */}
                    <div className="flex flex-col gap-0 divide-y divide-gray-200/40">
                        {COLOR_CHANNELS.map(({ key, label, min, max, unit, Icon, toProgress, indicatorClass, trackClass }) => {
                            const val = adj[key];
                            const pct = toProgress(val);
                            return (
                                <div key={key} className="px-5 py-3 flex flex-col gap-1.5 hover:bg-white/40 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon size={12} className="text-gray-400 group-hover:text-gray-600 transition-colors" strokeWidth={2.5} />
                                            <span className="text-[11px] font-medium text-gray-600 tracking-tight">{label}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 tabular-nums">
                                            {val}{unit}
                                        </span>
                                    </div>

                                    {/* macOS refined Slider track */}
                                    <div className="relative h-[12px] flex items-center px-0.5">
                                        <div className={`absolute inset-x-0 h-[2px] rounded-full ${trackClass} shadow-inner`}>
                                            <div
                                                className={`h-full rounded-full transition-all duration-150 ${indicatorClass} shadow-sm`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <Slider
                                            min={min} max={max} step={1}
                                            value={[val]}
                                            onValueChange={v => set(key, v[0], min, max)}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full z-10"
                                        />
                                        {/* Refined Thumb (White pill/dot) */}
                                        <div
                                            className="absolute w-[8px] h-[8px] bg-white rounded-full border border-gray-300 shadow-[0_1px_3px_rgba(0,0,0,0.2)] pointer-events-none transition-all duration-150 z-20"
                                            style={{ left: `calc(${pct}% - 4px)` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex-1 min-h-[40px]" />

                    <div className="p-4 flex flex-col gap-2 border-t border-gray-200/60 bg-white/20">
                        <Button
                            variant="macos"
                            onClick={handleApply}
                            className="w-full py-2.5 group"
                        >
                            <CheckIcon size={14} className="mr-2" /> Apply Changes
                        </Button>
                        <Button 
                            variant="macosOutline" 
                            onClick={onClose} 
                            className="w-full"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </ModalOverlay>
    );
};

/* ══════════════════════════════════════════════════════════════════════════
   ADJUST SIZE MODAL
══════════════════════════════════════════════════════════════════════════ */
const PRESETS = [
    { label: '1080p',  w: 1920,  h: 1080 },
    { label: '720p',   w: 1280,  h: 720  },
    { label: 'Square', w: 1080,  h: 1080 },
    { label: 'Story',  w: 1080,  h: 1920 },
    { label: '50%',    scale: 0.5 },
    { label: '25%',    scale: 0.25 },
];

const AdjustSizeModal = ({ imageUrl, naturalW, naturalH, onApply, onClose }) => {
    const [w, setW] = useState(naturalW || 800);
    const [h, setH] = useState(naturalH || 600);
    const [locked, setLocked] = useState(true);
    const ar = (naturalW && naturalH) ? naturalW / naturalH : 1;

    const changeW = (val) => {
        const n = parseInt(val) || 0;
        setW(n);
        if (locked) setH(Math.round(n / ar));
    };
    const changeH = (val) => {
        const n = parseInt(val) || 0;
        setH(n);
        if (locked) setW(Math.round(n * ar));
    };

    const applyPreset = (preset) => {
        if (preset.scale) {
            setW(Math.round(naturalW * preset.scale));
            setH(Math.round(naturalH * preset.scale));
        } else {
            setW(preset.w);
            setH(preset.h);
        }
    };

    const handleApply = () => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, w, h);
            onApply(canvas.toDataURL('image/png'));
        };
        img.src = imageUrl;
    };

    return (
        <ModalOverlay onClose={onClose}>
            <ModalHeader title="Adjust Size" onClose={onClose} />
            <div className="flex flex-col p-5 gap-5 overflow-y-auto">
                {/* Dimensions inputs */}
                <div className="flex flex-col gap-3">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Dimensions</p>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-[11px] text-gray-500 font-medium">Width (px)</label>
                            <input
                                type="number" min={1} value={w}
                                onChange={e => changeW(e.target.value)}
                                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setLocked(l => !l)}
                            className={`mt-5 p-2 rounded-lg border-2 transition-all ${locked ? 'bg-blue-50 border-blue-300 text-blue-600' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}
                            title={locked ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                        >
                            {locked ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-[11px] text-gray-500 font-medium">Height (px)</label>
                            <input
                                type="number" min={1} value={h}
                                onChange={e => changeH(e.target.value)}
                                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
                            />
                        </div>
                    </div>
                    {naturalW > 0 && (
                        <p className="text-[10px] text-gray-400">
                            Original: <span className="font-semibold">{naturalW} × {naturalH}</span>
                            {' '}·{' '}
                            Scale: <span className="font-semibold">{Math.round((w / naturalW) * 100)}%</span>
                        </p>
                    )}
                </div>

                {/* Presets */}
                <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Presets</p>
                    <div className="grid grid-cols-3 gap-2">
                        {PRESETS.map(preset => (
                            <button
                                key={preset.label}
                                onClick={() => applyPreset(preset)}
                                className="py-2 px-1 text-[11px] font-semibold text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-lg transition-all text-center"
                            >
                                {preset.label}
                                {!preset.scale && <span className="block text-[10px] font-normal text-gray-400">{preset.w}×{preset.h}</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Output info */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3 text-[11px] text-gray-500 flex justify-between">
                    <span>Output size</span>
                    <span className="font-semibold text-gray-700">{w} × {h} px</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button 
                        variant="macosOutline" 
                        onClick={onClose} 
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="macos"
                        onClick={handleApply}
                        className="flex-1 group"
                    >
                        <CheckIcon size={14} className="mr-2" /> Apply
                    </Button>
                </div>
            </div>
        </ModalOverlay>
    );
};

/* ══════════════════════════════════════════════════════════════════════════
   MAIN IMAGE VIEWER
══════════════════════════════════════════════════════════════════════════ */
const ImageViewer = ({ item }) => {
    const { closeWindow } = useWindowStore();
    const containerRef = useRef(null);
    const zoomLabelRef = useRef(null);
    const imgRef = useRef(null);

    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Active modal
    const [activeModal, setActiveModal] = useState(null); // 'crop' | 'markup' | 'color' | 'size'

    const [editedImage, setEditedImage] = useState(null); // stacks of edits
    const [cropSuccess, setCropSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const [imageDetails, setImageDetails] = useState({
        width: 0, height: 0,
        size: item?.size || '...',
        created: item?.created || 'Today',
    });

    const displayedImage = editedImage || item?.imageUrl;

    const handleImageLoad = (e) => {
        setIsImageLoaded(true);
        const { naturalWidth, naturalHeight } = e.target;
        setImageDetails(prev => ({ ...prev, width: naturalWidth, height: naturalHeight }));
        if (!item?.size) {
            fetch(item?.imageUrl, { method: 'HEAD' })
                .then(res => {
                    const size = res.headers.get('content-length');
                    if (size) setImageDetails(prev => ({ ...prev, size: formatBytes(size) }));
                })
                .catch(() => setImageDetails(prev => ({ ...prev, size: '2.4 MB' })));
        }
    };

    useEffect(() => {
        setIsImageLoaded(false);
        setImageError(false);
        setEditedImage(null);
        setActiveModal(null);
        if (imgRef.current?.complete) handleImageLoad({ target: imgRef.current });
    }, [item?.imageUrl]);

    const showZoomLabel = () => {
        if (!zoomLabelRef.current) return;
        gsap.killTweensOf(zoomLabelRef.current);
        gsap.fromTo(zoomLabelRef.current, { opacity: 0, y: 10, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(zoomLabelRef.current, { opacity: 0, y: -10, scale: 0.9, duration: 0.3, delay: 1.5, ease: 'power2.in' });
    };

    const handleZoomIn  = () => setZoom(p => { const n = Math.min(p + 0.25, 4); showZoomLabel(); return n; });
    const handleZoomOut = () => setZoom(p => { const n = Math.max(p - 0.25, 0.25); showZoomLabel(); return n; });
    const handleRotate  = () => setRotation(p => p + 90);
    const handleShare   = () => { setShowShare(true); setTimeout(() => setShowShare(false), 2000); };

    const applyEdit = (dataUrl, msg) => {
        setEditedImage(dataUrl);
        setActiveModal(null);
        setZoom(1);
        setRotation(0);
        setSuccessMsg(msg);
        setCropSuccess(true);
        setTimeout(() => setCropSuccess(false), 2500);
    };

    const handleRevert = () => { setEditedImage(null); };

    const handleDownload = () => {
        if (!editedImage) return;
        const a = document.createElement('a');
        a.href = editedImage;
        a.download = `edited-${item?.name || 'image'}.png`;
        a.click();
    };

    return (
        <div className="bg-[#ffffff]/95 backdrop-blur-xl h-full flex flex-col font-inter select-none overflow-hidden rounded-xl shadow-2xl border border-white/20">
            {/* ── Toolbar ── */}
            <div id="window-header" className="window-header h-[52px] border-b border-gray-200/60 flex items-center px-4 gap-4 shrink-0 bg-[#f6f6f6]/90">
                <div id="window-controls" className="flex gap-2 min-w-[70px]">
                    <button className="close" onClick={() => closeWindow('imgfile')} />
                    <button className="minimize" />
                    <button className="maximize" />
                </div>

                <div className="flex-1 flex justify-center text-center mx-2 h-full items-center pointer-events-none">
                    <div className="flex flex-col items-center leading-tight">
                        <span className="text-[13px] font-bold text-gray-700 tracking-tight truncate max-w-[200px]">
                            {editedImage ? `edited-${item?.name || 'image'}` : (item?.name || 'Preview')}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                            {item?.fileType?.toUpperCase() || 'IMAGE'} — {imageDetails.size} — {imageDetails.width > 0 ? `${imageDetails.width} × ${imageDetails.height}` : 'Calculating...'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-gray-500 relative">
                    <button onClick={() => setIsSidebarOpen(p => !p)} className={`p-1.5 rounded-md transition-colors ${isSidebarOpen ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}>
                        <Sidebar size={15} strokeWidth={2} />
                    </button>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                    <button onClick={handleZoomOut} className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"><ZoomOut size={16} strokeWidth={2} /></button>
                    <button onClick={handleZoomIn}  className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"><ZoomIn  size={16} strokeWidth={2} /></button>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                    <button onClick={handleRotate}  className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"><RotateCw size={15} strokeWidth={2} /></button>
                    <button onClick={() => setIsEditMode(p => !p)} className={`p-1.5 rounded-md transition-colors ${isEditMode ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}>
                        <Edit3 size={15} strokeWidth={2} />
                    </button>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                    <button onClick={handleShare}    className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"><Share size={15} strokeWidth={2} /></button>
                    <button onClick={() => setIsInfoOpen(p => !p)} className={`p-1.5 rounded-md transition-colors ${isInfoOpen ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}>
                        <Info size={15} strokeWidth={2} />
                    </button>
                    <AnimatePresence>
                        {showShare && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="absolute top-10 right-8 bg-white shadow-xl border border-gray-200 rounded-lg p-2 text-xs text-black whitespace-nowrap z-50 pointer-events-none">
                                Link copied to clipboard
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Edit Toolbar ── */}
            <AnimatePresence>
                {isEditMode && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 40, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="bg-[#f6f6f6] border-b border-gray-200/60 flex items-center justify-center gap-1 shrink-0 overflow-hidden px-4">
                        {[
                            { id: 'crop',  icon: Crop, label: 'Crop'         },
                            { id: 'color', icon: null, label: 'Adjust Color' },
                            { id: 'size',  icon: null, label: 'Adjust Size'  },
                        ].map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                onClick={() => setActiveModal(id)}
                                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all border ${activeModal === id ? 'bg-blue-500 text-white border-blue-500 shadow-sm' : 'text-gray-600 hover:text-black border-transparent hover:border-gray-200 hover:bg-gray-200/70'}`}
                            >
                                {Icon && <Icon size={13} />} {label}
                            </button>
                        ))}
                        {editedImage && (
                            <>
                                <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                                <button onClick={handleRevert} className="flex items-center gap-1.5 text-xs text-orange-500 font-medium px-2 py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
                                    <RotateCcw size={12} /> Revert
                                </button>
                                <button onClick={handleDownload} className="flex items-center gap-1.5 text-xs text-blue-600 font-medium px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                                    Download
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Main Content ── */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Thumbnail Sidebar */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 200, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                            className="bg-[#f0f0f0]/90 border-r border-gray-200/60 overflow-y-auto shrink-0 flex flex-col z-10 custom-scrollbar">
                            <div className="p-4 w-[200px]">
                                <h3 className="text-xs font-semibold text-gray-500 mb-3">Thumbnails</h3>
                                <div className="w-full aspect-square bg-white shadow-sm rounded-md border-2 border-blue-500 p-1 cursor-pointer">
                                    <img src={item?.imageUrl} alt="thumb" className="w-full h-full object-cover rounded-sm" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Image Canvas */}
                <div ref={containerRef} className="flex-1 bg-[#efefef] p-6 flex items-center justify-center relative overflow-hidden">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                        className="relative max-w-full max-h-full flex-center z-10" layout>
                        <AnimatePresence>
                            {!isImageLoaded && !imageError && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#efefef]/50 backdrop-blur-[2px]">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-400" />
                                    <p className="mt-4 text-[13px] font-medium text-gray-400 animate-pulse">Opening image...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.img
                            animate={{ scale: zoom, rotate: rotation, ...(zoom <= 1 ? { x: 0, y: 0 } : {}), opacity: isImageLoaded ? 1 : 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                            src={displayedImage}
                            alt={item?.name}
                            ref={imgRef}
                            onLoad={handleImageLoad}
                            onError={() => setImageError(true)}
                            style={{ transformOrigin: 'center center' }}
                            className="max-w-full max-h-[calc(100vh-250px)] rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white object-contain border border-white/40 pointer-events-none transition-opacity duration-300"
                        />
                        <div ref={zoomLabelRef} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white font-medium opacity-0 pointer-events-none">
                            {Math.round(zoom * 100)} %
                        </div>
                    </motion.div>

                    <div className="absolute inset-0 z-0 overflow-hidden opacity-10 blur-3xl pointer-events-none scale-125">
                        <img src={item?.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>

                    {/* Success Toast */}
                    <AnimatePresence>
                        {cropSuccess && (
                            <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow-xl z-50 pointer-events-none">
                                <Check size={13} className="text-green-400" />
                                {successMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Info Sidebar */}
                <AnimatePresence>
                    {isInfoOpen && (
                        <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 250, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                            className="bg-[#f6f6f6]/95 backdrop-blur-md border-l border-gray-200/60 overflow-y-auto shrink-0 z-10 custom-scrollbar">
                            <div className="p-4 w-[250px] flex flex-col gap-4 text-xs">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">General Information</h3>
                                    <div className="p-3 bg-white rounded-md border border-gray-200 shadow-sm flex flex-col gap-2">
                                        {[['Name', item?.name || 'Image'], ['Kind', `${item?.fileType?.toUpperCase() || 'JPEG'} Image`], ['Size', imageDetails.size], ['Created', imageDetails.created]].map(([k, v]) => (
                                            <div key={k} className="flex justify-between items-center">
                                                <span className="text-gray-500">{k}</span>
                                                <span className="font-medium truncate ml-2 text-right max-w-[120px]">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">More Info</h3>
                                    <div className="p-3 bg-white rounded-md border border-gray-200 shadow-sm flex flex-col gap-2">
                                        <div className="flex justify-between items-center"><span className="text-gray-500">Dimensions</span><span className="font-medium">{imageDetails.width} × {imageDetails.height}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-gray-500">Color Space</span><span className="font-medium">RGB</span></div>
                                        <div className="flex justify-between items-center"><span className="text-gray-500">Alpha Channel</span><span className="font-medium text-gray-400">{['png','webp'].includes(item?.fileType?.toLowerCase()) ? 'Yes' : 'No'}</span></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <div className="h-4 bg-[#f6f6f6] shrink-0 border-t border-gray-200/60 flex items-center justify-center">
                <div className="w-1/3 max-w-[100px] h-1 bg-gray-300 rounded-full" />
            </div>

            {/* ── Modals ── */}
            <AnimatePresence>
                {activeModal === 'crop' && (
                    <ModalOverlay onClose={() => setActiveModal(null)} wide>
                        <ImageCrop src={displayedImage} onCrop={url => applyEdit(url, 'Crop applied')}>
                            <div className="flex flex-col h-full">
                                <ModalHeader title="Crop Image" onClose={() => setActiveModal(null)} />
                                <div className="flex flex-1 overflow-hidden">
                                    <div className="flex-1 bg-[#efefef] p-5 flex items-center justify-center overflow-auto">
                                        <ImageCropContent className="max-h-[60vh] max-w-full rounded-md overflow-hidden shadow-md" />
                                    </div>
                                    <div className="w-[175px] shrink-0 bg-[#f9f9f9] border-l border-gray-200/60 flex flex-col justify-between p-4">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Crop Tool</p>
                                            <p className="text-[11px] text-gray-500 leading-relaxed">Drag handles to select the area you want to keep.</p>
                                            <div className="h-[1px] bg-gray-200 my-1" />
                                            <p className="text-[11px] text-gray-400">Output: <span className="font-semibold text-gray-600">PNG</span></p>
                                        </div>
                                        <div className="flex flex-col gap-2 mt-4">
                                            <ImageCropApply asChild>
                                                <Button variant="macos" className="w-full group">
                                                    <CheckIcon size={14} className="mr-2" /> Apply Crop
                                                </Button>
                                            </ImageCropApply>
                                            <ImageCropReset asChild>
                                                <Button variant="macosOutline" className="w-full">
                                                    <RotateCcw size={12} className="mr-2" /> Reset
                                                </Button>
                                            </ImageCropReset>
                                            <Button variant="macosOutline" onClick={() => setActiveModal(null)} className="w-full border-transparent hover:bg-gray-100">
                                                <X size={12} className="mr-2" /> Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ImageCrop>
                    </ModalOverlay>
                )}

                {activeModal === 'color' && (
                    <AdjustColorModal
                        imageUrl={displayedImage}
                        onApply={url => applyEdit(url, 'Colors adjusted')}
                        onClose={() => setActiveModal(null)}
                    />
                )}
                {activeModal === 'size' && (
                    <AdjustSizeModal
                        imageUrl={displayedImage}
                        naturalW={imageDetails.width}
                        naturalH={imageDetails.height}
                        onApply={url => applyEdit(url, 'Image resized')}
                        onClose={() => setActiveModal(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default WindowWrapper(ImageViewer, 'imgfile');
