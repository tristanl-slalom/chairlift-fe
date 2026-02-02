import { useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface IconPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  label?: string;
}

export default function IconPicker({ value, onChange, label }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(emojiData.emoji);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      {/* Emoji display button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="emoji-picker"
        className="w-full px-4 py-3 text-2xl text-center border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-white"
        aria-label="Open emoji picker"
      >
        {value || '➕'}
      </button>

      {/* Emoji picker popover */}
      {isOpen && (
        <div className="relative">
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute z-20 mt-2">
            <EmojiPicker onEmojiClick={handleEmojiClick} width={350} height={400} />
          </div>
        </div>
      )}
    </div>
  );
}
