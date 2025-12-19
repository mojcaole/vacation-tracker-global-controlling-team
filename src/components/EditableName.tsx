import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditableNameProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
}

const EditableName = ({ value, onChange, className }: EditableNameProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed.length <= 50) {
      onChange(trimmed);
    } else {
      setEditValue(value);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        maxLength={50}
        className={cn(
          "bg-transparent border-b-2 border-primary-foreground/50 outline-none text-center w-full px-1",
          "focus:border-primary-foreground",
          className
        )}
      />
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={cn(
        "hover:bg-primary-foreground/10 px-2 py-1 transition-colors cursor-text w-full truncate",
        "focus:outline-none focus:bg-primary-foreground/10",
        className
      )}
      title="Click to edit"
    >
      {value}
    </button>
  );
};

export default EditableName;
