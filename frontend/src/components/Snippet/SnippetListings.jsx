// import React, { useState, useEffect, useCallback, memo } from "react";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   rectSortingStrategy,
//   useSortable,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { restrictToParentElement } from "@dnd-kit/modifiers";
// import SnippetCard from "./SnippetCard";

// // Memoized sortable item
// const SortableItem = memo(
//   ({ snippet, onDelete, onToggleStar, onCopy, onUpdate, onEdit }) => {
//     const { attributes, listeners, setNodeRef, transform, transition } =
//       useSortable({
//         id: snippet.id,
//         handle: ".drag-handle",
//       });

//     const style = {
//       transform: CSS.Transform.toString(transform),
//       transition,
//     };

//     return (
//       <div ref={setNodeRef} style={style} {...attributes}>
//         <SnippetCard
//           {...snippet}
//           dragHandleProps={listeners}
//           onDelete={() => onDelete(snippet.id)}
//           onToggleStar={() => onToggleStar(snippet.id)}
//           onCopy={() => onCopy(snippet)}
//           onUpdate={(title, subtitle) => onUpdate(snippet.id, title, subtitle)}
//           onEdit={() => onEdit(snippet)}
//         />
//       </div>
//     );
//   }
// );

// const SnippetListings = ({
//   snippets,
//   onDelete,
//   onToggleStar,
//   onCopy,
//   onUpdate,
//   onEdit,
//   viewMode,
// }) => {
//   // Load drag order from localStorage or start fresh
//   const [orderedSnippets, setOrderedSnippets] = useState(() => {
//     const stored = localStorage.getItem("snippetsOrder");
//     if (!stored) return snippets;
//     const ids = JSON.parse(stored);
//     const ordered = ids
//       .map((id) => snippets.find((s) => s.id === id))
//       .filter(Boolean);
//     // Include new snippets not in storage
//     snippets.forEach((s) => {
//       if (!ordered.find((sn) => sn.id === s.id)) ordered.push(s);
//     });
//     return ordered;
//   });

//   // Sync orderedSnippets when Dashboard filtering/sorting changes
//   useEffect(() => {
//     setOrderedSnippets((prev) => {
//       const idsInPrev = new Set(prev.map((s) => s.id));
//       const merged = [...snippets];
//       // Preserve previous drag order for existing items
//       merged.sort((a, b) => {
//         const indexA = prev.findIndex((s) => s.id === a.id);
//         const indexB = prev.findIndex((s) => s.id === b.id);
//         if (indexA !== -1 && indexB !== -1) return indexA - indexB;
//         if (indexA !== -1) return -1;
//         if (indexB !== -1) return 1;
//         return 0;
//       });
//       return merged;
//     });
//   }, [snippets]);

//   const handleDragEnd = useCallback(({ active, over }) => {
//     if (!over || active.id === over.id) return;

//     setOrderedSnippets((prev) => {
//       const oldIndex = prev.findIndex((s) => s.id === active.id);
//       const newIndex = prev.findIndex((s) => s.id === over.id);
//       const newArray = arrayMove(prev, oldIndex, newIndex);

//       // Persist order
//       localStorage.setItem(
//         "snippetsOrder",
//         JSON.stringify(newArray.map((s) => s.id))
//       );

//       return newArray;
//     });
//   }, []);

//   return (
//     <DndContext
//       collisionDetection={closestCenter}
//       onDragEnd={handleDragEnd}
//       modifiers={[restrictToParentElement]}
//     >
//       <SortableContext items={orderedSnippets} strategy={rectSortingStrategy}>
//         <div
//           className={
//             viewMode === "grid"
//               ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr w-full mb-4 lg:mb-0"
//               : "flex flex-col gap-4 w-full"
//           }
//         >
//           {orderedSnippets.map((snippet) => (
//             <SortableItem
//               key={snippet.id}
//               snippet={snippet}
//               onDelete={onDelete}
//               onToggleStar={onToggleStar}
//               onCopy={onCopy}
//               onUpdate={onUpdate}
//               onEdit={onEdit}
//             />
//           ))}
//         </div>
//       </SortableContext>
//     </DndContext>
//   );
// };

// export default SnippetListings;
