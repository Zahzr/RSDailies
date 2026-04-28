export function isSubparentCollapsed(id, checker) {
  return Boolean(checker?.(id));
}
