import { useState, useEffect, useCallback, memo } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import Card from "./Card";
import { useSnippets } from "../../context/SnippetContext";

// Memoized SortableItem
const SortableItem = memo(
  ({ item, type, snippets, onDelete, onToggleStar, onCopy, onUpdate, onEdit }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: item.id, handle: ".drag-handle" });

    const style = { transform: CSS.Transform.toString(transform), transition };

    const snippetCount =
      type === "folder"
        ? (item.snippetIds?.length ??
          snippets.filter((s) => s.folderId === item.id).length)
        : 0;

    // HARD SAFE DATE RESOLUTION (key fix)
    const safeDate =
      item.createdAt ??
      item.created_at ??
      item.date ??
      new Date().toISOString();

    const cardProps =
      type === "folder"
        ? {
            id: item.id,
            type,
            title: item.title,
            subtitle: item.description || "No description",
            date: safeDate,
            folderColor: item.color || "#34d399",
            snippetCount,
          }
        : {
            ...item,
            content: item.codeContent,
            type,
            date: safeDate,
          };

    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        <Card
          {...cardProps}
          dragHandleProps={listeners}
          showFavorites={type === "snippet"}
          showExpand={type === "snippet"}
          showDragHandle
          onDelete={() => onDelete(item.id)}
          onToggleStar={() => onToggleStar?.(item.id)}
          onCopy={() => onCopy?.(item)}
          onUpdate={(title, subtitle) => onUpdate?.(item.id, title, subtitle)}
          onEdit={() => onEdit?.(item)}
        />
      </div>
    );
  },
);

const Listings = ({
  items = [],
  type = "snippet",
  onDelete,
  onToggleStar,
  onCopy,
  onUpdate,
  onEdit,
  viewMode = "grid",
}) => {
  const [orderedItems, setOrderedItems] = useState([]);
  const { snippets } = useSnippets();

  // Compute final order: newest-first + persisted drag order
  useEffect(() => {
    if (!items || items.length === 0) {
      setOrderedItems([]);
      return;
    }

    const stored = localStorage.getItem(`${type}Order`);
    const itemsById = Object.fromEntries(items.map((i) => [i.id, i]));

    if (stored) {
      const storedIds = JSON.parse(stored);

      const storedOrdered = storedIds
        .map((id) => itemsById[id])
        .filter(Boolean);

      const newItems = items
        .filter((i) => !storedIds.includes(i.id))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrderedItems([...newItems, ...storedOrdered]);
    } else {
      setOrderedItems(
        [...items].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
      );
    }
  }, [items, type]);

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      if (!over || active.id === over.id) return;

      setOrderedItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(prev, oldIndex, newIndex);

        localStorage.setItem(
          `${type}Order`,
          JSON.stringify(newArray.map((i) => i.id)),
        );

        return newArray;
      });
    },
    [type],
  );

  if (!items || items.length === 0) return null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext items={orderedItems} strategy={rectSortingStrategy}>
        <div
          className={
            viewMode === "grid"
              ? `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 ${
                  type === "folder" ? "lg:grid-cols-2" : "lg:grid-cols-3"
                } gap-4 auto-rows-fr w-full mb-4 lg:mb-0`
              : "flex flex-col gap-4 w-full"
          }
        >
          {orderedItems.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              type={type}
              snippets={snippets}
              onDelete={onDelete}
              onToggleStar={onToggleStar}
              onCopy={onCopy}
              onUpdate={onUpdate}
              onEdit={onEdit}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default Listings;
