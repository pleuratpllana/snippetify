// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   PencilSquareIcon,
//   ArrowDownTrayIcon,
//   TrashIcon,
//   StarIcon,
//   CheckIcon,
//   ArrowTopRightOnSquareIcon,
// } from "@heroicons/react/24/outline";
// import { Github, Copy } from "lucide-react";
// import hljs from "highlight.js";
// import "highlight.js/styles/github-dark.css"; // dark theme
// import Modal from "../shared/Modal";
// import DragDropIcon from "../DragDropIcon";

// const ActionIcon = ({ Icon, onClick, color, active, title }) => (
//   <Icon
//     onClick={(e) => {
//       e.stopPropagation();
//       onClick?.(e);
//     }}
//     title={title}
//     className={`w-5 h-5 shrink-0 cursor-pointer transition-colors ${
//       active
//         ? "text-[var(--color-darkaccent)] fill-[var(--color-accent)]"
//         : color === "danger"
//         ? "hover:text-red-500"
//         : "hover:text-[var(--color-darkaccent)] text-[var(--color-muted)]"
//     }`}
//   />
// );

// const SnippetCard = ({
//   id,
//   title,
//   subtitle,
//   codeContent,
//   tags = [],
//   language = "plaintext",
//   date,
//   isStarred,
//   onDelete,
//   onCopy,
//   onToggleStar,
//   expanded = false,
//   dragHandleProps,
// }) => {
//   const [copied, setCopied] = useState(false);
//   const [activeModal, setActiveModal] = useState(null);
//   const [highlightedCode, setHighlightedCode] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!codeContent) return;
//     try {
//       if (hljs.getLanguage(language)) {
//         setHighlightedCode(hljs.highlight(codeContent, { language }).value);
//       } else {
//         setHighlightedCode(hljs.highlightAuto(codeContent).value);
//       }
//     } catch (e) {
//       setHighlightedCode(codeContent);
//     }
//   }, [codeContent, language]);

//   const handleCopy = (e) => {
//     e.stopPropagation();
//     onCopy({ id, codeContent });
//     setCopied(true);
//     setTimeout(() => setCopied(false), 3000);
//   };

