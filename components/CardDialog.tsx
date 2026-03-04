"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CardData } from "./TaskCard";

const LABEL_COLORS = [
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#f472b6", // light pink
  "#a855f7", // purple
  "#8b5cf6", // violet
  "#06b6d4", // cyan
];

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCard: (card: Omit<CardData, "id" | "position">) => void;
}

export function AddCardDialog({ open, onOpenChange, onAddCard }: AddCardDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [labelColor, setLabelColor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddCard({
      title: title.trim(),
      description: description.trim() || undefined,
      deadline: deadline || undefined,
      labelColor: labelColor || undefined,
    });

    setTitle("");
    setDescription("");
    setDeadline("");
    setLabelColor("");
    onOpenChange(false);
  };

  const setDeadlineToday = () => {
    setDeadline(new Date().toISOString().split("T")[0]);
  };

  const setDeadlineTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeadline(tomorrow.toISOString().split("T")[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <div className="flex gap-2">
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={setDeadlineToday}>
                Today
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={setDeadlineTomorrow}>
                Tomorrow
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Label Color</Label>
            <div className="flex gap-2">
              {LABEL_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    labelColor === color ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setLabelColor(labelColor === color ? "" : color)}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add Card
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: CardData | null;
  onSaveCard: (card: CardData) => void;
  onDeleteCard: (cardId: string) => void;
}

export function EditCardDialog({
  open,
  onOpenChange,
  card,
  onSaveCard,
  onDeleteCard,
}: EditCardDialogProps) {
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const [deadline, setDeadline] = useState(card?.deadline || "");
  const [labelColor, setLabelColor] = useState(card?.labelColor || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !card) return;

    onSaveCard({
      ...card,
      title: title.trim(),
      description: description.trim() || undefined,
      deadline: deadline || undefined,
      labelColor: labelColor || undefined,
    });

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (card && confirm("Are you sure you want to delete this card?")) {
      onDeleteCard(card.id);
      onOpenChange(false);
    }
  };

  // Update local state when card changes
  if (card && title !== card.title && !open) {
    setTitle(card.title);
    setDescription(card.description || "");
    setDeadline(card.deadline || "");
    setLabelColor(card.labelColor || "");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-deadline">Deadline</Label>
            <Input
              id="edit-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Label Color</Label>
            <div className="flex gap-2">
              {LABEL_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    labelColor === color ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setLabelColor(labelColor === color ? "" : color)}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim()}>
                Save
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
