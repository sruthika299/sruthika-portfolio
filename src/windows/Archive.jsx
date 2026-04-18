import React from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import { Trash2 } from 'lucide-react';
import { locations } from '#constants';

const Archive = () => {
    const closeWindow = useWindowStore((state) => state.closeWindow);
    const openWindow = useWindowStore((state) => state.openWindow);
    const trashItems = locations.trash.children;

    return (
        <div className="bg-white/95 backdrop-blur-xl text-black h-full w-full flex flex-col font-inter select-none overflow-hidden rounded-xl border border-gray-200/50">
            {/* MacOS Window Header */}
            <div id="window-header" className="window-header bg-[#f6f6f6] border-b border-gray-200/60 px-4 h-11 flex items-center shrink-0 w-full">
                <div id="window-controls" className="flex items-center gap-2 mt-0.5">
                    <button className="close" onClick={() => closeWindow("trash")}></button>
                    <button className="minimize"></button>
                    <button className="maximize"></button>
                </div>
                
                <h2 className="flex flex-1 items-center justify-center gap-2 text-[13px] font-bold tracking-tight text-gray-700 pr-[60px] pointer-events-none">
                    <Trash2 size={14} className="text-gray-500" />
                    Archive
                </h2>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full overflow-y-auto p-6 flex flex-wrap gap-8 items-start content-start custom-scrollbar bg-[#fcfcfc]">
                {trashItems.map((item) => (
                    <div 
                        key={item.id} 
                        className="flex flex-col items-center gap-1 cursor-pointer group w-24"
                        onDoubleClick={() => openWindow("imgfile", window.structuredClone ? structuredClone(item) : JSON.parse(JSON.stringify(item)))}
                    >
                        <div className="size-[72px] flex items-center justify-center rounded-lg border border-transparent group-hover:bg-black/5 group-hover:border-gray-200/60 transition-all p-1.5 relative">
                            <img src={item.icon || "/images/image.png"} alt={item.name} className="max-h-full max-w-full object-contain filter drop-shadow hover:drop-shadow-md group-hover:scale-105 transition-transform duration-200" />
                        </div>
                        <span className="text-[12px] text-center px-1.5 py-0.5 rounded-sm truncate w-full mt-0.5 text-gray-700 font-medium tracking-tight group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>
            
            {/* Status Bar */}
            <div className="h-6 bg-[#f6f6f6] border-t border-gray-200/60 flex items-center px-4 shrink-0">
                <span className="text-[11px] text-gray-500 font-medium">
                    {trashItems.length} items
                </span>
            </div>
        </div>
    );
};

export default WindowWrapper(Archive, "trash");
