/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Citizen theme (Green shades)
        'citizen-primary': '#10B981',
        'citizen-secondary': '#059669',
        'citizen-accent': '#047857',
        
        // Organization theme (Blue shades)
        'org-primary': '#3B82F6',
        'org-secondary': '#2563EB',
        'org-accent': '#1D4ED8',
        
        // Admin theme (Purple shades)
        'admin-primary': '#8B5CF6',
        'admin-secondary': '#7C3AED',
        'admin-accent': '#6D28D9',
      },
      fontFamily: {
        sans: ['Inter var', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
