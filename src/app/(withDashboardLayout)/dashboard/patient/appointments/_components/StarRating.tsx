"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  className?: string;
  disabled?: boolean;
}

export function StarRating({
  value,
  onChange,
  size = 24,
  className = "",
  disabled = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent, starIndex: number) => {
    if (disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const starWidth = rect.width;
    const fraction = Math.max(0, Math.min(1, x / starWidth));
    const rating =
      starIndex + (starIndex === 4 ? Math.min(1, fraction * 1.1) : fraction);
    setHoverRating(Math.min(5, rating));
  };

  const handleClick = (event: React.MouseEvent, starIndex: number) => {
    if (disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const starWidth = rect.width;
    const fraction = Math.max(0, Math.min(1, x / starWidth));
    const rating =
      starIndex + (starIndex === 4 ? Math.min(1, fraction * 1.1) : fraction);
    onChange?.(Math.min(5, rating));
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const getStarFill = (starIndex: number) => {
    const currentRating = hoverRating || value;
    if (currentRating > starIndex + 1) return 1;
    if (currentRating <= starIndex) return 0;
    return currentRating - starIndex;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div
        ref={containerRef}
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {[0, 1, 2, 3, 4].map((starIndex) => {
          const fillPercentage = getStarFill(starIndex);

          return (
            <motion.div
              key={starIndex}
              className="relative cursor-pointer"
              whileHover={{ scale: disabled ? 1 : 1.1 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
              onMouseMove={(e) => handleMouseMove(e, starIndex)}
              onClick={(e) => handleClick(e, starIndex)}
            >
              {/* Gray background star */}
              <Star
                size={size}
                className={`text-gray-300 ${
                  disabled ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                fill="transparent"
              />

              {/* Yellow fill star */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: `${fillPercentage * 100}%`,
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                <Star
                  size={size}
                  className="text-yellow-400"
                  fill="currentColor"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
      <span className="ml-2 text-sm font-medium text-gray-600">
        {(hoverRating || value)?.toFixed(1)}
      </span>
    </div>
  );
}
