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
import { Label } from "@/components/ui/label";
import { ColumnData } from "./KanbanColumn";

const COLUMN_COLORS = [
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#f472b6", // light pink
  "#a855f7", // purple
  "#8b5cf6", // violet
  "#c084fc", // light purple
  "#06b6d4", // cyan
  "#f0abfc", // light fuchsia
];

interface AddColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddColumn: (column: { name: string; color: string }) => void;
}

export function AddColumnDialog({ open, onOpenChange, onAddColumn }: AddColumnDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLUMN_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddColumn({
      name: name.trim(),
      color,
    });

    setName("");
    setColor(COLUMN_COLORS[0]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="column-name">Column Name *</Label>
            <Input
              id="column-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter column name (e.g., Review)"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Column Color</Label>
            <div className="flex gap-2 flex-wrap">
              {COLUMN_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === c ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Add Column
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  column: ColumnData | null;
  onSaveColumn: (column: ColumnData) => void;
  onDeleteColumn: (columnId: string) => void;
}

export function EditColumnDialog({
  open,
  onOpenChange,
  column,
  onSaveColumn,
  onDeleteColumn,
}: EditColumnDialogProps) {
  const [name, setName] = useState(column?.name || "");
  const [color, setColor] = useState(column?.color || COLUMN_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !column) return;

    onSaveColumn({
      ...column,
      name: name.trim(),
      color,
    });

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (column && confirm(`Are you sure you want to delete "${column.name}" and all its cards?`)) {
      onDeleteColumn(column.id);
      onOpenChange(false);
    }
  };

  // Update local state when column changes
  if (column && name !== column.name && !open) {
    setName(column.name);
    setColor(column.color);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-column-name">Column Name *</Label>
            <Input
              id="edit-column-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter column name"
            />
          </div>

          <div className="space-y-2">
            <Label>Column Color</Label>
            <div className="flex gap-2 flex-wrap">
              {COLUMN_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === c ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete Column
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim()}>
                Save
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
