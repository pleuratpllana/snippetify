import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, Suspense } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../UI/Button";
import { useTheme } from "../../context/themeContext";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  cancelText = null,
  confirmText = "Confirm",
  onConfirm,
  requireTextConfirmation = null, // example: "DELETE"
}) => {
  const { themeDark } = useTheme();
  const [show, setShow] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setConfirmInput(""); // reset input on open
    }
  }, [isOpen]);

  const handleClose = () => setShow(false);
  const handleAfterLeave = () => onClose?.();

  const handleConfirm = () => {
    if (
      requireTextConfirmation &&
      confirmInput.trim() !== requireTextConfirmation
    )
      return;
    onConfirm?.();
    handleClose();
  };

  const isConfirmDisabled =
    (requireTextConfirmation &&
      confirmInput.trim() !== requireTextConfirmation) ||
    !onConfirm;

  return (
    <Transition appear show={show} as={Fragment} afterLeave={handleAfterLeave}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.9)] transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full max-w-xl transform overflow-hidden rounded-2xl px-8 pb-8 pt-4 text-left align-middle shadow-xl transition-all relative
                  ${
                    themeDark
                      ? "bg-[var(--color-bg)] text-[var(--color-text)]"
                      : "bg-[var(--color-bg)] text-[var(--color-text)]"
                  }
                `}
              >
                {/* Close button */}
                <Button
                  onClick={handleClose}
                  icon={XMarkIcon}
                  className={`absolute top-3 right-3 
                    ${
                      themeDark
                        ? "bg-[var(--color-bg)] text-[var(--color-muted)] hover:text-[var(--color-darkaccent)] hover:bg-transparent"
                        : "bg-[var(--color-bg)] text-[var(--color-muted)] hover:text-[var(--color-darkaccent)] hover:bg-transparent"
                    }`}
                />

                {/* Title */}
                {title && (
                  <Dialog.Title className="text-2xl font-medium leading-6 text-[var(--color-text)]">
                    {title}
                  </Dialog.Title>
                )}

                {/* Content */}
                <div className="mt-4">
                  <Suspense fallback={<div>Loading...</div>}>
                    {children}
                  </Suspense>

                  {requireTextConfirmation && (
                    <div className="mt-6">
                      <p className="text-sm text-[var(--color-muted)] mb-2">
                        Type{" "}
                        <span className="font-semibold">
                          {requireTextConfirmation}
                        </span>{" "}
                        to confirm.
                      </p>
                      <input
                        type="text"
                        value={confirmInput}
                        onChange={(e) => setConfirmInput(e.target.value)}
                        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-superlightbg)] px-3 py-2 text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                        placeholder={`Type ${requireTextConfirmation}`}
                      />
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                {(onConfirm || cancelText) && (
                  <div className="mt-6 flex justify-start gap-2">
                    {cancelText && (
                      <Button
                        onClick={handleClose}
                        className="bg-[var(--color-superlightbg)] text-[var(--color-text)] hover:bg-[var(--color-lightgray)]"
                      >
                        {cancelText}
                      </Button>
                    )}
                    {onConfirm && (
                      <Button
                        onClick={handleConfirm}
                        disabled={isConfirmDisabled}
                        className={`${
                          isConfirmDisabled
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white`}
                      >
                        {confirmText}
                      </Button>
                    )}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
