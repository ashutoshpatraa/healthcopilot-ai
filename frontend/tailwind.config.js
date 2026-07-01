/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "var(--color-primary)",
        "on-primary": "var(--color-on-primary)",
        "background": "var(--color-background)",
        "surface": "var(--color-surface)",
        "surface-container": "var(--color-surface-container)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "cyan-accent": "var(--color-cyan-accent)",
        "secondary-container": "var(--color-cyan-accent)",
        "on-secondary-container": "var(--color-primary)",
        "error": "var(--color-error)",
        "border": "var(--color-border)",
        "on-background": "var(--color-text)",
        "on-surface-variant": "var(--color-on-surface-variant)",
      },
      borderWidth: {
        "border-width": "4px",
        "thin-border": "2px",
      },
      borderRadius: {
        "DEFAULT": "0px",
        "lg": "0px",
        "xl": "0px",
        "full": "0px"
      },
      spacing: {
        "base": "4px",
        "xs": "8px",
        "sm": "16px",
        "md": "24px",
        "lg": "40px",
        "xl": "64px",
        "offset-depth": "0px",
        "border-width": "4px",
        "container-margin": "16px",
        "gutter": "16px"
      },
      fontFamily: {
        "body-md": ["JetBrains Mono", "monospace"],
        "headline-lg-mobile": ["Archivo Narrow", "sans-serif"],
        "headline-md": ["Archivo Narrow", "sans-serif"],
        "body-lg": ["JetBrains Mono", "monospace"],
        "label-md": ["JetBrains Mono", "monospace"],
        "label-caps": ["JetBrains Mono", "monospace"],
        "headline-xl": ["Archivo Narrow", "sans-serif"],
        "headline-lg": ["Archivo Narrow", "sans-serif"],
        "display-lg": ["Archivo Narrow", "sans-serif"],
        "data-mono": ["JetBrains Mono", "monospace"],
        "code-sm": ["JetBrains Mono", "monospace"]
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "700" }],
        "label-caps": ["12px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "display-lg": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "data-mono": ["14px", { lineHeight: "1.4", fontWeight: "500" }],
        "code-sm": ["12px", { lineHeight: "1.4", fontWeight: "400" }]
      }
    },
  },
  plugins: [],
}