//   const handleExport = (e) => {
//     e.stopPropagation();
//     const blob = new Blob(
//       [JSON.stringify({ title, subtitle, codeContent, tags, date }, null, 2)],
//       { type: "application/json" }
//     );
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `${title}.json`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   const getRelativeDate = (timestamp) => {
//     const now = new Date();
//     const dateObj = new Date(timestamp);
//     const diffMs = now - dateObj;
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return "Today";
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) {
//       const weeks = Math.floor(diffDays / 7);
//       return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
//     }
//     if (diffDays < 365) {
//       const months = Math.floor(diffDays / 30);
//       return months === 1 ? "1 month ago" : `${months} months ago`;
//     }
//     const years = Math.floor(diffDays / 365);
//     return years === 1 ? "1 year ago" : `${years} years ago`;
//   };

//   return (
//     <div className="p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex flex-col h-full w-full hover:shadow-md transition duration-400 ease-in-out">
//       {/* Drag handle */}
//       <div
//         {...dragHandleProps}
//         className="drag-handle flex items-center space-x-1 cursor-grab group mb-4"
//         title="Drag to reorder"
//       >
//         <DragDropIcon className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-darkaccent)]" />
//         <p className="text-xs mb-0 text-[var(--color-muted)] group-hover:text-[var(--color-darkaccent)]">
//           Drag
//         </p>
//       </div>

//       {/* Header */}
//       <div className="flex justify-between gap-3">
//         <div className="flex-1 min-w-0 flex flex-col gap-1">
//           <h6 className="mt-0 font-semibold text-[var(--color-text)] truncate">
//             {title || "No title"}
//           </h6>
//           <p className="text-sm text-[var(--color-muted)] truncate mt-1">
//             {subtitle || "No subtitle"}
//           </p>
//         </div>

//         <div className="flex gap-3 text-[var(--color-muted)] flex-shrink-0">
//           <ActionIcon
//             Icon={PencilSquareIcon}
//             title="Edit Snippet"
//             onClick={() => navigate(`/snippet/${id}?edit=true`)}
//           />
//           <ActionIcon
//             Icon={ArrowDownTrayIcon}
//             title="Export Snippet"
//             onClick={() => setActiveModal("export")}
//           />
//           <ActionIcon
//             Icon={StarIcon}
//             title={isStarred ? "Remove from Favorites" : "Add to Favorites"}
//             active={isStarred}
//             onClick={() => onToggleStar(id)}
//           />
//           <ActionIcon
//             Icon={TrashIcon}
//             title="Delete Snippet"
//             color="danger"
//             onClick={() => setActiveModal("delete")}
//           />
//           <ActionIcon
//             Icon={ArrowTopRightOnSquareIcon}
//             title="Expand Snippet"
//             onClick={() => navigate(`/snippet/${id}`)}
//           />
//         </div>
//       </div>

//       {/* Code + Footer */}
//       <div className="flex flex-col flex-1">
//         <div className="relative p-4 rounded bg-[var(--color-superlightbg)] border border-dashed border-[var(--color-border)] flex-1 mt-2 mb-1">
//           <pre
//             className={`font-mono text-[var(--color-text)] text-sm whitespace-pre-wrap break-words overflow-auto ${
//               !expanded ? "line-clamp-1" : ""
//             }`}
//             dangerouslySetInnerHTML={{ __html: highlightedCode }}
//           />
//           <div
//             className="absolute top-2 right-2 flex items-center gap-1 cursor-pointer z-10"
//             onClick={handleCopy}
//             title={copied ? "Copied!" : "Copy to clipboard"}
//           >
//             {copied ? (
//               <CheckIcon className="w-4 h-4 transition-all duration-200 text-[var(--color-muted)]" />
//             ) : (
//               <Copy className="w-4 h-4 text-[var(--color-muted)]" />
//             )}
//             <span className="text-xs text-[var(--color-muted)]">
//               {copied ? "Copied" : "Copy"}
//             </span>
//           </div>
//         </div>

//         <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
//           <div className="flex gap-2 flex-wrap">
//             {(tags && tags.length ? tags : ["No tags"]).map((tag, index) => (
//               <span
//                 key={index}
//                 className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-superlightbg)] text-[var(--color-muted)]"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//           <div className="text-[var(--color-muted)] text-xs whitespace-nowrap">
//             {getRelativeDate(date)}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {activeModal === "delete" && (
//         <Modal
//           isOpen={true}
//           onClose={() => setActiveModal(null)}
//           title="Confirm Deletion"
//           className="text-2xl"
//         >
//           <p className="text-[var(--color-text)] text-md">
//             Are you sure you want to delete "{title}"?
//           </p>
//           <div className="mt-4 flex justify-start gap-2">
//             <button
//               className="bg-[var(--color-superlightbg)] text-[var(--color-text)] hover:bg-[var(--color-lightgray)]"
//               onClick={() => setActiveModal(null)}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-red-500 text-white hover:bg-red-600"
//               onClick={() => {
//                 onDelete();
//                 setActiveModal(null);
//               }}
//             >
//               Delete
//             </button>
//           </div>
//         </Modal>
//       )}

//       {activeModal === "export" && (
//         <Modal
//           isOpen={true}
//           onClose={() => setActiveModal(null)}
//           title="Export Snippet"
//         >
//           <p className="mb-6 mt-1 text-sm text-[var(--color-text)]">
//             Choose export format for "{title}":
//           </p>
//           <div className="grid grid-cols-2 gap-4">
//             {[
//               { label: "Download JSON", action: handleExport, active: true },
//               { label: "Share to Github Repo", action: () => {}, active: true },
//               { label: "PDF (Coming Soon)", action: () => {}, active: false },
//               { label: "CSV (Coming Soon)", action: () => {}, active: false },
//             ].map(({ label, action, active }) => (
//               <div
//                 key={label}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   active && action?.(e);
//                 }}
//                 title={`Export as ${label}`}
//                 className={`flex flex-col items-center justify-center p-4 border border-[var(--color-border)] rounded-lg cursor-pointer transition-colors ${
//                   active
//                     ? "hover:bg-[var(--color-superlightaccent)]"
//                     : "cursor-not-allowed opacity-50"
//                 } bg-[var(--color-bg)]`}
//               >
//                 {label === "Share to Github Repo" ? (
//                   <Github className="w-6 h-6 mb-2 text-[var(--color-darkaccent)]" />
//                 ) : (
//                   <ArrowDownTrayIcon
//                     className={`w-6 h-6 mb-2 ${
//                       active
//                         ? "text-[var(--color-darkaccent)]"
//                         : "text-[var(--color-muted)]"
//                     }`}
//                   />
//                 )}
//                 <span className="text-sm text-[var(--color-text)]">
//                   {label}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default React.memo(SnippetCard);
