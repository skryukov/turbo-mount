export const camelToKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .replace(/\//g, "--")
    .toLowerCase();
};

// Normalizes a component filename into a standardized component name.
// Example: './components/users/UserProfile.tsx' -> 'users/UserProfile'
// Example: 'global/utility/debounce_button.js' -> 'global/utility/debounce_button'
export const normalizeFilenameToComponentName = (filename: string): string => {
  return filename
    .replace(/\.\w*$/, "")
    .replace(/^[./]*components\//, "");
};

export const generateStimulusIdentifiers = (componentName: string): string[] => {
  const kebabCaseName = camelToKebabCase(componentName);
  
  return [`turbo-mount--${kebabCaseName}`, `turbo-mount-${kebabCaseName}`];
};

export const getShortNameForIndexComponent = (componentName: string): string | null => {
  if (componentName.endsWith("/index")) {
    const shortName = componentName.replace(/\/index$/, "");
    return shortName || null;
  }
  return null;
};
