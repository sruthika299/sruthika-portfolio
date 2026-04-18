import '@fontsource-variable/outfit';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import { ChevronLeft, ChevronRight, Share, LayoutGrid, List, RotateCw, Lock, BarChart2, Video, AudioLines, Globe, Clock, ExternalLink, Star, ChevronDown, ChevronRight as ChevronRightSm, Music, Search } from 'lucide-react';

import { SettingsIcon } from '@/components/ui/settings';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import useDebounce from '@/hooks/use-debounce';

// ─── FAQ Data with rich answer content ─────────────────────────────────────
const allActionsSample = [
    {
        id: "1",
        label: "What is your UX design process?",
        icon: <Search className="h-4 w-4 text-[#4285F4]" />,
        description: "Discovery, Strategy, & Visuals",
        short: "Q1",
        end: "Process",
        answer: {
            featured: "My UX design process follows a human-centered, iterative framework built on empathy and data. Beginning with user research and stakeholder alignment, I move into ideation, wireframing, high-fidelity prototyping in Figma, and usability testing — refining at each stage until the solution truly serves its audience.",
            steps: [
                { title: "01 — Discover", desc: "User interviews, competitive analysis, and stakeholder mapping to build a holistic understanding of the problem space." },
                { title: "02 — Define", desc: "Synthesize research into clear problem statements, user personas, and journey maps that align the team." },
                { title: "03 — Design", desc: "Iterate from low-fidelity wireframes to pixel-perfect Figma prototypes, applying design tokens and system thinking." },
                { title: "04 — Validate", desc: "Conduct moderated usability tests and A/B sessions, then incorporate findings into refined design iterations." },
                { title: "05 — Deliver", desc: "Collaborate with developers using design specs, component annotations, and QA review for seamless handoff." },
            ],
            results: [
                { url: "portfolio.sruthika.in", title: "UX Design Portfolio — Sruthika", desc: "Explore my full UX process through real case studies including user research artifacts, wireframes, and final solutions." },
                { url: "uxdesign.cc", title: "A Designer's Iterative Process — UX Collective", desc: "Industry-standard approaches to human-centered design and iterative UX methodologies used by top design teams." },
                { url: "nngroup.com", title: "Design Thinking 101 — Nielsen Norman Group", desc: "The gold standard reference for UX process stages, from empathy mapping to validated prototyping." },
            ]
        }
    },
    {
        id: "2",
        label: "What design tools do you use?",
        icon: <LayoutGrid className="h-4 w-4 text-[#EA4335]" />,
        description: "Figma, Adobe XD, & Protopie",
        short: "Q2",
        end: "Toolkit",
        answer: {
            featured: "My core toolkit centers around Figma for all UI/UX design work — from wireframes to production-ready design systems. I use ProtoPie for advanced micro-interactions and logic-based prototypes, Framer for developer-handoff prototypes with live code, and pair everything with Adobe Creative Suite for brand and illustration work.",
            steps: [
                { title: "Figma", desc: "Primary design environment for wireframes, high-fidelity UI, design systems, and collaborative team design." },
                { title: "ProtoPie", desc: "Complex prototyping tool for sensor-based, logic-driven, and multi-screen interactive experiences." },
                { title: "Framer", desc: "Code-powered design and prototyping that bridges design-to-development handoff seamlessly." },
                { title: "Adobe Suite", desc: "Photoshop, Illustrator, and After Effects for branding, iconography, and motion design assets." },
                { title: "Notion & Miro", desc: "Collaborative workspace tools for user research synthesis, journey mapping, and design documentation." },
            ],
            results: [
                { url: "figma.com", title: "Figma — The Collaborative Design Tool", desc: "Where every pixel of my UI work is crafted, from system components to final handoff specs." },
                { url: "protopie.io", title: "ProtoPie — Prototype Smarter", desc: "Advanced interactions and conditional logic for realistic, test-ready prototypes." },
                { url: "framer.com", title: "Framer — Design on the Web", desc: "Bridging the gap between design and code with live, publishable prototypes." },
            ]
        }
    },
    {
        id: "3",
        label: "How do you approach accessibility?",
        icon: <BarChart2 className="h-4 w-4 text-[#FBBC05]" />,
        description: "WCAG 2.1 & Inclusive Design",
        short: "Q3",
        end: "Standards",
        answer: {
            featured: "Accessibility is embedded into my design process from the very first wireframe, not retrofitted at the end. I design to WCAG 2.1 AA standards at minimum, ensuring sufficient color contrast, scalable typography, keyboard navigability, and proper ARIA semantics — because great design works for every human.",
            steps: [
                { title: "Color & Contrast", desc: "All color combinations meet a minimum 4.5:1 contrast ratio for normal text and 3:1 for large text per WCAG 2.1 AA." },
                { title: "Typography", desc: "Design with scalable type, clear hierarchy, and no text smaller than 16px for body copy to support all reading abilities." },
                { title: "Keyboard & Focus", desc: "Every interactive element is reachable via keyboard with clearly visible focus states to support motor-impaired users." },
                { title: "Semantic Structure", desc: "Use proper heading hierarchy, landmark regions, and ARIA labels so screen readers can accurately narrate the UI." },
                { title: "Inclusive Testing", desc: "Validate with real assistive technologies including VoiceOver, NVDA, and automated audit tools like Axe and Lighthouse." },
            ],
            results: [
                { url: "w3.org/WAI", title: "WCAG 2.1 Guidelines — W3C", desc: "The international standard for web accessibility that frames all my inclusive design decisions." },
                { url: "a11yproject.com", title: "The A11Y Project — Accessibility Resources", desc: "Community-driven resources for implementing accessibility best practices in design systems." },
                { url: "deque.com/axe", title: "Axe Accessibility Testing — Deque", desc: "Automated accessibility auditing tool used to validate designs and catch compliance issues." },
            ]
        }
    },
    {
        id: "4",
        label: "What is your mobile-first strategy?",
        icon: <Video className="h-4 w-4 text-[#34A853]" />,
        description: "Responsive & Adaptive Design",
        short: "Q4",
        end: "Strategy",
        answer: {
            featured: "I design mobile-first by default — establishing the core experience on the smallest screen before progressively enhancing for larger viewports. This forces design discipline, prioritizing content hierarchy and touch interactions, while ensuring the experience is never degraded but always elevated as screen real estate increases.",
            steps: [
                { title: "Content Priority", desc: "Define the essential content hierarchy for mobile first, removing anything that isn't critical to the user's core goal." },
                { title: "Touch-First Interactions", desc: "Design tap targets minimum 44×44px, swipe gestures, and bottom navigation patterns optimized for thumb reach zones." },
                { title: "Fluid Grid Systems", desc: "Use 4px base grids, fluid columns, and CSS Container Queries to create layouts that adapt naturally across breakpoints." },
                { title: "Performance Budgets", desc: "Establish image compression standards, lazy loading patterns, and skeleton states to maintain fast load times on mobile networks." },
                { title: "Progressive Enhancement", desc: "Layer in desktop enhancements like hover states, keyboard shortcuts, and expanded navigation only when space allows." },
            ],
            results: [
                { url: "smashingmagazine.com", title: "Mobile-First Design Strategy — Smashing Magazine", desc: "In-depth exploration of mobile-first principles and how they translate into superior responsive design." },
                { url: "material.io", title: "Material Design — Adaptive Layouts", desc: "Google's design system guidelines for building adaptive, responsive interfaces across all screen sizes." },
                { url: "web.dev", title: "Responsive Design Patterns — web.dev", desc: "Modern CSS and layout strategies for building truly adaptive web experiences." },
            ]
        }
    },
    {
        id: "5",
        label: "How do you handle stakeholder feedback?",
        icon: <AudioLines className="h-4 w-4 text-[#4285F4]" />,
        description: "Collaboration & Iteration",
        short: "Q5",
        end: "Workflow",
        answer: {
            featured: "I treat stakeholder feedback as a design input, not a design instruction. My approach involves structured critique sessions, clearly documented design rationale, and a prioritization framework that balances business goals with user needs — turning conflicting feedback into aligned, evidence-backed design decisions.",
            steps: [
                { title: "Structured Critique Sessions", desc: "Facilitate Design Crits with a clear agenda: context-setting, specific feedback prompts, and time-boxed discussion." },
                { title: "Design Documentation", desc: "Maintain living design rationale documents that explain why decisions were made, reducing the 'but why?' cycle." },
                { title: "Feedback Triaging", desc: "Use a 2×2 matrix (user impact vs. business value) to prioritize which feedback to implement, defer, or respectfully decline." },
                { title: "Prototype-Driven Reviews", desc: "Present interactive prototypes rather than static screens so stakeholders react to the experience, not the visuals." },
                { title: "Iteration Transparency", desc: "Share version-controlled design files with clear changelogs so stakeholders see evolution and understand the reasoning behind shifts." },
            ],
            results: [
                { url: "figma.com/community", title: "Design Critique Best Practices — Figma Community", desc: "Frameworks and templates for running effective, constructive design critique sessions with stakeholders." },
                { url: "invisionapp.com", title: "Stakeholder Management for Designers — InVision", desc: "Practical strategies for aligning stakeholders and navigating conflicting feedback in design projects." },
                { url: "medium.com/design", title: "Design Decision Frameworks — Medium Design", desc: "Evidence-based frameworks for making and communicating design decisions to non-designer audiences." },
            ]
        }
    },
    {
        id: "6",
        label: "What are your hobbies?",
        icon: <Music className="h-4 w-4 text-[#EA4335]" />,
        description: "Music, Movies & Series",
        short: "Q6",
        end: "Personal",
        answer: {
            featured: "Outside of design, I'm a passionate music listener and a dedicated binge-watcher. I find deep inspiration in the storytelling, visual direction, and emotional pacing of great films and series — experiences that directly inform how I think about user journeys, narrative flow, and the emotional arc of a design.",
            steps: [
                { title: "Music Enthusiast", desc: "I listen to an enormous variety of music spanning multiple genres — from soulful Carnatic classical to global pop, indie, and film scores." },
                { title: "Binge-Watching", desc: "A dedicated watcher of movies and series across genres. I'm drawn to stories with strong visual aesthetics, character depth, and thoughtful pacing." },
                { title: "Design Inspiration", desc: "Series with exceptional production design — like cinematography, color grading, and UI in sci-fi — constantly inspire my own design sensibility." },
                { title: "Emotional Storytelling", desc: "The way a film builds emotional connection through visuals directly parallels how I approach designing user experiences that feel meaningful." },
                { title: "Playlist Curator", desc: "Curating playlists for different moods and activities is a hobby that reflects the same intent-driven thinking I bring to information architecture." },
            ],
            results: [
                { url: "spotify.com", title: "Spotify — Sruthika's Playlists", desc: "A curated collection of playlists spanning mood, genre, and occasion — a window into my listening world." },
                { url: "letterboxd.com", title: "Letterboxd — Film Diary", desc: "Tracking, reviewing, and discovering films — a habit that sharpens my eye for visual storytelling." },
                { url: "imdb.com", title: "IMDb — Watchlist & Reviews", desc: "My ever-growing watchlist that spans international cinema, prestige TV, and animated masterpieces." },
            ]
        }
    },
    {
        id: "7",
        label: "What are your extra-curricular activities?",
        icon: <Star className="h-4 w-4 text-[#FBBC05]" />,
        description: "Stage, Music & Leadership",
        short: "Q7",
        end: "Activities",
        answer: {
            featured: "Beyond academics and design, I've had a rich life on stage and in leadership. As Musical Club Co-ordinator for Vistara Students Club — my college's cultural association — I led performances and events that brought students together. My roots in Carnatic classical music, which I trained in formally for 7 years, give me a deep appreciation for discipline, structure, and the beauty of craft.",
            steps: [
                { title: "Musical Club Co-ordinator", desc: "Served as Co-ordinator of the Music Club under Vistara Students Club, my college's cultural association, organising and leading on-stage musical performances and cultural events." },
                { title: "Vistara Students Club", desc: "An active member of the college's premier cultural club, contributing to event planning, stage management, and creative direction for college-wide festivals." },
                { title: "Carnatic Classical Music", desc: "Trained formally in Carnatic classical music for 7 years, developing deep musical knowledge, vocal discipline, and an appreciation for structured, rule-bound artistry." },
                { title: "On-Stage Performance", desc: "Performed on stage at college culturals and festivals, an experience that built confidence, presence, and the ability to communicate powerfully to an audience." },
                { title: "Creative Leadership", desc: "Coordinating club activities developed skills in team management, event logistics, and creative collaboration — directly applicable to design project leadership." },
            ],
            results: [
                { url: "vistara.club", title: "Vistara Students Club — Cultural Association", desc: "The college cultural club where I led the music chapter, organising performances and cultural events across the academic year." },
                { url: "carnaticmusic.in", title: "Carnatic Classical Music — Heritage & Training", desc: "The classical Indian music tradition I trained in for 7 years, building discipline, musicality, and artistic depth." },
                { url: "portfolio.sruthika.in/about", title: "About Sruthika — Beyond Design", desc: "Learn more about the experiences, interests, and values that shape my approach to design and creativity." },
            ]
        }
    },
];

