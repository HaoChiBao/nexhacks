"use client";

import { useState } from "react";
import { Save, Layout, RotateCcw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SavedView, getSavedViews, saveView, setActiveView, getActiveViewId } from "@/lib/storage/portfolioPrefs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface SavedViewsMenuProps {
  onRestore: (view: SavedView) => void;
}

export function SavedViewsMenu({ onRestore }: SavedViewsMenuProps) {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const views = getSavedViews();

  const handleSave = () => {
    if (!name) return;
    const newView: SavedView = {
      id: Date.now().toString(),
      name,
      createdAt: Date.now(),
      viewport: { panX: 0, panY: 0, zoom: 1 }, // In real app, pass this in as prop or context
      nodePositions: {}, // Mock
      edgeToggles: { correlation: true, catalyst: true, hedge: false, parlay: false } // Mock
    };
    saveView(newView);
    setIsOpen(false);
    setName("");
  };

  const handleRestore = (view: SavedView) => {
    setActiveView(view.id);
    onRestore(view);
  };

  return (
    <div className="flex items-center gap-2">
       <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2 bg-gray-900 border-gray-700 text-gray-300">
               <Layout className="w-3 h-3" />
               Views
               <ChevronDown className="w-3 h-3 opacity-50" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="bg-surface-dark border-border-dark text-white">
            {views.length === 0 && <div className="p-2 text-xs text-gray-500">No saved views</div>}
            {views.map(view => (
                <DropdownMenuItem key={view.id} onClick={() => handleRestore(view)} className="cursor-pointer hover:bg-white/10">
                    {view.name}
                </DropdownMenuItem>
            ))}
         </DropdownMenuContent>
       </DropdownMenu>

       <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
             <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                <Save className="w-4 h-4" />
             </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 bg-surface-dark border-border-dark p-3">
             <div className="space-y-2">
                 <h4 className="font-medium text-white text-xs">Save Current View</h4>
                 <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="View Name..." 
                    className="h-8 text-xs bg-gray-900 border-gray-700"
                 />
                 <Button onClick={handleSave} size="sm" className="w-full h-7 text-xs">Save</Button>
             </div>
          </PopoverContent>
       </Popover>
       
       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white" title="Reset View">
          <RotateCcw className="w-3 h-3" />
       </Button>
    </div>
  );
}
