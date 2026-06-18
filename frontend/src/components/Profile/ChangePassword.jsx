import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { KeyRound } from "lucide-react";
import InputGroup from "../UI/InputGroup";
import Button from "../UI/Button";
import { supabase } from "../../lib/supabaseClient";

const getPasswordUpdateMessage = (error) => {
  const message = error?.message || "Unable to update password.";
  const normalized = message.toLowerCase();

  if (
    normalized.includes("same") ||
    normalized.includes("different") ||
    normalized.includes("old password")
  ) {
    return "Your new password must be different from your current password.";
  }

  if (normalized.includes("session") || normalized.includes("jwt")) {
    return "Your session expired. Please sign in again before changing your password.";
  }

  return message;
};

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const passwordError = useMemo(() => {
    if (!newPassword) return "";
    if (newPassword.length < 8) return "Password must be at least 8 characters.";
    return "";
  }, [newPassword]);

  const confirmError = useMemo(() => {
    if (!confirmPassword) return "";
    if (newPassword !== confirmPassword) return "Passwords do not match.";
    return "";
  }, [confirmPassword, newPassword]);

  const canSubmit =
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword &&
    !isSaving;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.", { className: "toast-error" });
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.", {
        className: "toast-error",
      });
      return;
    }

    try {
      setIsSaving(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Your session expired. Please sign in again before changing your password."
        );
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");
      toast.success("Your password has been updated.", {
        className: "toast-success",
      });
    } catch (error) {
      toast.error(getPasswordUpdateMessage(error), {
        className: "toast-error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 pt-5 border-t border-[var(--color-border)]"
    >
      <div className="flex items-center gap-2 mb-3 text-[var(--color-text)]">
        <KeyRound className="w-5 h-5" />
        <h3 className="font-semibold">Change Password</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          id="profile-new-password"
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          error={passwordError}
          autoComplete="new-password"
        />
        <InputGroup
          id="profile-confirm-new-password"
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={confirmError}
          autoComplete="new-password"
        />
      </div>

      <div className="flex justify-end mt-3">
        <Button
          type="submit"
          disabled={!canSubmit}
          className="min-w-[140px]"
          centerContent
        >
          {isSaving ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
};

export default ChangePassword;