// ─── Google Search Results Page Component ──────────────────────────────────
const SearchResultsPage = ({ action, onBack, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [showAllSteps, setShowAllSteps] = useState(false);
    const [showAllQuestions, setShowAllQuestions] = useState(false);
    const tabs = ['All', 'Images', 'News', 'Videos', 'Shopping', 'More'];

    // Reset expanded state whenever navigating to a new question
    useEffect(() => {
        setShowAllSteps(false);
        setShowAllQuestions(false);
    }, [action.id]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="h-full flex flex-col overflow-hidden bg-white"
        >
            {/* Google SERP Header */}
            <div className="border-b border-gray-200 bg-white shrink-0">
                {/* Row 1: Logo + Search Bar */}
                <div className="flex items-center gap-4 px-6 pt-3 pb-3">
                    <div className="shrink-0">
                        <span className="text-[22px] font-medium tracking-tight flex items-center leading-none">
                            <span className="text-[#4285F4]">G</span>
                            <span className="text-[#EA4335]">o</span>
                            <span className="text-[#FBBC05]">o</span>
                            <span className="text-[#4285F4]">g</span>
                            <span className="text-[#34A853]">l</span>
                            <span className="text-[#EA4335]">e</span>
                        </span>
                    </div>

                    <div
                        id="serp-search-box"
                        className="flex items-center gap-2 flex-1 max-w-[600px] h-[44px] bg-white border-2 border-[#dfe1e5] rounded-[22px] px-4 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:border-gray-300 transition-all cursor-pointer"
                        onClick={onBack}
                    >
                        <Search size={16} className="text-[#4285F4] shrink-0" />
                        <span className="text-[15px] text-[#202124] font-mona truncate">{action.label}</span>
                        <div className="ml-auto flex items-center gap-2 shrink-0">
                            <div className="w-px h-5 bg-gray-200" />
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill="#4285F4"/>
                                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill="#34A853"/>
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-2 shrink-0">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#70757a]" title="Settings">
                            <SettingsIcon size={20} />
                        </button>
                        <button className="w-8 h-8 rounded-full shadow-sm hover:brightness-110 transition-all shrink-0 overflow-hidden flex items-center justify-center bg-gray-100">
                            <img src="/images/avatar.png" alt="User" className="w-full h-full object-cover" />
                        </button>
                    </div>
                </div>

                {/* Row 2: Tabs */}
                <div className="flex items-end gap-0 pl-[108px]">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-4 py-2 text-[13px] border-b-[3px] transition-colors whitespace-nowrap ${
                                activeTab === tab.toLowerCase()
                                    ? 'text-[#1a73e8] border-[#1a73e8] font-medium'
                                    : 'text-[#70757a] border-transparent hover:text-[#202124] hover:border-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Body */}
            <div className="flex-1 overflow-y-auto bg-white">
                <div className="max-w-[700px] mx-auto px-6 py-4">

                    {/* Stats */}
                    <p className="text-[13px] text-[#70757a] mb-4 font-bricolage">
                        About 4,21,000 results (0.38 seconds)
                    </p>

                    {/* AI Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="mb-6 border-2 border-[#e8eaed] rounded-2xl overflow-hidden"
                    >
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#e8f0fe] to-[#fce8e6] border-b border-[#e8eaed]">
                            <div className="flex gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                            </div>
                            <span className="text-[12px] font-semibold text-[#444746] font-bricolage tracking-wide uppercase">AI Overview</span>
                        </div>

                        <div className="p-4 bg-white">
                            <p className="text-[14px] text-[#202124] leading-[1.7] font-mona">
                                {action.answer.featured}
                            </p>

                            <div className="mt-4 space-y-2.5">
                                {action.answer.steps.slice(0, 2).map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.07, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                                        className="flex gap-3"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-[#e8f0fe] flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-[10px] font-bold text-[#1a73e8] font-bricolage">{i + 1}</span>
                                        </div>
                                        <div>
                                            <span className="text-[13px] font-semibold text-[#202124] font-mona">{step.title} </span>
                                            <span className="text-[13px] text-[#444746] font-mona leading-[1.6]">— {step.desc}</span>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Expanded steps */}
                                <AnimatePresence>
                                    {showAllSteps && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                            className="overflow-hidden space-y-2.5"
                                        >
                                            {action.answer.steps.slice(2).map((step, i) => (
                                                <motion.div
                                                    key={i + 2}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.07, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                                    className="flex gap-3"
                                                >
                                                    <div className="w-5 h-5 rounded-full bg-[#e8f0fe] flex items-center justify-center shrink-0 mt-0.5">
                                                        <span className="text-[10px] font-bold text-[#1a73e8] font-bricolage">{i + 3}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[13px] font-semibold text-[#202124] font-mona">{step.title} </span>
                                                        <span className="text-[13px] text-[#444746] font-mona leading-[1.6]">— {step.desc}</span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={() => setShowAllSteps(prev => !prev)}
                                className="mt-3 flex items-center gap-1.5 text-[13px] text-[#1a73e8] font-medium font-bricolage hover:underline"
                            >
                                <motion.div
                                    animate={{ rotate: showAllSteps ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    <ChevronDown size={14} />
                                </motion.div>
                                {showAllSteps ? "Show less" : `Show ${action.answer.steps.length - 2} more`}
                            </button>
                        </div>
                    </motion.div>

                    {/* Organic Results */}
                    <div className="space-y-6">
                        {action.answer.results.map((result, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                className="group cursor-pointer"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                                        <Globe size={10} className="text-gray-500" />
                                    </div>
                                    <span className="text-[12px] text-[#202124] font-bricolage">{result.url}</span>
                                    <ChevronDown size={12} className="text-[#70757a]" />
                                </div>
                                <h3 className="text-[19px] text-[#1a0dab] font-mona group-hover:underline leading-[1.3] mb-1">
                                    {result.title}
                                </h3>
                                <p className="text-[14px] text-[#444746] font-bricolage leading-[1.6]">
                                    <span className="text-[#70757a] text-[12px]">
                                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} — 
                                    </span>
                                    {' '}{result.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* People Also Ask — now fully navigable */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                        className="mt-8 border-t border-gray-200 pt-6"
                    >
                        <h4 className="text-[16px] font-medium text-[#202124] font-mona mb-4">People also ask</h4>
                        <div className="space-y-2">
                            {/* Always visible — first 4 */}
                            {allActionsSample.slice(0, 4).map((related, i) => {
                                const isCurrent = related.id === action.id;
                                return (
                                    <motion.div
                                        key={related.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.75 + i * 0.06, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                                        onClick={() => !isCurrent && onNavigate(related)}
                                        className={`group flex items-center justify-between p-3.5 border-2 rounded-lg transition-all ${
                                            isCurrent
                                                ? 'border-[#c5d2f7] bg-[#f0f6ff] cursor-default'
                                                : 'border-gray-200 hover:bg-[#f8f9ff] hover:border-[#c5d2f7] cursor-pointer'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#e8f0fe] flex items-center justify-center shrink-0">
                                                {related.icon}
                                            </div>
                                            <span className={`text-[14px] font-mona transition-colors ${isCurrent ? 'text-[#1a73e8]' : 'text-[#202124] group-hover:text-[#1a73e8]'}`}>
                                                {related.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[11px] text-[#70757a] font-bricolage">{related.end}</span>
                                            {isCurrent
                                                ? <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] opacity-60" />
                                                : <ChevronRightSm size={14} className="text-[#70757a] group-hover:text-[#1a73e8] transition-colors" />
                                            }
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Remaining questions — animated expand */}
                            <AnimatePresence>
                                {showAllQuestions && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                                        className="overflow-hidden space-y-2"
                                    >
                                        {allActionsSample.slice(4).map((related, i) => {
                                            const isCurrent = related.id === action.id;
                                            return (
                                                <motion.div
                                                    key={related.id}
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.08, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                                                    onClick={() => !isCurrent && onNavigate(related)}
                                                    className={`group flex items-center justify-between p-3.5 border-2 rounded-lg transition-all ${
                                                        isCurrent
                                                            ? 'border-[#c5d2f7] bg-[#f0f6ff] cursor-default'
                                                            : 'border-gray-200 hover:bg-[#f8f9ff] hover:border-[#c5d2f7] cursor-pointer'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-[#e8f0fe] flex items-center justify-center shrink-0">
                                                            {related.icon}
                                                        </div>
                                                        <span className={`text-[14px] font-mona transition-colors ${isCurrent ? 'text-[#1a73e8]' : 'text-[#202124] group-hover:text-[#1a73e8]'}`}>
                                                            {related.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="text-[11px] text-[#70757a] font-bricolage">{related.end}</span>
                                                        {isCurrent
                                                            ? <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] opacity-60" />
                                                            : <ChevronRightSm size={14} className="text-[#70757a] group-hover:text-[#1a73e8] transition-colors" />
                                                        }
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Show more / less toggle */}
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.0 }}
                                onClick={() => setShowAllQuestions(prev => !prev)}
                                className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 text-[13px] text-[#1a73e8] font-medium font-bricolage hover:bg-[#f0f4ff] rounded-lg border-2 border-dashed border-[#c5d2f7] hover:border-[#1a73e8] transition-all"
                            >
                                <motion.div
                                    animate={{ rotate: showAllQuestions ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    <ChevronDown size={14} />
                                </motion.div>
                                {showAllQuestions ? "Show fewer questions" : `Show ${allActionsSample.length - 4} more questions`}
                            </motion.button>
                        </div>
                    </motion.div>

                    <div className="h-8" />
                </div>
            </div>
        </motion.div>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────
const SafariWindow = () => {
    const closeWindow = useWindowStore((state) => state.closeWindow);
    
    const contentRef = useRef(null);
    const listRef = useRef(null);
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [currentPage, setCurrentPage] = useState(null); // null = home, action obj = results
    const debouncedQuery = useDebounce(query, 150);

    const filteredActions = useMemo(() => {
        if (!debouncedQuery) return allActionsSample;
        const q = debouncedQuery.toLowerCase().trim();
        return allActionsSample.filter(a =>
            `${a.label} ${a.description || ""}`.toLowerCase().includes(q)
        );
    }, [debouncedQuery]);

    const handleSelect = (action) => {
        setIsFocused(false);
        setQuery("");
        setCurrentPage(action);
        // Update address bar
        gsap.to("#serp-address", { opacity: 1, duration: 0.3 });
    };

    const handleBack = () => {
        setCurrentPage(null);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (!isFocused) return;
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex(prev => {
                    const next = prev < filteredActions.length - 1 ? prev + 1 : 0;
                    setTimeout(() => {
                        const el = listRef.current?.children[next];
                        el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                    }, 0);
                    return next;
                });
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex(prev => {
                    const next = prev > 0 ? prev - 1 : filteredActions.length - 1;
                    setTimeout(() => {
                        const el = listRef.current?.children[next];
                        el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                    }, 0);
                    return next;
                });
                break;
            case "Enter":
                if (activeIndex >= 0 && filteredActions[activeIndex]) {
                    handleSelect(filteredActions[activeIndex]);
                } else if (query) {
                    const match = allActionsSample.find(a => a.label.toLowerCase().includes(query.toLowerCase()));
                    if (match) handleSelect(match);
                }
                break;
            case "Escape":
                setIsFocused(false);
                break;
        }
    };

    // Dynamic Placeholder Logic
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [placeholderText, setPlaceholderText] = useState(allActionsSample[0].label);

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex(prev => (prev + 1) % allActionsSample.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setPlaceholderText(allActionsSample[placeholderIndex].label);
    }, [placeholderIndex]);

    // Header States
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText("https://google.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRefresh = () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        gsap.to(contentRef.current, {
            opacity: 0.5, filter: "blur(4px)", y: 5, duration: 0.3, ease: "power2.out",
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(contentRef.current, {
                        opacity: 1, filter: "blur(0px)", y: 0, duration: 0.4,
                        ease: "power3.out", onComplete: () => setIsRefreshing(false)
                    });
                }, 500);
            }
        });
    };

    return (
        <div className="bg-white h-full flex flex-col font-mona select-none overflow-hidden rounded-xl shadow-2xl border border-white/20">
            {/* Safari Chrome / Toolbar */}
            <div id="window-header" className="window-header h-[52px] bg-[#f6f6f6]/95 backdrop-blur-md border-b border-gray-200/60 flex items-center px-4 gap-2 shrink-0 z-20">
                {/* Traffic Lights */}
                <div id="window-controls" className="flex gap-2 min-w-[70px]">
                    <button className="close" onClick={() => closeWindow("safari")} aria-label="Close Safari" />
                    <button className="minimize" aria-label="Minimize Safari" />
                    <button className="maximize" aria-label="Maximize Safari" />
                </div>

                {/* Navigation */}
                <div className="hidden sm:flex items-center gap-3 text-gray-500 ml-2">
                    <button
                        onClick={currentPage ? handleBack : undefined}
                        className={`transition-all ${currentPage ? 'text-[#5A5A5C] hover:opacity-70 cursor-pointer' : 'text-[#B0B0B2] cursor-not-allowed'}`}
                        aria-label="Go Back"
                    >
                        <ChevronLeft size={20} strokeWidth={1.5} />
                    </button>
                    <button className="transition-all text-[#B0B0B2] cursor-not-allowed" aria-label="Go Forward">
                        <ChevronRight size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Address Bar */}
                <div
                    onClick={handleShare}
                    className="flex-1 max-w-[400px] md:max-w-xl mx-auto h-7 bg-white/80 border border-gray-200/50 rounded-md shadow-sm flex items-center justify-between px-2.5 overflow-hidden cursor-pointer hover:bg-white transition-colors group relative"
                >
                    <div className="w-4" />
                    <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-80 transition-opacity">
                        <Lock size={12} className="text-gray-500" />
                        <span className="text-[12px] font-medium text-gray-600 tracking-tight truncate">
                            {currentPage ? `google.com/search?q=${encodeURIComponent(currentPage.label)}` : 'google.com'}
                        </span>
                    </div>
                    <button
                        onClick={e => { e.stopPropagation(); handleRefresh(); }}
                        className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label="Refresh Page"
                    >
                        <RotateCw size={12} strokeWidth={2.5} className={isRefreshing ? 'animate-spin text-blue-500' : ''} />
                    </button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1 text-gray-500 min-w-[70px] justify-end relative">
                    <button onClick={handleShare} className="p-1.5 hidden xs:block hover:bg-gray-200 rounded-md transition-colors" aria-label="Share">
                        <Share size={15} strokeWidth={2} />
                    </button>
                    <AnimatePresence>
                        {copied && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="absolute top-10 right-0 bg-white shadow-xl border border-gray-200 rounded-lg p-2 text-xs text-black whitespace-nowrap z-50 pointer-events-none"
                            >
                                Link copied!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden bg-white">
                <div
                    ref={contentRef}
                    className={`flex-1 overflow-hidden relative flex flex-col transition-all duration-300 ${isRefreshing ? 'opacity-40 grayscale-[0.2] pointer-events-none' : ''}`}
                >
                    <AnimatePresence mode="wait">
                        {currentPage ? (
                            <SearchResultsPage key={currentPage.id} action={currentPage} onBack={handleBack} onNavigate={handleSelect} />
                        ) : (
                            <motion.div
                                key="homepage"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                                className="flex-1 overflow-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                            >
                                {/* Top Nav */}
                                <div className="absolute top-0 right-0 p-4 flex items-center gap-4 text-[13px] text-gray-700 z-10">
                                    <a href="https://gmail.com" target="_blank" className="hover:underline cursor-pointer">Gmail</a>
                                    <a href="https://google.com/imghp" target="_blank" className="hover:underline cursor-pointer">Images</a>
                                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Google apps">
                                        <LayoutGrid size={18} className="text-gray-500" />
                                    </button>
                                    <button className="w-8 h-8 rounded-full shadow-sm hover:brightness-110 transition-all overflow-hidden flex items-center justify-center bg-gray-100">
                                        <img src="/images/avatar.png" alt="User" className="w-full h-full object-cover" />
                                    </button>
                                </div>

                                {/* Center Content */}
                                <motion.div className="flex-1 flex flex-col items-center justify-center -mt-12 scale-[0.85] sm:scale-100">
                                    {/* Logo */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                        className="mb-8 select-none"
                                    >
                                        <h1 className="text-[72px] sm:text-[92px] font-medium tracking-tight flex items-center">
                                            <span className="text-[#4285F4]">G</span>
                                            <span className="text-[#EA4335]">o</span>
                                            <span className="text-[#FBBC05]">o</span>
                                            <span className="text-[#4285F4]">g</span>
                                            <span className="text-[#34A853]">l</span>
                                            <span className="text-[#EA4335]">e</span>
                                        </h1>
                                    </motion.div>

                                    {/* Search Box */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                        className="w-full max-w-[584px] px-4 group relative z-50"
                                    >
                                        <div
                                            id="google-search-box"
                                            className="flex flex-col w-full bg-white border-2 border-[#dfe1e5] shadow-[0_1px_4px_rgba(0,0,0,0.08)] rounded-[24px] overflow-hidden"
                                        >
                                            <div className="flex items-center min-h-[46px] px-4.5">
                                                <div className="flex items-center justify-center p-3 text-[#9aa0a6] transition-colors group-focus-within:text-[#4285F4]">
                                                    <Search size={20} />
                                                </div>
                                                <div className="flex-1 relative flex items-center min-h-[46px]">
                                                    <input
                                                        type="text"
                                                        value={query}
                                                        onChange={e => setQuery(e.target.value)}
                                                        onFocus={() => {
                                                            setIsFocused(true);
                                                            gsap.to("#google-search-box", { boxShadow: "0 2px 8px rgba(0,0,0,0.12)", borderColor: "transparent", duration: 0.8, ease: "power3.inOut" });
                                                        }}
                                                        onBlur={() => {
                                                            setIsFocused(false);
                                                            gsap.to("#google-search-box", { boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderColor: "#dfe1e5", duration: 0.8, ease: "power3.inOut" });
                                                        }}
                                                        onKeyDown={handleKeyDown}
                                                        className="flex-1 w-full bg-transparent border-none outline-none text-[#202124] text-[16px] py-2 px-1 autofill:bg-transparent focus:ring-0 z-10"
                                                        autoComplete="off"
                                                    />
                                                    {/* Animated Placeholder */}
                                                    {!query && (
                                                        <div className="absolute left-1 pointer-events-none flex items-center h-full overflow-hidden w-full">
                                                            <AnimatePresence mode="wait">
                                                                <motion.span
                                                                    key={placeholderText}
                                                                    initial={{ y: 20, opacity: 0 }}
                                                                    animate={{ y: 0, opacity: 0.5 }}
                                                                    exit={{ y: -20, opacity: 0 }}
                                                                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                                                    className="text-[#70757a] text-[16px] whitespace-nowrap"
                                                                >
                                                                    {placeholderText}
                                                                </motion.span>
                                                            </AnimatePresence>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 pr-2 opacity-80">
                                                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors" title="Search by voice">
                                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill="#4285F4"/>
                                                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill="#34A853"/>
                                                        </svg>
                                                    </button>
                                                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors" title="Search by image">
                                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="#FBBC05"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Dropdown */}
                                            <AnimatePresence mode="popLayout">
                                                {isFocused && (
                                                    <motion.div
                                                        key="suggestions"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ 
                                                            duration: 0.8,
                                                            ease: [0.23, 1, 0.32, 1] 
                                                        }}
                                                        className="overflow-hidden border-t border-gray-200/50 pb-3"
                                                    >
                                                        <ul ref={listRef} className="py-2 max-h-[268px] overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                            {filteredActions.length > 0 ? (
                                                                filteredActions.map((action, idx) => (
                                                                    <li
                                                                        key={action.id}
                                                                        onMouseDown={() => handleSelect(action)}
                                                                        className={`flex items-center justify-between px-5 py-2 cursor-pointer transition-colors ${activeIndex === idx ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                                                    >
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="w-5 flex items-center justify-center text-gray-400">{action.icon}</div>
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[15px] text-[#202124] font-mona font-medium">{action.label}</span>
                                                                                {action.description && <span className="text-[12px] text-gray-500 font-bricolage">{action.description}</span>}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            {action.short && <span className="text-[11px] text-[#70757a] font-bricolage font-semibold bg-gray-100 px-1.5 py-0.5 rounded-sm">{action.short}</span>}
                                                                            {action.end && <span className="text-[11px] text-[#70757a] font-bricolage">{action.end}</span>}
                                                                        </div>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <div className="px-5 py-4 text-[#70757a] text-[14px]">No results for "{query}"</div>
                                                            )}
                                                        </ul>
                                                        <div className="px-5 mt-2 flex items-center justify-between text-[11px] text-[#70757a] opacity-80 font-medium">
                                                            <span className="font-mona tracking-tighter uppercase">Design FAQ</span>
                                                            <div className="flex gap-4">
                                                                <span>↑↓ navigate</span>
                                                                <span>↵ select</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>

                                    {/* Buttons */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: 0.2, duration: 0.4, ease: [0.23, 1, 0.32, 1] }} 
                                        className="flex items-center gap-3 pt-7"
                                    >
                                        <button className="px-4 py-2 bg-[#f8f9fa] border border-[#f8f9fa] hover:border-[#dadce0] hover:shadow-sm rounded-md text-[14px] text-[#3c4043] transition-all">
                                            Google Search
                                        </button>
                                        <button className="px-4 py-2 bg-[#f8f9fa] border border-[#f8f9fa] hover:border-[#dadce0] hover:shadow-sm rounded-md text-[14px] text-[#3c4043] transition-all">
                                            I'm Feeling Lucky
                                        </button>
                                    </motion.div>

                                    {/* Language */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }} 
                                        className="mt-6 text-[13px] text-[#4d5156]"
                                    >
                                        Google offered in:
                                        <span className="text-[#1a0dab] hover:underline cursor-pointer px-1">हिन्दी</span>
                                        <span className="text-[#1a0dab] hover:underline cursor-pointer px-1">বাংলা</span>
                                        <span className="text-[#1a0dab] hover:underline cursor-pointer px-1">తెలుగు</span>
                                        <span className="text-[#1a0dab] hover:underline cursor-pointer px-1">मराठी</span>
                                    </motion.div>
                                </motion.div>

                                {/* Footer */}
                                <div className="bg-[#f2f2f2] text-gray-500 text-[14px] shrink-0">
                                    <div className="px-8 py-3 border-b border-gray-300 font-medium">India</div>
                                    <div className="px-8 py-3 flex flex-wrap justify-center sm:justify-between items-center gap-y-4">
                                        <div className="flex gap-6">
                                            <a href="https://about.google/" target="_blank" className="hover:underline">About</a>
                                            <a href="https://ads.google.com/" target="_blank" className="hover:underline">Advertising</a>
                                            <a href="https://www.google.com/services/" target="_blank" className="hover:underline">Business</a>
                                            <a href="https://google.com/search/howsearchworks" target="_blank" className="hover:underline">How Search works</a>
                                        </div>
                                        <div className="flex gap-6">
                                            <a href="https://google.com/intl/en/policies/privacy/" target="_blank" className="hover:underline">Privacy</a>
                                            <a href="https://google.com/intl/en/policies/terms/" target="_blank" className="hover:underline">Terms</a>
                                            <a href="#" className="hover:underline">Settings</a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const WrappedSafari = WindowWrapper(SafariWindow, "safari");
export default WrappedSafari;
