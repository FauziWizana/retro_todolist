"use client";

import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SortableTaskCard, CardData } from "./TaskCard";
import { Plus, MoreHorizontal, GripVertical } from "lucide-react";

export interface ColumnData {
  id: string;
  name: string;
  color: string;
  position: number;
  cards: CardData[];
}

interface KanbanColumnProps {
  column: ColumnData;
  onAddCard?: () => void;
  onEditColumn?: () => void;
  onCardClick?: (cardId: string) => void;
}

export function KanbanColumn({ column, onAddCard, onEditColumn, onCardClick }: KanbanColumnProps) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex-shrink-0 w-80 self-start">
      <Card className={`flex flex-col bg-card ${isOver ? "ring-2 ring-ring" : ""}`}>
        <CardHeader
          className="p-4 rounded-t-lg"
          style={{
            borderTop: `4px solid ${column.color}`,
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base text-card-foreground font-bold">{column.name}</CardTitle>
              <span className="text-sm text-muted-foreground font-semibold bg-accent px-2 py-0.5 rounded-full">
                {column.cards.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onEditColumn}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent
          ref={setDroppableRef}
          className="p-4 space-y-3 min-h-[100px] bg-muted/30 rounded-b-lg"
        >
          <SortableContext
            items={column.cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {column.cards.map((card) => (
              <SortableTaskCard
                key={card.id}
                card={card}
                onEdit={() => onCardClick?.(card.id)}
              />
            ))}
          </SortableContext>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onAddCard}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface SortableColumnProps {
  column: ColumnData;
  onAddCard?: () => void;
  onEditColumn?: () => void;
  onCardClick?: (cardId: string) => void;
}

export function SortableColumn({ column, onAddCard, onEditColumn, onCardClick }: SortableColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `droppable-${column.id}`,
    data: { columnId: column.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex-shrink-0 w-80 self-start">
      <Card className={`flex flex-col bg-card ${isOver ? "ring-2 ring-ring" : ""} ${isDragging ? "shadow-xl" : ""}`}>
        <CardHeader
          className="p-4 rounded-t-lg cursor-grab active:cursor-grabbing"
          style={{
            borderTop: `4px solid ${column.color}`,
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
          {...attributes}
          {...listeners}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base text-card-foreground font-bold">{column.name}</CardTitle>
              <span className="text-sm text-muted-foreground font-semibold bg-accent px-2 py-0.5 rounded-full">
                {column.cards.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onEditColumn?.();
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent
          ref={setDroppableRef}
          className="p-4 space-y-3 min-h-[100px] bg-muted/30 rounded-b-lg"
        >
          <SortableContext
            items={column.cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {column.cards.map((card) => (
              <SortableTaskCard
                key={card.id}
                card={card}
                onEdit={() => onCardClick?.(card.id)}
              />
            ))}
          </SortableContext>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onAddCard}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
