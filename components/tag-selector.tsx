"use client"

import { useState } from "react"
import { Check, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Tag } from "./expense-manager"
import { cn } from "@/lib/utils"

interface TagSelectorProps {
  tags: Tag[]
  selectedTagId: string
  onSelectTag: (tagId: string) => void
  onAddTag: (tag: Omit<Tag, "id">) => Tag
}

export function TagSelector({ tags, selectedTagId, onSelectTag, onAddTag }: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [isAddTagDialogOpen, setIsAddTagDialogOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#3b5bdb")

  const selectedTag = tags.find((tag) => tag.id === selectedTagId)

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const newTag = onAddTag({
        name: newTagName.trim(),
        color: newTagColor,
      })
      onSelectTag(newTag.id)
      setNewTagName("")
      setIsAddTagDialogOpen(false)
    }
  }

  // Define tag colors based on the image
  const colors = [
    "#3b5bdb", // Blue (Food)
    "#94d82d", // Lime green (Entertainment)
    "#38d9a9", // Teal (Books)
    "#e03131", // Red (Subscription)
    "#cc5de8", // Purple (Investment)
    "#495057", // Gray (Groceries)
  ]

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-zinc-800 border-zinc-700"
          >
            {selectedTag ? (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: selectedTag.color }} />
                {selectedTag.name}
              </div>
            ) : (
              "Select a category"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 bg-zinc-800 border-zinc-700">
          <Command className="bg-zinc-800">
            <CommandInput placeholder="Search category..." className="border-zinc-700" />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => {
                      onSelectTag(tag.id)
                      setOpen(false)
                    }}
                    className="text-white hover:bg-zinc-700"
                  >
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                    <Check className={cn("ml-auto h-4 w-4", selectedTagId === tag.id ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator className="bg-zinc-700" />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setIsAddTagDialogOpen(true)
                    setOpen(false)
                  }}
                  className="text-white hover:bg-zinc-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Category
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={isAddTagDialogOpen} onOpenChange={setIsAddTagDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a new category to organize your expenses.
            </DialogDescription>
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
              <label className="text-right">Color</label>
              <div className="flex flex-wrap gap-2 col-span-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full ${
                      newTagColor === color ? "ring-2 ring-offset-2 ring-white ring-offset-zinc-900" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewTagColor(color)}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="colorHex" className="text-right">
                Hex
              </label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="colorHex"
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-12 h-10 p-1 bg-zinc-800 border-zinc-700"
                />
                <Input
                  value={newTagColor}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.startsWith("#") && value.length <= 7) {
                      setNewTagColor(value)
                    } else if (value === "") {
                      setNewTagColor("#")
                    }
                  }}
                  placeholder="#RRGGBB"
                  className="flex-1 bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddTag}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
