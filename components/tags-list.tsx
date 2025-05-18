"use client"

import { useState } from "react"
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

  // Define tag colors based on the image
  const tagColors = {
    Food: "#3b5bdb", // Blue
    Entertainment: "#94d82d", // Lime green
    Books: "#38d9a9", // Teal
    Subscription: "#e03131", // Red
    Investment: "#cc5de8", // Purple
    Groceries: "#495057", // Gray
  }

  return (
    <div className="flex flex-col space-y-2 mt-4">
      {tags.map((tag) => (
        <div key={tag.id} className="flex items-center group relative">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: tag.color }}></div>
          <span className="text-sm">{tag.name}</span>
          <div className="absolute right-0 hidden group-hover:flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white"
              onClick={() => handleEditTag(tag)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-red-500"
              onClick={() => onDeleteTag(tag.id)}
            >
              <Trash2 className="h-3 w-3" />
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTag}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
