import { useGSAP } from '@gsap/react'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { TextEffect } from './motion-primitives/text-effect'

const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 900, default: 400 },
    designer: { min: 100, max: 400, default: 100 }
}

const renderText = (text, className, baseWeight = 400) => {
    return text.split(" ").map((word, wordIndex, wordsArray) => (
        <React.Fragment key={wordIndex}>
            <span className="inline-block whitespace-nowrap">
                {[...word].map((char, charIndex) => (
                    <span key={charIndex} className={`letter ${className}`} style={{ fontVariationSettings: `'wght' ${baseWeight}` }}>
                        {char}
                    </span>
                ))}
            </span>
            {wordIndex < wordsArray.length - 1 && " "}
        </React.Fragment>
    ));
}

const setupTextHover = (container, type) => {
    if (!container) return;

    const letters = container.querySelectorAll(".letter");
    const { min, max, default: base } = FONT_WEIGHTS[type];

    const animateLetters = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, { duration, ease: "power2.out", fontVariationSettings: `'wght' ${weight}` })
    }

    const handleMouseMove = (e) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = e.clientX - left;

        letters.forEach((letter) => {
            const { left: l, width: w } = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (l - left + w / 2));
            const intensity = Math.exp(-(distance ** 2) / 20000);

            animateLetters(letter, min + (max - min) * intensity);
        })
    }

    const handleMouseLeave = () =>
        letters.forEach((letter) => {
            animateLetters(letter, base, 0.3);
        });

    // Only add mouse events for tablet/desktop (hover capable devices)
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    }

}

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const titleCleanup = setupTextHover(titleRef.current, "title");
        const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");

        return () => {
            titleCleanup();
            subtitleCleanup();
        }
    }, [])

    return (
        <section id="welcome" className="w-full text-center pointer-events-none">
            <div ref={subtitleRef} className="w-full max-w-xs md:max-w-none mx-auto leading-tight pointer-events-auto">
                <TextEffect as="p" preset='fade-in-blur' per="char" speedReveal={1.5} speedSegment={0.5} 
                    charClassName="letter text-xl sm:text-2xl md:text-3xl font-georama" 
                    charStyle={{ fontVariationSettings: "'wght' 200" }}>
                    Designing intuitive experiences that users loves
                </TextEffect>
            </div>
            <h1 ref={titleRef} className='mt-3 sm:mt-4 leading-none pointer-events-auto'>
                {renderText("Sruthika",
                    "text-6xl sm:text-7xl md:text-9xl italic font-georama"
                )}
            </h1>
            <p className="mt-2 pointer-events-auto">{renderText("UI / UX Designer",
                "text-lg sm:text-xl md:text-2xl font-georama"
            )}
            </p>

            <div className='small-screen'>
                <p>This portfolio is best experienced on desktop and tablet devices.</p>
            </div>
        </section>
    )
}

export default Welcome