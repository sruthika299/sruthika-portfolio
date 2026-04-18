import { navLinks, locations } from '#constants';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import useWindowStore from '#store/window';
import { Bluetooth, Lock, LogOut } from 'lucide-react';
import { WifiIcon } from '@/components/ui/wifi';
import { SettingsIcon } from '@/components/ui/settings';
import { SearchIcon } from '@/components/ui/search';
import { CheckIcon } from '@/components/ui/check';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import SpotlightSearch from './SpotlightSearch';

const Navbar = () => {
  const { openWindow, lockScreen } = useWindowStore();
  const [activeMenu, setActiveMenu] = useState(null);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  const toggleWifi = () => setWifiEnabled(!wifiEnabled);
  const toggleBluetooth = () => setBluetoothEnabled(!bluetoothEnabled);

  const handleIconClick = (menu) => {
    if (menu === 'search') {
      setSpotlightOpen((prev) => !prev);
      setActiveMenu(null);
    } else {
      setActiveMenu(activeMenu === menu ? null : menu);
    }
  };

  return (
    <>
      {activeMenu && (
        <div className="fixed inset-0 z-[90]" onClick={() => setActiveMenu(null)} />
      )}

      {/* ── Spotlight Search ─────────────────────────────────────────────────── */}
      <SpotlightSearch
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
      />

      <nav className="relative w-full h-[30px] flex justify-between items-center bg-black/20 backdrop-blur-2xl px-4 select-none border-b border-white/10 shadow-sm z-[100] font-inter text-white">
        {/* Left side: Logo & Title */}
        <div className="flex items-center gap-2">
          <img src="/images/logo.svg" alt="logo" className="size-4 invert" />
          <p className="font-bold text-[13px] font-mona tracking-tight flex items-center shrink-0">
            Sruthika<span className="hidden sm:inline">'s Portfolio</span>
          </p>

          <ul className="ml-4 hidden md:flex items-center">
            {navLinks.map(({ id, name, type }) => (
              <li 
                key={id} 
                onClick={() => openWindow(type)}
                className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded transition-all text-white font-medium text-[13px] whitespace-nowrap"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>

        {/* Right side: Icons & Time */}
        <div className="flex items-center gap-3 relative">
          <ul className="hidden md:flex items-center gap-3 mr-1">
            <li 
              onClick={() => handleIconClick('wifi')}
              className={`p-1.5 rounded-md transition-colors active:scale-90 cursor-pointer ${activeMenu === 'wifi' ? 'bg-white/30' : 'hover:bg-white/20'}`}
              aria-label="Wi-Fi Status"
            >
              <WifiIcon size={15} className="opacity-95" />
            </li>
            <li 
              onClick={() => handleIconClick('user')}
              className={`p-0.5 rounded-full transition-colors active:scale-90 cursor-pointer ${activeMenu === 'user' ? 'ring-2 ring-white/50' : 'hover:ring-2 hover:ring-white/30'}`}
              aria-label="User Menu"
            >
              <img
                src="/images/avatar.png"
                alt="Sruthika"
                className="w-[22px] h-[22px] rounded-full object-cover border border-white/20 shadow-sm"
              />
            </li>
            <li 
              onClick={() => handleIconClick('search')}
              className={`p-1.5 rounded-md transition-colors active:scale-90 cursor-pointer ${spotlightOpen ? 'bg-white/30' : 'hover:bg-white/20'}`}
              aria-label="Spotlight Search"
            >
              <SearchIcon size={15} className="opacity-95" />
            </li>
            <li 
              onClick={() => handleIconClick('settings')}
              className={`p-1.5 rounded-md transition-colors active:scale-90 cursor-pointer ${activeMenu === 'settings' ? 'bg-white/30' : 'hover:bg-white/20'}`}
              aria-label="Control Center"
            >
              <SettingsIcon size={15} className="opacity-95" />
            </li>
          </ul>

          <time className="text-[13px] font-medium text-white tracking-wide">
            {dayjs().format("ddd MMM D h:mm A")}
          </time>

          {/* Menus */}
          <AnimatePresence>
            {activeMenu === 'wifi' && (
              <motion.div 
                 initial={{ opacity: 0, y: -5, scale: 0.98 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: -5, scale: 0.98 }}
                 transition={{ duration: 0.15, ease: "easeOut" }}
                 className="absolute top-8 right-0 w-64 p-2 bg-[#1e1e1e]/70 backdrop-blur-2xl rounded-xl shadow-2xl border-2 border-white/10 text-white z-50 origin-top-right will-change-transform"
                 onClick={(e) => e.stopPropagation()}
              >
                  {/* Header */}
                  <div className="flex justify-between items-center px-3 py-2 border-b border-white/10 mb-2">
                     <span className="text-[14px] font-bold tracking-tight text-white leading-none whitespace-nowrap">Wi-Fi</span>
                     <Switch 
                        checked={wifiEnabled} 
                        onCheckedChange={setWifiEnabled}
                        size="sm"
                        className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-white/20 border-transparent shadow-none scale-90 origin-right ml-4 shrink-0"
                     />
                  </div>
                  
                  {/* Networks List */}
                  <div className={cn("flex flex-col gap-[1px]", !wifiEnabled && "opacity-40 pointer-events-none")}>
                      {/* Active */}
                      <div className="px-2 py-[7px] bg-white/10 backdrop-blur-sm text-white rounded-md flex justify-between items-center cursor-pointer border-2 border-white/15 shadow-sm">
                         <div className="flex items-center gap-2">
                             <WifiIcon size={14} className="opacity-80" />
                             <span className="text-[13px] font-semibold leading-tight">Sruthika's Network</span>
                         </div>
                         <CheckIcon size={14} className="text-white/80" />
                      </div>
                      
                      {/* Divider */}
                      <div className="h-[1px] w-[calc(100%-16px)] mx-auto bg-white/5 my-1" />
                      
                      {/* Other */}
                      <div className="px-2 py-[7px] hover:bg-white/10 rounded-md flex justify-between items-center cursor-pointer transition-colors group">
                         <div className="flex items-center gap-2">
                             <WifiIcon size={14} className="opacity-40 group-hover:opacity-100" />
                             <span className="text-[13px] font-medium text-gray-300 group-hover:text-white leading-tight transition-colors">Workspace_5G</span>
                         </div>
                      </div>
                      <div className="px-2 py-[7px] hover:bg-white/10 rounded-md flex justify-between items-center cursor-pointer transition-colors group">
                         <div className="flex items-center gap-2">
                             <WifiIcon size={14} className="opacity-40 group-hover:opacity-100" />
                             <span className="text-[13px] font-medium text-gray-300 group-hover:text-white leading-tight transition-colors">Design Studio</span>
                         </div>
                      </div>
                  </div>
              </motion.div>
            )}

            {activeMenu === 'user' && (
              <motion.div 
                 initial={{ opacity: 0, y: -5, scale: 0.98 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: -5, scale: 0.98 }}
                 transition={{ duration: 0.15, ease: "easeOut" }}
                 className="absolute top-8 right-0 w-[240px] p-[5px] bg-[#1a1a1a]/85 backdrop-blur-3xl rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-2 border-white/10 text-white z-50 origin-top-right will-change-transform flex flex-col items-start pointer-events-auto"
                 onClick={(e) => e.stopPropagation()}
              >
                  {/* User Profile Info Section */}
                  <div className="w-full flex items-start gap-4 px-1.5 py-3 ml-0">
                      <div className="relative shrink-0">
                      <img
                        src="/images/avatar.png"
                        alt="Sruthika"
                        className="w-11 h-11 rounded-full object-cover border-[1.5px] border-white/20 shadow-inner"
                      />
                      <div className="absolute -bottom-0 -right-0 w-3.5 h-3.5 bg-green-500 border-[2px] border-[#1a1a1a] rounded-full shadow-sm" />
                  </div>
                      <div className="flex flex-col justify-start items-start min-w-0 flex-1 gap-1.5">
                          <div className="text-[14px] font-bold leading-none tracking-tight truncate text-white text-left">Sruthika</div>
                          <div className="text-[11px] text-gray-400 font-medium leading-tight tracking-wide text-left uppercase">UI/UX Designer</div>
                      </div>
                  </div>

                  <Separator className="bg-white/10 opacity-30 w-full" />
                  
                  {/* Action Buttons Section */}
                  <div className="w-full flex flex-col gap-0.5 mt-0.5">
                      {[
                        { icon: SettingsIcon, text: "System Settings...", action: () => { openWindow('finder', locations.about); setActiveMenu(null); } },
                        { icon: Lock, text: "Lock Screen", action: () => { lockScreen(); setActiveMenu(null); } }
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.02, x: 2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="w-full"
                        >
                          <Button 
                             variant="ghost" 
                             onClick={item.action}
                             className="w-full justify-start items-center gap-3 px-1.5 py-2 h-auto text-gray-200 hover:bg-white/10 hover:backdrop-blur-xl hover:text-white border-2 border-transparent hover:border-white/20 focus-visible:ring-0 group rounded-xl transition-colors duration-200"
                             onMouseEnter={(e) => {
                               gsap.to(e.currentTarget.querySelector('.menu-icon'), { 
                                 x: 1, rotate: 5, duration: 0.25, ease: "back.out(2)" 
                               });
                             }}
                             onMouseLeave={(e) => {
                               gsap.to(e.currentTarget.querySelector('.menu-icon'), { 
                                 x: 0, rotate: 0, duration: 0.3, ease: "power2.out" 
                               });
                             }}
                          >
                         <item.icon size={15} className="menu-icon text-gray-400 group-hover:text-white transition-opacity duration-200" strokeWidth={2.5} />
                             <span className="text-[13px] font-medium leading-none">{item.text}</span>
                          </Button>
                        </motion.div>
                      ))}
                      
                      <div className="w-full py-0.5">
                          <Separator className="bg-white/10 opacity-20 w-full" />
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02, x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="w-full"
                      >
                        <Button 
                           variant="ghost" 
                           onClick={() => { lockScreen(); setActiveMenu(null); }}
                           className="w-full justify-start items-center gap-3 px-1.5 py-2 h-auto text-gray-200 hover:bg-white/10 hover:backdrop-blur-xl hover:text-white border-2 border-transparent hover:border-white/20 focus-visible:ring-0 group rounded-xl transition-colors duration-200"
                           onMouseEnter={(e) => {
                             gsap.to(e.currentTarget.querySelector('.menu-icon'), { 
                               x: 1, rotate: 5, duration: 0.25, ease: "back.out(2)" 
                             });
                           }}
                           onMouseLeave={(e) => {
                             gsap.to(e.currentTarget.querySelector('.menu-icon'), { 
                               x: 0, rotate: 0, duration: 0.3, ease: "power2.out" 
                             });
                           }}
                        >
                           <LogOut size={15} className="menu-icon text-gray-400 group-hover:text-white transition-opacity duration-200" strokeWidth={2.5} />
                           <span className="text-[13px] font-medium leading-none">Log Out Sruthika...</span>
                        </Button>
                      </motion.div>
                  </div>
              </motion.div>
            )}

            {activeMenu === 'settings' && (
              <motion.div 
                 initial={{ opacity: 0, y: -5, scale: 0.98 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: -5, scale: 0.98 }}
                 transition={{ duration: 0.1, ease: "easeOut" }}
                 className="absolute top-8 right-0 w-[320px] p-2 bg-[#1a1a1a]/85 backdrop-blur-3xl rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-2 border-white/10 text-white z-50 origin-top-right will-change-transform flex flex-col items-stretch gap-2 pointer-events-auto"
                 onClick={(e) => e.stopPropagation()}
              >
                  {/* Connectivity Vertical List */}
                  <div className="flex flex-col gap-2 w-full">
                      {/* Wi-Fi Control Card */}
                      <div 
                         onClick={toggleWifi}
                         className={cn(
                           "bg-white/5 hover:bg-white/15 transition-all duration-150 rounded-2xl px-3.5 py-3 flex items-center gap-4 cursor-pointer border-2 border-white/5 hover:border-white/25 shadow-sm group active:bg-white/20 w-full h-auto min-h-[58px]",
                           !wifiEnabled && "opacity-80"
                         )}
                      >
                          <div className={cn(
                            "rounded-full w-8 h-8 shrink-0 flex items-center justify-center transition-all duration-300",
                            wifiEnabled ? "bg-[#0a84ff] shadow-lg shadow-[#0a84ff]/40" : "bg-white/20 shadow-none"
                          )}>
                              <WifiIcon size={12} className={cn("transition-colors", wifiEnabled ? "text-white" : "text-white/60")}/>
                          </div>
                          <div className="flex flex-col items-start min-w-0 flex-1">
                              <span className="text-[13px] font-bold tracking-tight text-white/90">Wi-Fi</span>
                              <span className="text-[11px] text-white/50 font-bold leading-none mt-0.5 whitespace-nowrap truncate w-full text-left">
                                {wifiEnabled ? "Sruthika's Network" : "Off"}
                              </span>
                          </div>
                      </div>

                      {/* Bluetooth Control Card */}
                      <div 
                         onClick={toggleBluetooth}
                         className={cn(
                           "bg-white/5 hover:bg-white/15 transition-all duration-150 rounded-2xl px-3.5 py-3 flex items-center gap-4 cursor-pointer border-2 border-white/5 hover:border-white/25 shadow-sm group active:bg-white/20 w-full h-auto min-h-[58px]",
                           !bluetoothEnabled && "opacity-80"
                         )}
                      >
                          <div className={cn(
                            "rounded-full w-8 h-8 shrink-0 flex items-center justify-center transition-all duration-300",
                            bluetoothEnabled ? "bg-[#0a84ff] shadow-lg shadow-[#0a84ff]/40" : "bg-white/20 shadow-none"
                          )}>
                              <Bluetooth size={12} strokeWidth={2.8} className={cn("transition-colors", bluetoothEnabled ? "text-white" : "text-white/60")}/>
                          </div>
                          <div className="flex flex-col items-start min-w-0 flex-1">
                              <span className="text-[13px] font-bold tracking-tight text-white/90">Bluetooth</span>
                              <span className="text-[11px] text-white/50 font-bold leading-none mt-0.5 whitespace-nowrap truncate w-full text-left">
                                {bluetoothEnabled ? "On" : "Off"}
                              </span>
                          </div>
                      </div>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
