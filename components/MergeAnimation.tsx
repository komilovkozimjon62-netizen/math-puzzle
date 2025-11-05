import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { GRID_SIZE } from '../constants';

interface MergeAnimationProps {
  row: number;
  col: number;
  onComplete: () => void;
}

// Total duration for the longest-lasting starburst animation sequence
const ANIMATION_DURATION = 800; // ms

// A single, self-animating starburst component
const StarBurst: React.FC<{ delay: number; sizeClass: string }> = ({ delay, sizeClass }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Timer to make the starburst appear after its delay
        const appearTimer = setTimeout(() => setIsVisible(true), delay);
        // Timer to make the starburst start exiting
        const exitTimer = setTimeout(() => setIsExiting(true), delay + 200);
        
        return () => {
            clearTimeout(appearTimer);
            clearTimeout(exitTimer);
        };
    }, [delay]);

    // Determine animation classes based on state
    const transitionClasses = !isVisible 
        ? 'opacity-0 scale-0' // Start hidden and small
        : isExiting 
        ? 'opacity-0 scale-150' // Exit by growing and fading out
        : 'opacity-100 scale-100'; // Visible state

    return (
        <div className={`absolute flex items-center justify-center transition-all duration-300 ease-out ${sizeClass} ${transitionClasses}`}>
            {/* The actual stars making up the burst */}
            <Star className="absolute text-yellow-400 rotate-0" fill="currentColor" size="100%" />
            <Star className="absolute text-yellow-300 rotate-12" fill="currentColor" size="80%" />
            <Star className="absolute text-orange-400 -rotate-12" fill="currentColor" size="70%" />
        </div>
    );
};


const MergeAnimation: React.FC<MergeAnimationProps> = ({ row, col, onComplete }) => {
    useEffect(() => {
        // Call the onComplete callback to remove this component from the parent's state
        // after the full animation sequence has had time to complete.
        const cleanupTimer = setTimeout(onComplete, ANIMATION_DURATION);

        return () => {
            clearTimeout(cleanupTimer);
        };
    }, [onComplete]);

    // Style to position the main animation container over the center of the target grid cell.
    const containerStyle: React.CSSProperties = {
        top: `calc(${row * (100 / GRID_SIZE)}% + ${100 / GRID_SIZE / 2}%)`,
        left: `calc(${col * (100 / GRID_SIZE)}% + ${100 / GRID_SIZE / 2}%)`,
        width: `${100 / GRID_SIZE}%`,
        height: `${100 / GRID_SIZE}%`,
        transform: 'translate(-50%, -50%)', // Center the element
        pointerEvents: 'none', // Prevent it from blocking clicks on the board
    };
    
    return (
        <div
            className={`absolute`}
            style={containerStyle}
            aria-hidden="true"
        >
            {/* Render three starbursts with different positions, sizes, and delays for a "firework" effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <StarBurst delay={0} sizeClass="w-8 h-8 md:w-12 md:h-12" />
            </div>
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2">
                <StarBurst delay={100} sizeClass="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div className="absolute top-1/3 left-3/4 -translate-x-1/2 -translate-y-1/2">
                <StarBurst delay={150} sizeClass="w-6 h-6 md:w-10 md:h-10" />
            </div>
        </div>
    );
};

export default MergeAnimation;
