const TOP_NAV_OFFSET = 64;

export function smoothScrollTo(elementId: string): void {
  const el = document.getElementById(elementId);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - TOP_NAV_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}
