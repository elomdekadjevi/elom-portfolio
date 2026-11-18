import { sections } from "../sections";

export function goTo(id) {
  const i = sections.findIndex(([s]) => s === id);
  if (i < 0) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({
    top: (i / (sections.length - 1)) * max,
    behavior: "smooth",
  });
}

export const jump = (id) => (e) => {
  e.preventDefault();
  goTo(id);
};
