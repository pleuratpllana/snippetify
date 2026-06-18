import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSnippets } from "../context/SnippetContext";
import Card from "../components/shared/Card"; // generic card
import SnippetForm from "../components/Snippet/SnippetForm";

const SnippetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    snippets,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    toggleStar,
    incrementUsage,
  } = useSnippets();

  const isNew = id === "new";
  const isEdit = searchParams.get("edit") === "true";

  const snippet = !isNew ? snippets.find((s) => s.id.toString() === id) : null;

  const handleSubmit = (newSnippetData) => {
    if (isNew) {
      addSnippet(newSnippetData);
    } else if (snippet) {
      updateSnippet(snippet.id, newSnippetData);
    }
    navigate("/dashboard");
  };

  const handleDelete = () => {
    if (snippet) deleteSnippet(snippet.id, null, true);
    navigate("/dashboard");
  };

  const handleToggleStar = () => {
    if (snippet) toggleStar(snippet.id);
  };

  const handleCopy = ({ content }) => {
    navigator.clipboard.writeText(content).catch(() => {});
    if (snippet) incrementUsage(snippet.id);
  };

  return (
    <div className="flex flex-col gap-4 items-start text-left">
      <button
        onClick={() => navigate("/dashboard")}
        className="hyperlink-button mb-4 bg-transparent"
      >
        ← Return to Snippets
      </button>

      {(isNew || isEdit) && (
        <SnippetForm
          snippet={isEdit ? snippet : null}
          onSubmit={handleSubmit}
          onCancel={() => navigate(isNew ? "/dashboard" : `/snippet/${id}`)}
        />
      )}

      {!isNew && !isEdit && snippet && (
        <Card
          {...snippet}
          type="snippet"
          content={snippet.codeContent}
          showFavorites={true}
          showExpand={true}
          onDelete={handleDelete}
          onToggleStar={handleToggleStar}
          onCopy={handleCopy}
          expanded={true}
        />
      )}

      {!isNew && !isEdit && !snippet && (
        <p className="text-center mt-10">Snippet not found.</p>
      )}
    </div>
  );
};

export default SnippetPage;
