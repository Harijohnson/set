"use client"

import { useState, useRef, useEffect } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Tag } from "./expense-manager"

interface TagsListProps {
  tags: Tag[]
  onUpdateTag: (tag: Tag) => void
  onDeleteTag: (id: string) => void
}

export function TagsList({ tags, onUpdateTag, onDeleteTag }: TagsListProps) {
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("")
  const [activeTagId, setActiveTagId] = useState<string | null>(null)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (tagId: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveTagId(tagId);
  };

  const handleMouseLeave = () => {
    // Only hide if buttons aren't being hovered
    if (!isButtonHovered) {
      timeoutRef.current = setTimeout(() => {
        setActiveTagId(null);
      }, 500);
    }
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag)
    setNewTagName(tag.name)
    setNewTagColor(tag.color)
    setIsEditDialogOpen(true)
  }

  const handleUpdateTag = () => {
    if (editingTag && newTagName.trim()) {
      onUpdateTag({
        ...editingTag,
        name: newTagName.trim(),
        color: newTagColor,
      })
      setIsEditDialogOpen(false)
      setEditingTag(null)
    }
  }


  return (
    <div className="flex flex-col space-y-2 mt-2">
      {tags.map((tag) => (
        <div 
          key={tag.id} 
          className="flex items-center justify-between w-full py-1 px-3 rounded-md hover:bg-zinc-300 transition-colors cursor-pointer"
          onMouseEnter={() => handleMouseEnter(tag.id)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center flex-grow">
            <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: tag.color }}></div>
            <span className="text-sm">{tag.name}</span>
          </div>
          <div 
            className={`flex space-x-1 transition-opacity duration-300 ${
              activeTagId === tag.id ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-zinc-500"
              onClick={(e) => {
                e.stopPropagation();
                handleEditTag(tag);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-zinc-500"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTag(tag.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription className="text-gray-400">Change the name or color of this category.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="col-span-3 bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="color" className="text-right">
                Color
              </label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-12 h-10 p-1 bg-zinc-800 border-zinc-700"
                />
                <Input
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="flex-1 bg-zinc-800 border-zinc-700"
                  placeholder="#RRGGBB"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-zinc-700">
              Cancel
            </Button>
            <Button onClick={handleUpdateTag}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}