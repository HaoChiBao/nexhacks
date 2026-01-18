import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryNavProps) {
  return (
    <div className="w-full relative group">
      {/* Fade effects for indicating scrolling - optional polish */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background-dark to-transparent z-10 pointer-events-none md:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background-dark to-transparent z-10 pointer-events-none md:hidden" />

      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide px-1 -mx-1 mask-linear">
        {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={cn(
                    "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200",
                    isSelected
                        ? "bg-primary text-black shadow-lg shadow-primary/25 scale-105"
                        : "bg-surface-dark border border-border-dark text-gray-400 hover:text-white hover:border-gray-600 hover:bg-gray-800"
                    )}
                >
                    {category}
                </button>
            );
        })}
      </div>
    </div>
  );
}
