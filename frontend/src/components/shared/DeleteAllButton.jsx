// components/shared/DeleteAllButton.jsx
import { useState } from "react";
import Button from "../UI/Button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import Modal from "./Modal";

const DeleteAllButton = ({
  items = [],
  onDeleteAll,
  label = "Delete All",
  icon = TrashIcon,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    onDeleteAll();
    toast.success(`All items have been successfully deleted`, {
      className: "toast-success",
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        icon={icon}
        onClick={() => setIsModalOpen(true)}
        className="hyperlink-button flex items-center justify-center gap-1 hover:bg-transparent"
        disabled={items.length === 0}
      >
        {label}
      </Button>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm Deletion"
          confirmText="Delete All"
          cancelText="Cancel"
          onConfirm={handleDelete}
          requireTextConfirmation="DELETE"
        >
          <p>
            Are you sure you want to delete all {items.length} items? This
            action cannot be undone. Type <strong>DELETE</strong> to confirm.
          </p>
        </Modal>
      )}
    </>
  );
};

export default DeleteAllButton;
