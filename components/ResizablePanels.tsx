'use client';

import { useState, useRef, MouseEvent, ReactNode } from 'react';

interface ResizablePanelsProps {
    left: ReactNode;
    right: ReactNode;
    defaultLeftWidth?: number;
    minLeftWidth?: number;
    minRightWidth?: number;
}

export default function ResizablePanels({
    left,
    right,
    defaultLeftWidth = 50,
    minLeftWidth = 20,
    minRightWidth = 20,
}: ResizablePanelsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;

        if (newLeftWidth >= minLeftWidth && newLeftWidth <= 100 - minRightWidth) {
            setLeftWidth(newLeftWidth);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            ref={containerRef}
            className="flex h-full w-full"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Left Panel */}
            <div
                className="overflow-hidden flex flex-col"
                style={{ width: `${leftWidth}%` }}
            >
                {left}
            </div>

            {/* Resize Handle */}
            <div
                className={`w-1 bg-base-300 hover:bg-primary cursor-col-resize flex-shrink-0 transition-colors ${isDragging ? 'bg-primary' : ''
                    }`}
                onMouseDown={handleMouseDown}
            >
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-0.5 h-8 bg-base-content/20 rounded" />
                </div>
            </div>

            {/* Right Panel */}
            <div
                className="overflow-hidden flex flex-col flex-1"
            >
                {right}
            </div>
        </div>
    );
}
