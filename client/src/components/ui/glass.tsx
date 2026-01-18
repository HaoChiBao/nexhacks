"use client";

import './glass.css';
import { useEffect, useRef } from 'react';

interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Glass = ({ children, className = '', ...props }: GlassProps) => {
    const glassRef = useRef<HTMLDivElement>(null);
    const mouseLightRef = useRef<HTMLDivElement>(null);
    
    useEffect(()=>{
        const handleMouseMove = (e: MouseEvent) => {
            const glass = glassRef.current;
            const mouseLight = mouseLightRef.current;
            if (!glass || !mouseLight) return;

            const rect = glass.getBoundingClientRect();
            // Use clientX/clientY relative to the glassDiv
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set left/top in px, let CSS transform center the light
            mouseLight.style.left = `${x}px`;
            mouseLight.style.top = `${y}px`;
        };

        const handleMouseOver = () => {
            const mouseLight = mouseLightRef.current;
            if (mouseLight) mouseLight.classList.add('active');
        }
        
        const handleMouseOut = () => {
            const mouseLight = mouseLightRef.current;
            if (mouseLight) mouseLight.classList.remove('active');
        }

        const handleMouseDown = (e: MouseEvent) => {
            const mouseLight = mouseLightRef.current;
            if (mouseLight) {
                mouseLight.classList.add('clicked');
                handleMouseMove(e); // Ensure light follows on mousedown
            }
        }

        const handleMouseUp = () => {
            const mouseLight = mouseLightRef.current;
            if (mouseLight) {
                mouseLight.classList.remove('clicked');
            }
        }

        const glassElement = glassRef.current;
        if (glassElement) {
            glassElement.addEventListener('mousemove', handleMouseMove);
            glassElement.addEventListener('mouseover', handleMouseOver);
            glassElement.addEventListener('mouseout', handleMouseOut);
            glassElement.addEventListener('mousedown', handleMouseDown);
            glassElement.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            if (glassElement) {
                glassElement.removeEventListener('mousemove', handleMouseMove);
                glassElement.removeEventListener('mouseover', handleMouseOver);
                glassElement.removeEventListener('mouseout', handleMouseOut);
                glassElement.removeEventListener('mousedown', handleMouseDown);
                glassElement.removeEventListener('mouseup', handleMouseUp);
            }
        };
    },[])
    return (
        <div className="glass-container relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: "absolute", overflow: "hidden" }}>
                <defs>
                    <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
                        <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
                        <feDisplacementMap in="SourceGraphic" in2="blurred" scale="150" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>
            <div ref={glassRef} className={`glassDiv ${className}`} {...props}>
                <div className="glass-rays"></div>
                {children}
                <div ref={mouseLightRef} className='mouse-light'></div>
            </div>
        </div>
    )
};

export default Glass;
