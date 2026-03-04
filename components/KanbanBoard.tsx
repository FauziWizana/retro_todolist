"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { 
  arrayMove, 
  sortableKeyboardCoordinates,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableColumn, ColumnData, KanbanColumn } from "./KanbanColumn";
import { TaskCard, CardData } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { AddCardDialog, EditCardDialog } from "./CardDialog";
import { AddColumnDialog, EditColumnDialog } from "./ColumnDialog";

type DragType = "card" | "column" | null;

export function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnData | null>(null);
  const [dragType, setDragType] = useState<DragType>(null);

  // Dialog states
  const [addCardDialogOpen, setAddCardDialogOpen] = useState(false);
  const [editCardDialogOpen, setEditCardDialogOpen] = useState(false);
  const [addColumnDialogOpen, setAddColumnDialogOpen] = useState(false);
  const [editColumnDialogOpen, setEditColumnDialogOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<ColumnData | null>(null);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      const [columnsRes, cardsRes] = await Promise.all([
        fetch("/api/columns"),
        fetch("/api/cards"),
      ]);

      if (!columnsRes.ok || !cardsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const columnsData = await columnsRes.json();
      const cardsData = await cardsRes.json();

      // Group cards by column
      const columnsWithCards: ColumnData[] = columnsData.map((col: { id: string; name: string; color: string; position: number }) => ({
        ...col,
        cards: cardsData
          .filter((card: { columnId: string }) => card.columnId === col.id)
          .sort((a: { position: number }, b: { position: number }) => a.position - b.position),
      }));

      setColumns(columnsWithCards.sort((a: ColumnData, b: ColumnData) => a.position - b.position));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumnByCardId = (cardId: string): ColumnData | undefined => {
    return columns.find((col) => col.cards.some((card) => card.id === cardId));
  };

  const findCardById = (cardId: string): CardData | undefined => {
    for (const col of columns) {
      const card = col.cards.find((c) => c.id === cardId);
      if (card) return card;
    }
    return undefined;
  };

  const isColumnId = (id: string): boolean => {
    return columns.some((col) => col.id === id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;

    // Check if dragging a column
    if (isColumnId(activeId)) {
      const column = columns.find((col) => col.id === activeId);
      if (column) {
        setActiveColumn(column);
        setDragType("column");
      }
    } else {
      // Dragging a card
      const card = findCardById(activeId);
      if (card) {
        setActiveCard(card);
        setDragType("card");
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || dragType !== "card") return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle droppable area (for empty columns)
    const overIdClean = overId.startsWith("droppable-") ? overId.replace("droppable-", "") : overId;

    const activeColumn = findColumnByCardId(activeId);
    const overColumn = findColumnByCardId(overId) || columns.find((col) => col.id === overIdClean);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

    setColumns((prev) => {
      const activeCards = [...activeColumn.cards];
      const overCards = [...overColumn.cards];

      const activeCardIndex = activeCards.findIndex((c) => c.id === activeId);
      const [movedCard] = activeCards.splice(activeCardIndex, 1);

      const overCardIndex = overCards.findIndex((c) => c.id === overId);
      if (overCardIndex >= 0) {
        overCards.splice(overCardIndex, 0, movedCard);
      } else {
        overCards.push(movedCard);
      }

      return prev.map((col) => {
        if (col.id === activeColumn.id) {
          return { ...col, cards: activeCards };
        }
        if (col.id === overColumn.id) {
          return { ...col, cards: overCards };
        }
        return col;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveCard(null);
    setActiveColumn(null);
    const currentDragType = dragType;
    setDragType(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Handle column reordering
    if (currentDragType === "column") {
      const activeIndex = columns.findIndex((col) => col.id === activeId);
      const overIndex = columns.findIndex((col) => col.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newColumns = arrayMove(columns, activeIndex, overIndex);
        setColumns(newColumns);
        // Save column positions to backend
        Promise.all(
          newColumns.map((col, index) =>
            fetch(`/api/columns/${col.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ position: index }),
            })
          )
        );
      }
      return;
    }

    // Handle card reordering - find where the card ended up
    const cardColumn = findColumnByCardId(activeId);
    if (!cardColumn) return;

    // Save all card positions in the column(s) that were affected
    Promise.all(
      cardColumn.cards.map((card, index) =>
        fetch(`/api/cards/${card.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            columnId: cardColumn.id,
            position: index 
          }),
        })
      )
    );
  };

  // Card handlers
  const handleAddCard = (columnId: string) => {
    setSelectedColumnId(columnId);
    setAddCardDialogOpen(true);
  };

  const handleCreateCard = async (cardData: Omit<CardData, "id" | "position">) => {
    if (!selectedColumnId) return;

    try {
      const position = columns.find((c) => c.id === selectedColumnId)?.cards.length || 0;
      
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cardData,
          columnId: selectedColumnId,
          position,
        }),
      });

      if (!res.ok) throw new Error("Failed to create card");

      const newCard = await res.json();

      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === selectedColumnId) {
            return { ...col, cards: [...col.cards, newCard] };
          }
          return col;
        })
      );
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  const handleCardClick = (cardId: string) => {
    const card = findCardById(cardId);
    if (card) {
      setSelectedCard(card);
      setEditCardDialogOpen(true);
    }
  };

  const handleSaveCard = async (updatedCard: CardData) => {
    try {
      const res = await fetch(`/api/cards/${updatedCard.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updatedCard.title,
          description: updatedCard.description,
        }),
      });

      if (!res.ok) throw new Error("Failed to update card");

      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          cards: col.cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)),
        }))
      );
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete card");

      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          cards: col.cards.filter((c) => c.id !== cardId),
        }))
      );
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  // Column handlers
  const handleEditColumn = (columnId: string) => {
    const column = columns.find((c) => c.id === columnId);
    if (column) {
      setSelectedColumn(column);
      setEditColumnDialogOpen(true);
    }
  };

  const handleAddColumn = async (data: { name: string; color: string }) => {
    try {
      const res = await fetch("/api/columns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          color: data.color,
          position: columns.length,
        }),
      });

      if (!res.ok) throw new Error("Failed to create column");

      const newColumn = await res.json();
      setColumns((prev) => [...prev, { ...newColumn, cards: [] }]);
    } catch (error) {
      console.error("Error creating column:", error);
    }
  };

  const handleSaveColumn = async (updatedColumn: ColumnData) => {
    try {
      const res = await fetch(`/api/columns/${updatedColumn.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedColumn.name,
          color: updatedColumn.color,
        }),
      });

      if (!res.ok) throw new Error("Failed to update column");

      setColumns((prev) =>
        prev.map((col) => (col.id === updatedColumn.id ? updatedColumn : col))
      );
    } catch (error) {
      console.error("Error updating column:", error);
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    try {
      const res = await fetch(`/api/columns/${columnId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete column");

      setColumns((prev) => prev.filter((col) => col.id !== columnId));
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  // Save card position after drag
  const saveCardPosition = async (cardId: string, columnId: string, position: number) => {
    try {
      await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId, position }),
      });
    } catch (error) {
      console.error("Error saving card position:", error);
    }
  };

  // Save column position after drag
  const saveColumnPositions = async () => {
    try {
      await Promise.all(
        columns.map((col, index) =>
          fetch(`/api/columns/${col.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ position: index }),
          })
        )
      );
    } catch (error) {
      console.error("Error saving column positions:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-6 overflow-x-auto pb-4 items-start">
            {columns.map((column) => (
              <SortableColumn
                key={column.id}
                column={column}
                onAddCard={() => handleAddCard(column.id)}
                onEditColumn={() => handleEditColumn(column.id)}
                onCardClick={handleCardClick}
              />
            ))}

            <div className="flex-shrink-0 w-80 self-start">
              <Button
                variant="outline"
                className="w-full h-full min-h-[200px] border-dashed border-2"
                onClick={() => setAddColumnDialogOpen(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Column
              </Button>
            </div>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeCard ? <TaskCard card={activeCard} /> : null}
          {activeColumn ? (
            <div className="w-80 opacity-80">
              <KanbanColumn
                column={activeColumn}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Dialogs */}
      <AddCardDialog
        open={addCardDialogOpen}
        onOpenChange={setAddCardDialogOpen}
        onAddCard={handleCreateCard}
      />

      <EditCardDialog
        open={editCardDialogOpen}
        onOpenChange={setEditCardDialogOpen}
        card={selectedCard}
        onSaveCard={handleSaveCard}
        onDeleteCard={handleDeleteCard}
      />

      <AddColumnDialog
        open={addColumnDialogOpen}
        onOpenChange={setAddColumnDialogOpen}
        onAddColumn={handleAddColumn}
      />

      <EditColumnDialog
        open={editColumnDialogOpen}
        onOpenChange={setEditColumnDialogOpen}
        column={selectedColumn}
        onSaveColumn={handleSaveColumn}
        onDeleteColumn={handleDeleteColumn}
      />
    </div>
  );
}
