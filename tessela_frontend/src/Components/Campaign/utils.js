export function statusColor(s) {
  switch (s) {
    case "active":
      return "success";
    case "draft":
      return "secondary";
    case "closed":
      return "dark";
    default:
      return "secondary";
  }
}

export function fmtMoneyNoDecimals(n) {
  return Number(n || 0).toLocaleString("en-PH");
}

export function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}