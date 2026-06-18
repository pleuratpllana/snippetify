// utils/dateUtils.js
export const normalizeDateValue = (value) => {
  if (!value) return new Date().toISOString();

  const rawValue =
    typeof value === "string" && value.trim() !== "" ? value.trim() : value;
  const numericValue =
    typeof rawValue === "number" ||
    (typeof rawValue === "string" && /^\d+$/.test(rawValue))
      ? Number(rawValue)
      : null;
  const date = numericValue !== null ? new Date(numericValue) : new Date(rawValue);

  return Number.isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString();
};

export const normalizeAndSortItems = (items = [], dateField = "date") => {
  return items
    .map((item) => {
      const rawDate = item[dateField] || item.createdAt;
      return { ...item, [dateField]: normalizeDateValue(rawDate) };
    })
    .sort((a, b) => new Date(b[dateField]) - new Date(a[dateField]));
};

export default normalizeAndSortItems;
