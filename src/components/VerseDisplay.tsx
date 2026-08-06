import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Verse, AppSettings } from '../types';


interface VerseDisplayProps {
  verse: Verse;
  settings: AppSettings;
}

// Simple helper to check if hex color is dark
const isDarkColor = (color: string) => {
  const hex = color.replace('#', '');
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  return luma < 128;
};

export const VerseDisplay = React.memo(React.forwardRef<HTMLDivElement, VerseDisplayProps>(({ verse, settings }, ref) => {
  
  const [dynamicScale, setDynamicScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Reset scale when verse or font size settings change
  React.useLayoutEffect(() => {
    setDynamicScale(1);
  }, [verse.id, settings.verseFontSize]);

  React.useLayoutEffect(() => {
    if (!containerRef.current || !textContainerRef.current) return;
    if (dynamicScale !== 1) return; // Only measure when scale is 1
    
    // Allow a tiny delay for layout to settle if needed, but since we are in useLayoutEffect, it's immediate.
    // However, fonts might load or framer-motion might apply initial styles.
    const checkFit = () => {
      const containerH = containerRef.current!.clientHeight;
      const contentH = textContainerRef.current!.clientHeight;
      
      const padding = 60; // safe padding (reduced since it's now flex-1, meaning we have more space naturally)
      const availableH = containerH - padding;
      
      let scale = 1;
      if (contentH > availableH && availableH > 0) {
        // Since changing font-size changes both the height of lines and the wrapping width,
        // the total height scales roughly quadratically with font size.
        // Therefore, we use the square root of the ratio to find the correct scale.
        scale = Math.sqrt(availableH / contentH);
      }



      setDynamicScale(Math.max(0.35, scale));
    };
    
    // We delay the measurement slightly to allow initial animations to start
    const timer = setTimeout(checkFit, 50);
    return () => clearTimeout(timer);
  }, [verse.id, settings.verseFontSize, dynamicScale]);


  
  const bgType = settings.backgroundType || 'color';
  const bgColor = settings.backgroundColor || '#fafaf9';
  const bgImg = settings.backgroundImageUrl;
  
  const isImage = bgType === 'image' && Boolean(bgImg);
  const isDark = isImage || (bgType === 'color' && isDarkColor(bgColor));
  
  const textStyle = isDark ? "text-white text-outline-dark" : "text-[var(--color-duo-text)] text-outline-light";
  const subTextStyle = isDark ? "text-white/90 text-outline-dark" : "text-[var(--color-duo-text-light)] text-outline-light";
  const dividerStyle = isDark ? 'bg-white/30' : 'bg-[var(--color-duo-border)]';
  const dropShadow = isImage ? 'drop-shadow-lg' : '';

  return (
    <div 
      ref={ref}
      className="absolute inset-0 z-0 flex flex-col overflow-hidden transition-colors duration-500"
      style={{ 
        backgroundColor: bgType === 'color' ? bgColor : undefined,
        backgroundImage: isImage ? `url(${bgImg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {isImage && <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none" />}

      
      
      
      {!isImage && (
        <>
          
          
        </>
      )}
      
      {/* Verse Content */}
      <div 
        ref={containerRef}
        id="verse-display-capture"
        className="flex-1 relative flex items-center justify-center p-6 sm:p-12 z-10 pointer-events-none w-full max-w-4xl mx-auto mt-16 sm:mt-20 mb-32"
        style={{ '--dynamic-scale': dynamicScale } as React.CSSProperties}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div 
            ref={textContainerRef}
            key={verse.id}
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`text-center max-w-[100vw] sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-5xl xl:max-w-6xl px-4 md:px-8 w-full flex flex-col items-center pointer-events-auto ${dropShadow}`}
          >
            <span className={`text-[var(--color-duo-orange)] opacity-20 text-8xl md:text-9xl font-sans font-black leading-none h-12 md:h-16 select-none transition-colors`}>"</span>
            <h2 className={`text-3xl md:text-4xl lg:text-[44px] font-sans font-bold tracking-tight font-medium  ${textStyle} leading-snug  tracking-tight md:tracking-normal mb-8 transition-colors custom-verse-text verse-size-display`}>
              {verse.text}
            </h2>
            <div className={`h-0.5 w-12 md:w-20 ${dividerStyle} mb-8 transition-colors rounded-full`}></div>
            <p className={`text-sm md:text-base font-sans font-semibold ${subTextStyle} tracking-[0.25em] uppercase transition-colors flex items-center gap-3`}>
              {verse.reference}
              {!verse.id.startsWith('q') && (
                <span className="text-[11px] font-black uppercase tracking-wider bg-[var(--color-duo-bg)] text-[var(--color-duo-orange)] px-2 py-1 rounded-[12px] border-2 border-[var(--color-duo-border)] border-b-[4px] ml-2">{settings.bibleVersion || 'NVI'}</span>
              )}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}));
