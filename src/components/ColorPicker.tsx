import { useState, useRef, useEffect } from "react";
import { MEMBER_COLORS } from "@/hooks/useMemberColors";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const ColorPicker = ({ selectedIndex, onSelect }: ColorPickerProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const color = MEMBER_COLORS[selectedIndex];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="w-4 h-4 rounded-full border-2 border-primary-foreground/40 hover:border-primary-foreground transition-colors"
        style={{ backgroundColor: `hsl(${color.bg})` }}
        title="Choose color"
      />
      {open && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-popover border border-border shadow-lg p-2 grid grid-cols-4 gap-1.5 min-w-[120px]">
          {MEMBER_COLORS.map((c, i) => (
            <button
              key={i}
              onClick={() => { onSelect(i); setOpen(false); }}
              className={cn(
                "w-6 h-6 rounded-full transition-transform hover:scale-110",
                i === selectedIndex && "ring-2 ring-foreground ring-offset-1 ring-offset-popover"
              )}
              style={{ backgroundColor: `hsl(${c.bg})` }}
              title={c.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
