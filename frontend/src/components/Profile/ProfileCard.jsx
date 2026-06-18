import { PencilSquareIcon } from "@heroicons/react/24/outline";

const ProfileCard = ({
  title,
  subtitle,
  infoItems = [],
  onEdit,
  children,
  className,
}) => {
  return (
    <div
      className={`bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-6 flex flex-col ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl mt-0 font-semibold text-[var(--color-text)]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[var(--color-muted)]">{subtitle}</p>
          )}
        </div>

        {onEdit && (
          <PencilSquareIcon
            onClick={onEdit}
            className="w-5 h-5 text-gray-500 hover:text-gray-800 cursor-pointer"
          />
        )}
      </div>

      {infoItems.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="flex justify-between text-gray-700"
            >
              <span className="font-medium">{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
};

export default ProfileCard;
