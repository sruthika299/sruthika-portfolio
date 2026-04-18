import '@fontsource-variable/mona-sans';
import React from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import { socials } from '#constants';
import { motion } from 'framer-motion';
import { Mail, MapPin, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/instagram';
import { LinkedinIcon } from '@/components/ui/linkedin';
import { GithubIcon } from '@/components/ui/github';
import { DribbbleIcon } from '@/components/ui/dribbble';
import { MailCheckIcon } from '@/components/ui/mail-check';
import { MapPinIcon } from '@/components/ui/map-pin';

/* ─── Variants ────────────────────────────────────────────────────────────── */
const panelVariants = {
    hidden:  { opacity: 0, x: -14, filter: 'blur(6px)' },
    visible: {
        opacity: 1, x: 0, filter: 'blur(0px)',
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
    },
};

const listVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.055, delayChildren: 0.18 } },
};

const rowVariants = {
    hidden:  { opacity: 0, x: 12, filter: 'blur(4px)' },
    visible: {
        opacity: 1, x: 0, filter: 'blur(0px)',
        transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
    },
};

/* ─── Icon colours (subtle, glass-tinted) ────────────────────────────────── */
const ICON_COLORS = {
    github:   { bg: 'rgba(99,  99,  102, 0.12)', color: '#48484a' },
    portfolio:{ bg: 'rgba(10,  132, 255, 0.12)', color: '#0a84ff' },
    dribbble: { bg: 'rgba(234, 76, 137, 0.12)', color: '#ea4c89' },
    linkedin: { bg: 'rgba(0,   119, 181, 0.12)', color: '#007ab5' },
};

const iconColorFor = (text) => {
    const key = text.toLowerCase().replace(/[^a-z]/g, '');
    if (key.includes('git'))  return ICON_COLORS.github;
    if (key.includes('link')) return ICON_COLORS.linkedin;
    if (key.includes('dribb')) return ICON_COLORS.dribbble;
    return ICON_COLORS.portfolio;
};

/* ─── Reusable info row ───────────────────────────────────────────────────── */
const InfoRow = ({ icon: Icon, iconStyle, label, value, href }) => {
    const Tag = href ? motion.a : motion.div;
    const extra = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

    return (
        <Tag
            className={`ct-row${href ? ' ct-row-link' : ''}`}
            variants={rowVariants}
            {...extra}
        >
            <span className="ct-icon-pill">
                <Icon size={15} style={{ color: 'rgba(0,0,0,0.72)' }} />
            </span>
            <div className="ct-row-body">
                <span className="ct-row-label">{label}</span>
                <span className="ct-row-value">{value}</span>
            </div>
            {href && <ExternalLink size={11} className="ct-chevron" />}
        </Tag>
    );
};

/* ─── Social row ──────────────────────────────────────────────────────────── */
const SocialRow = ({ social }) => {
    const { bg, color } = iconColorFor(social.text);
    return (
        <motion.a
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ct-row ct-row-link"
            variants={rowVariants}
            whileHover={{ x: 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
            <span className="ct-icon-pill">
                {social.text === 'Instagram' ? (
                    <InstagramIcon size={15} style={{ color: 'rgba(0,0,0,0.72)' }} />
                ) : social.text === 'LinkedIn' ? (
                    <LinkedinIcon size={15} style={{ color: 'rgba(0,0,0,0.72)' }} />
                ) : social.text === 'Github' ? (
                    <GithubIcon size={15} style={{ color: 'rgba(0,0,0,0.72)' }} />
                ) : social.text === 'Dribbble' ? (
                    <DribbbleIcon size={15} style={{ color: 'rgba(0,0,0,0.72)' }} />
                ) : (
                    <img
                        src={social.icon}
                        alt={social.text}
                        className="ct-social-img"
                        style={{ filter: `brightness(0) saturate(100%) opacity(0.72)` }}
                    />
                )}
            </span>
            <span className="ct-row-value ct-social-label flex-1">{social.text}</span>
            <ExternalLink size={11} className="ct-chevron" />
        </motion.a>
    );
};

/* ─── Contact Component ───────────────────────────────────────────────────── */
const Contact = () => {
    const { closeWindow } = useWindowStore();

    return (
        <div className="ct-root">

            {/* ── Traffic-light header ── */}
            <div id="window-header" className="window-header ct-header">
                <div id="window-controls">
                    <button className="close" onClick={() => closeWindow('contact')} />
                    <button className="minimize" />
                    <button className="maximize" />
                </div>
                <h2 className="ct-title font-mona">Contact</h2>
                <div style={{ width: 80 }} />
            </div>

            {/* ── Two-column body ── */}
            <div className="ct-body">

                {/* LEFT – profile panel */}
                <motion.div
                    className="ct-left"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                >

                    <div className="ct-avatar-wrap">
                        <motion.img
                            src="/images/avatar.png"
                            alt="Sruthika"
                            className="ct-avatar"
                            initial={{ scale: 0.82, opacity: 0 }}
                            animate={{ scale: 1,    opacity: 1 }}
                            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <span className="ct-status-dot" />
                    </div>

                    <motion.div
                        className="ct-identity"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h3 className="ct-name font-bricolage">Sruthika</h3>
                        <p className="ct-role font-mona font-medium">UI / UX Designer</p>
                    </motion.div>

                    {/* Status badge */}
                    <motion.div
                        className="ct-badge"
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.42, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="ct-badge-ring" aria-hidden />
                        <span className="ct-badge-inner">
                            <span className="ct-badge-live" />
                            <span className="ct-badge-text">Online</span>
                        </span>
                    </motion.div>
                </motion.div>

                {/* Vertical divider */}
                <div className="ct-divider" />

                {/* RIGHT – info / socials */}
                <div className="ct-right custom-scrollbar">
                    {/* Info group */}
                    <p className="ct-group-label">Info</p>
                    <motion.div
                        className="ct-card"
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <InfoRow
                            icon={MailCheckIcon}
                            label="Email"
                            value="sruthika384@gmail.com"
                            href="mailto:sruthika384@gmail.com"
                        />
                        <InfoRow
                            icon={MapPinIcon}
                            label="Location"
                            value="India"
                        />
                    </motion.div>

                    {/* Socials group */}
                    <p className="ct-group-label">Socials</p>
                    <motion.div
                        className="ct-card"
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {socials.map(s => (
                            <SocialRow key={s.id} social={s} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const ContactWindow = WindowWrapper(Contact, 'contact');
export default ContactWindow;