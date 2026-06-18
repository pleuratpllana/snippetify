import { useState } from "react";
import ProfileCard from "../components/Profile/ProfileCard";
import ChangePassword from "../components/Profile/ChangePassword";
import ToggleSwitch from "../components/UI/ToggleSwitch";
import EditableField from "../components/UI/EditableField";
import useNavigateBack from "../hooks/useNavigateBack";
import { useSnippets } from "../context/SnippetContext";
import {
  UserIcon,
  Cog6ToothIcon,
  IdentificationIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button from "../components/UI/Button";
import Modal from "../components/shared/Modal";
import { useTheme } from "../context/themeContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { themeDark, setThemeDark } = useTheme();
  const [twoFA] = useState(false);
  const [emails, setEmails] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { snippets } = useSnippets();
  const goBack = useNavigateBack("/dashboard");

  const { user, setUser } = useAuth();

  const updateUserField = (field, value, message) => {
    const updated = { ...user, [field]: value };
    setUser(updated);

    const storage = localStorage.getItem("token")
      ? localStorage
      : sessionStorage;
    storage.setItem("user", JSON.stringify(updated));

    toast.success(message, { className: "toast-success" });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      // ADD SUPABASE CLIENT HERE
      // Example:
      // const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // --------------------------
      // 1. Delete user from Supabase Auth (via serverless endpoint / service key)
      // await supabase.auth.admin.deleteUser(user.id);

      // 2. Delete user-related data from tables
      // await supabase.from("snippets").delete().eq("user_id", user.id);
      // --------------------------

      // 3. Sign out user (client)
      // await supabase.auth.signOut();

      // 4. Clear local storage & context
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);

      toast.success("Your account has been deleted!");
      window.location.href = "/login"; // redirect to login page
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="text-md mb-16 md:mb-0 w-full max-w-full overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      <button onClick={goBack} className="hyperlink-button mb-4 bg-transparent">
        ← Return to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">Account Information</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr w-full max-w-full overflow-x-hidden">
        {/* Profile Information */}
        <div className="md:col-span-2 flex min-w-0">
          <ProfileCard
            title={
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[var(--color-text)]" />
                <span>Profile Information</span>
              </div>
            }
            subtitle="Update your personal information and profile details"
            className="h-full flex-1 min-w-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-0">
              <EditableField
                label="First Name"
                value={user.firstName}
                isEditable
                onSave={(val) =>
                  updateUserField(
                    "firstName",
                    val,
                    "Your first name has been updated!"
                  )
                }
              />
              <EditableField
                label="Last Name"
                value={user.lastName}
                isEditable
                onSave={(val) =>
                  updateUserField(
                    "lastName",
                    val,
                    "Your last name has been updated!"
                  )
                }
              />
              <EditableField
                label="Email Address"
                value={user.email}
                disabled
                isLast
              />
              <EditableField
                label="Display Name"
                value={user?.username || ""}
                isEditable
                onSave={(val) =>
                  updateUserField(
                    "username",
                    val,
                    "Your display name has been updated!"
                  )
                }
              />
            </div>
            <ChangePassword />
          </ProfileCard>
        </div>

        {/* Preferences */}
        <div className="md:col-span-1 flex min-w-0">
          <ProfileCard
            title={
              <div className="flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5 text-[var(--color-text)]" />
                <span>Preferences</span>
              </div>
            }
            subtitle="Adjust your app settings"
            className="h-full flex-1 min-w-0 flex flex-col gap-1"
          >
            <ToggleSwitch
              label="Dark Mode"
              enabled={themeDark}
              onChange={() => setThemeDark(!themeDark)}
            />
            <ToggleSwitch
              label="Enable Emails"
              enabled={emails}
              onChange={() => setEmails(!emails)}
            />
            <ToggleSwitch
              label="Enable 2FA (Coming Soon)"
              enabled={twoFA}
              onChange={() => {}}
              disabled
            />
          </ProfileCard>
        </div>

        {/* Account Settings */}
        <div className="md:col-span-1 flex min-w-0 text-sm">
          <ProfileCard
            title={
              <div className="flex items-center gap-2">
                <IdentificationIcon className="w-5 h-5 text-[var(--color-text)]" />
                <span>Account Settings</span>
              </div>
            }
            subtitle="View your account details"
            className="h-full flex-1 min-w-0"
          >
            <div className="flex flex-col divide-y divide-[var(--color-border)] text-[var(--color-text)]">
              <div className="py-3 flex justify-between">
                <span className="font-medium text-[var(--color-muted)]">
                  Account Type
                </span>
                <span>{user.accountType}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="font-medium text-[var(--color-muted)]">
                  Snippets Created
                </span>
                <span>{snippets.length}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="font-medium text-[var(--color-muted)]">
                  Account Created
                </span>
                <span>{formatDate(user.createdAt)}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="font-medium text-[var(--color-muted)]">
                  Last Login
                </span>
                <span>{formatDate(user.lastLogin)}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="font-medium text-[var(--color-muted)]">
                  2FA Enabled
                </span>
                <span>{twoFA ? "Yes" : "No"}</span>
              </div>
            </div>
          </ProfileCard>
        </div>

        {/* Delete Account */}
        <div className="md:col-span-2 flex min-w-0">
          <ProfileCard
            title={
              <div className="flex items-center gap-2">
                <TrashIcon className="w-5 h-5 text-[var(--color-text)]" />
                <span>Delete Account</span>
              </div>
            }
            subtitle="Warning: This action cannot be undone. Deleting your account will remove all your data permanently."
            className="h-full flex-1 min-w-0 flex flex-col"
          >
            <div className="flex flex-col justify-center items-center gap-4 mt-2 p-6 flex-1 rounded w-full bg-[var(--color-superlightbg)] border border-[var(--color-border)] border-dashed bg-[var(--color-superlightaccent)]">
              <p className="text-sm text-[var(--color-text)] text-center">
                Once you delete your account, there is no going back. All your
                snippets and data will be permanently deleted.
              </p>
              <Button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg w-full max-w-xs"
                centerContent
              >
                Delete Account
              </Button>
            </div>
          </ProfileCard>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Account Deletion"
        cancelText="Cancel"
        confirmText="Delete"
        confirmColor="bg-red-600 text-white"
        onConfirm={handleDeleteAccount}
      >
        <p className="text-[var(--color-text)] text-sm">
          Are you sure you want to delete your account? This action is permanent
          and cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ProfilePage;
