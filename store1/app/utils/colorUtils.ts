// utils/colorUtils.ts
import colorName from "color-name";

// Convert a color name to hex (or return a default if not found)
export const getHexFromColorName = (colorName: string | null): string => {
  if (!colorName) return "#808080"; // Default to gray if no color

  // Normalize the color name (e.g., "Light Blue" -> "lightblue")
  const normalizedName = colorName.toLowerCase().replace(/\s+/g, "");
  const rgb = colorName[normalizedName] as [number, number, number] | undefined;

  if (rgb) {
    // Convert RGB array to hex
    const [r, g, b] = rgb;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, "0")}`;
  }

  // Fallback to a default color (gray) if the color name isn't found
  return "#808080";
};