'use client';

import { useRef, useState, useEffect, MouseEvent as ReactMouseEvent } from 'react';

type Tool = 'select' | 'pen' | 'rectangle' | 'ellipse' | 'arrow' | 'line' | 'text' | 'eraser';

interface Shape {
    id: string;
    type: 'rectangle' | 'ellipse' | 'arrow' | 'line' | 'text' | 'freehand';
    x: number;
    y: number;
    width?: number;
    height?: number;
    endX?: number;
    endY?: number;
    points?: { x: number; y: number }[];
    text?: string;
    color: string;
    strokeWidth: number;
    selected?: boolean;
}

interface DiagramWhiteboardProps {
    onSave?: (data: string) => void;
    initialData?: string;
}

export default function DiagramWhiteboard({ onSave, initialData }: DiagramWhiteboardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [tool, setTool] = useState<Tool>('pen');
    const [color, setColor] = useState('#6366f1');
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentShape, setCurrentShape] = useState<Shape | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [textInput, setTextInput] = useState('');
    const [textPos, setTextPos] = useState<{ x: number; y: number } | null>(null);
    const [history, setHistory] = useState<Shape[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const container = containerRef.current;
            if (container) {
                canvas.width = container.offsetWidth;
                canvas.height = container.offsetHeight;
                redraw();
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    // Load initial data
    useEffect(() => {
        if (initialData) {
            try {
                const parsed = JSON.parse(initialData);
                if (Array.isArray(parsed)) {
                    setShapes(parsed);
                    setHistory([parsed]);
                }
            } catch (e) {
                // Not JSON, might be old image data
            }
        }
    }, [initialData]);

    // Redraw on shapes change
    useEffect(() => {
        redraw();
    }, [shapes, currentShape, selectedId]);

    const redraw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Clear with dark background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#2a2a4a';
        ctx.lineWidth = 0.5;
        const gridSize = 20;
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw all shapes
        [...shapes, currentShape].filter(Boolean).forEach((shape) => {
            if (!shape) return;
            drawShape(ctx, shape, shape.id === selectedId);
        });
    };

    const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape, isSelected: boolean) => {
        ctx.strokeStyle = shape.color;
        ctx.fillStyle = shape.color + '20';
        ctx.lineWidth = shape.strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (shape.type) {
            case 'rectangle':
                if (shape.width && shape.height) {
                    ctx.beginPath();
                    ctx.rect(shape.x, shape.y, shape.width, shape.height);
                    ctx.fill();
                    ctx.stroke();
                }
                break;

            case 'ellipse':
                if (shape.width && shape.height) {
                    ctx.beginPath();
                    ctx.ellipse(
                        shape.x + shape.width / 2,
                        shape.y + shape.height / 2,
                        Math.abs(shape.width / 2),
                        Math.abs(shape.height / 2),
                        0, 0, Math.PI * 2
                    );
                    ctx.fill();
                    ctx.stroke();
                }
                break;

            case 'line':
                if (shape.endX !== undefined && shape.endY !== undefined) {
                    ctx.beginPath();
                    ctx.moveTo(shape.x, shape.y);
                    ctx.lineTo(shape.endX, shape.endY);
                    ctx.stroke();
                }
                break;

            case 'arrow':
                if (shape.endX !== undefined && shape.endY !== undefined) {
                    ctx.beginPath();
                    ctx.moveTo(shape.x, shape.y);
                    ctx.lineTo(shape.endX, shape.endY);
                    ctx.stroke();

                    // Draw arrowhead
                    const angle = Math.atan2(shape.endY - shape.y, shape.endX - shape.x);
                    const headLength = 15;
                    ctx.beginPath();
                    ctx.moveTo(shape.endX, shape.endY);
                    ctx.lineTo(
                        shape.endX - headLength * Math.cos(angle - Math.PI / 6),
                        shape.endY - headLength * Math.sin(angle - Math.PI / 6)
                    );
                    ctx.moveTo(shape.endX, shape.endY);
                    ctx.lineTo(
                        shape.endX - headLength * Math.cos(angle + Math.PI / 6),
                        shape.endY - headLength * Math.sin(angle + Math.PI / 6)
                    );
                    ctx.stroke();
                }
                break;

            case 'freehand':
                if (shape.points && shape.points.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    shape.points.forEach((p) => ctx.lineTo(p.x, p.y));
                    ctx.stroke();
                }
                break;

            case 'text':
                if (shape.text) {
                    ctx.font = `${16 * shape.strokeWidth}px Inter, sans-serif`;
                    ctx.fillStyle = shape.color;
                    ctx.fillText(shape.text, shape.x, shape.y);
                }
                break;
        }

        // Selection highlight
        if (isSelected) {
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);

            let bounds = getShapeBounds(shape);
            if (bounds) {
                ctx.strokeRect(bounds.x - 5, bounds.y - 5, bounds.width + 10, bounds.height + 10);
            }
            ctx.setLineDash([]);
        }
    };

    const getShapeBounds = (shape: Shape) => {
        switch (shape.type) {
            case 'rectangle':
            case 'ellipse':
                return { x: shape.x, y: shape.y, width: shape.width || 0, height: shape.height || 0 };
            case 'line':
            case 'arrow':
                const minX = Math.min(shape.x, shape.endX || shape.x);
                const minY = Math.min(shape.y, shape.endY || shape.y);
                const maxX = Math.max(shape.x, shape.endX || shape.x);
                const maxY = Math.max(shape.y, shape.endY || shape.y);
                return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
            case 'text':
                return { x: shape.x, y: shape.y - 20, width: (shape.text?.length || 0) * 10, height: 25 };
            case 'freehand':
                if (shape.points) {
                    const xs = shape.points.map(p => p.x);
                    const ys = shape.points.map(p => p.y);
                    return {
                        x: Math.min(...xs),
                        y: Math.min(...ys),
                        width: Math.max(...xs) - Math.min(...xs),
                        height: Math.max(...ys) - Math.min(...ys),
                    };
                }
                return null;
            default:
                return null;
        }
    };

    const getCoords = (e: ReactMouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseDown = (e: ReactMouseEvent<HTMLCanvasElement>) => {
        const pos = getCoords(e);
        setStartPos(pos);
        setIsDrawing(true);

        if (tool === 'select') {
            // Find shape under cursor
            const clicked = [...shapes].reverse().find((s) => {
                const bounds = getShapeBounds(s);
                if (!bounds) return false;
                return pos.x >= bounds.x && pos.x <= bounds.x + bounds.width &&
                    pos.y >= bounds.y && pos.y <= bounds.y + bounds.height;
            });
            setSelectedId(clicked?.id || null);
            return;
        }

        if (tool === 'text') {
            setTextPos(pos);
            setTextInput('');
            return;
        }

        if (tool === 'eraser') {
            // Find and remove shape under cursor
            const toDelete = [...shapes].reverse().find((s) => {
                const bounds = getShapeBounds(s);
                if (!bounds) return false;
                return pos.x >= bounds.x - 10 && pos.x <= bounds.x + bounds.width + 10 &&
                    pos.y >= bounds.y - 10 && pos.y <= bounds.y + bounds.height + 10;
            });
            if (toDelete) {
                const newShapes = shapes.filter(s => s.id !== toDelete.id);
                setShapes(newShapes);
                saveToHistory(newShapes);
            }
            return;
        }

        const newShape: Shape = {
            id: `shape-${Date.now()}`,
            type: tool === 'pen' ? 'freehand' : tool as Shape['type'],
            x: pos.x,
            y: pos.y,
            color,
            strokeWidth,
            points: tool === 'pen' ? [pos] : undefined,
        };
        setCurrentShape(newShape);
    };

    const handleMouseMove = (e: ReactMouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !currentShape) return;
        const pos = getCoords(e);

        if (currentShape.type === 'freehand') {
            setCurrentShape({
                ...currentShape,
                points: [...(currentShape.points || []), pos],
            });
        } else if (['rectangle', 'ellipse'].includes(currentShape.type)) {
            setCurrentShape({
                ...currentShape,
                width: pos.x - startPos.x,
                height: pos.y - startPos.y,
            });
        } else if (['line', 'arrow'].includes(currentShape.type)) {
            setCurrentShape({
                ...currentShape,
                endX: pos.x,
                endY: pos.y,
            });
        }
    };

    const handleMouseUp = () => {
        if (currentShape) {
            const newShapes = [...shapes, currentShape];
            setShapes(newShapes);
            saveToHistory(newShapes);
            setCurrentShape(null);
        }
        setIsDrawing(false);
    };

    const saveToHistory = (newShapes: Shape[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newShapes);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        if (onSave) {
            onSave(JSON.stringify(newShapes));
        }
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setShapes(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setShapes(history[historyIndex + 1]);
        }
    };

    const clearAll = () => {
        setShapes([]);
        setSelectedId(null);
        saveToHistory([]);
    };

    const deleteSelected = () => {
        if (selectedId) {
            const newShapes = shapes.filter(s => s.id !== selectedId);
            setShapes(newShapes);
            setSelectedId(null);
            saveToHistory(newShapes);
        }
    };

    const addTextShape = () => {
        if (textPos && textInput.trim()) {
            const newShape: Shape = {
                id: `text-${Date.now()}`,
                type: 'text',
                x: textPos.x,
                y: textPos.y,
                text: textInput,
                color,
                strokeWidth: 1,
            };
            const newShapes = [...shapes, newShape];
            setShapes(newShapes);
            saveToHistory(newShapes);
        }
        setTextPos(null);
        setTextInput('');
    };

    const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#ffffff'];

    const tools: { id: Tool; icon: string; label: string }[] = [
        { id: 'select', icon: '🔲', label: 'Select' },
        { id: 'pen', icon: '✏️', label: 'Pen' },
        { id: 'rectangle', icon: '⬜', label: 'Rectangle' },
        { id: 'ellipse', icon: '⚪', label: 'Ellipse' },
        { id: 'arrow', icon: '➡️', label: 'Arrow' },
        { id: 'line', icon: '📏', label: 'Line' },
        { id: 'text', icon: '🔤', label: 'Text' },
        { id: 'eraser', icon: '🧹', label: 'Eraser' },
    ];

    return (
        <div className="flex flex-col h-full gap-2">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-base-300 rounded-lg">
                {/* Tools */}
                <div className="flex gap-1 border-r border-base-content/20 pr-2">
                    {tools.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTool(t.id)}
                            className={`btn btn-sm btn-square ${tool === t.id ? 'btn-primary' : 'btn-ghost'}`}
                            title={t.label}
                        >
                            {t.icon}
                        </button>
                    ))}
                </div>

                {/* Colors */}
                <div className="flex gap-1 border-r border-base-content/20 pr-2">
                    {colors.map((c) => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className={`w-6 h-6 rounded border-2 transition-transform ${color === c ? 'border-white scale-110' : 'border-transparent'
                                }`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>

                {/* Stroke Width */}
                <div className="flex items-center gap-2 border-r border-base-content/20 pr-2">
                    <span className="text-xs opacity-60">Size:</span>
                    <input
                        type="range"
                        min="1"
                        max="8"
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(Number(e.target.value))}
                        className="range range-xs range-primary w-16"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-1 ml-auto">
                    <button onClick={undo} disabled={historyIndex === 0} className="btn btn-ghost btn-sm" title="Undo">
                        ↩️
                    </button>
                    <button onClick={redo} disabled={historyIndex >= history.length - 1} className="btn btn-ghost btn-sm" title="Redo">
                        ↪️
                    </button>
                    {selectedId && (
                        <button onClick={deleteSelected} className="btn btn-ghost btn-sm text-error" title="Delete">
                            🗑️
                        </button>
                    )}
                    <button onClick={clearAll} className="btn btn-ghost btn-sm" title="Clear">
                        Clear
                    </button>
                </div>
            </div>

            {/* Canvas Container */}
            <div ref={containerRef} className="flex-1 relative rounded-lg overflow-hidden border border-base-300">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="cursor-crosshair"
                    style={{ display: 'block' }}
                />

                {/* Text Input Modal */}
                {textPos && (
                    <div
                        className="absolute bg-base-200 rounded-lg p-2 shadow-xl flex gap-2"
                        style={{ left: textPos.x, top: textPos.y }}
                    >
                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTextShape()}
                            placeholder="Type text..."
                            className="input input-sm input-bordered w-40"
                            autoFocus
                        />
                        <button onClick={addTextShape} className="btn btn-sm btn-primary">Add</button>
                        <button onClick={() => setTextPos(null)} className="btn btn-sm btn-ghost">✕</button>
                    </div>
                )}
            </div>

            <p className="text-xs text-center text-base-content/50">
                Draw shapes, arrows, and diagrams to illustrate technical concepts
            </p>
        </div>
    );
}
