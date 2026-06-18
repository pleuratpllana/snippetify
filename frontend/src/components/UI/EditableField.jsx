import { useState, useMemo } from "react";
import InputGroup from "./InputGroup";
import Button from "./Button";
import { Edit2, Save } from "lucide-react";

const EditableField = ({
  label,
  value,
  type = "text",
  onSave = () => {},
  className = "",
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isPassword = type === "password";
  const canEdit = !disabled;

  const isPasswordMismatched = useMemo(() => {
    if (!isPassword || !isEditing) return false;
    return newPassword !== confirmPassword || newPassword.length === 0;
  }, [isPassword, isEditing, newPassword, confirmPassword]);

  const handleSaveClick = () => {
    if (!canEdit) return;

    if (isPassword) {
      if (!isPasswordMismatched) {
        onSave(newPassword);
        setNewPassword("");
        setConfirmPassword("");
        setIsEditing(false);
      }
    } else {
      onSave(internalValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setInternalValue(value);
    setNewPassword("");
    setConfirmPassword("");
    setIsEditing(false);
  };

  return (
    <div className={`mb-2 w-full min-w-0 ${className}`}>
      {!isPassword || !isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <InputGroup
            label={label}
            type={isPassword && !isEditing ? "password" : type}
            value={isEditing ? internalValue : value}
            onChange={(e) => setInternalValue(e.target.value)}
            disabled={!isEditing || disabled}
            className="flex-1 min-w-0"
          />
          {canEdit && (
            <Button
              onClick={isEditing ? handleSaveClick : () => setIsEditing(true)}
              active={isEditing}
              activeBg="bg-[var(--color-superlightaccent)]"
              className="h-[48px] min-w-[48px] px-3 rounded-md mt-6"
              centerContent
            >
              {isEditing ? (
                <Save className="w-5 h-5" />
              ) : (
                <Edit2 className="w-5 h-5" />
              )}
            </Button>
          )}
          {isEditing && !isPassword && (
            <Button
              onClick={handleCancel}
              className="h-[48px] min-w-[48px] px-3 rounded-md mt-6 button-outlined"
              centerContent
            >
              Cancel
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Password editing remains unchanged */}
          <h3 className="font-semibold text-gray-700 text-sm sm:text-base mb-2">
            Update Password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={
                isEditing && newPassword.length > 0 && newPassword.length < 8
                  ? "Password must be at least 8 characters."
                  : ""
              }
              className="flex-1 min-w-0"
            />
            <InputGroup
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={
                isPasswordMismatched && newPassword.length >= 8
                  ? "Passwords do not match."
                  : ""
              }
              className="flex-1 min-w-0"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button
              onClick={handleCancel}
              className="min-w-[80px] button-outlined"
              centerContent
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveClick}
              disabled={isPasswordMismatched || newPassword.length < 8}
              className="min-w-[80px]"
              centerContent
            >
              Save New
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditableField;
