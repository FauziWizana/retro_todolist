"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  labelColor?: string;
  position: number;
}

interface TaskCardProps {
  card: CardData;
  onEdit?: () => void;
}

export function TaskCard({ card, onEdit }: TaskCardProps) {
  return (
    <Card
      className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-all bg-card hover:scale-[1.02]"
      onClick={onEdit}
    >
      <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold line-clamp-2 text-card-foreground">
            {card.title}
          </CardTitle>
          {card.labelColor && (
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 border-2 border-white shadow-sm"
              style={{ backgroundColor: card.labelColor }}
            />
          )}
        </div>
      </CardHeader>
      {(card.description || card.deadline) && (
        <CardContent className="p-4 pt-0">
          {card.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {card.description}
            </p>
          )}
          {card.deadline && (
            <p className="text-xs text-primary font-semibold mt-2">
              📅 Due: {new Date(card.deadline).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

interface SortableTaskCardProps {
  card: CardData;
  onEdit?: () => void;
}

export function SortableTaskCard({ card, onEdit }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={`cursor-grab active:cursor-grabbing hover:shadow-lg transition-all bg-card hover:scale-[1.02] ${
          isDragging ? "shadow-xl ring-2 ring-primary" : ""
        }`}
        onClick={onEdit}
      >
        <CardHeader className="p-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-semibold line-clamp-2 text-card-foreground">
              {card.title}
            </CardTitle>
            {card.labelColor && (
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 border-2 border-white shadow-sm"
                style={{ backgroundColor: card.labelColor }}
              />
            )}
          </div>
        </CardHeader>
        {(card.description || card.deadline) && (
          <CardContent className="p-4 pt-0">
            {card.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {card.description}
              </p>
            )}
            {card.deadline && (
              <p className="text-xs text-primary font-semibold mt-2">
                📅 Due: {new Date(card.deadline).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
