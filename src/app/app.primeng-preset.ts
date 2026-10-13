import { definePreset } from '@primeuix/styled';
import Aura from '@primeuix/themes/aura';

// Preset personalizzato PrimeNG
export const KomixyPreset = definePreset(Aura, {
  borderRadius: {
    none: '0',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px', // Il tuo valore di riferimento principale
    '2xl': '32px',
    '3xl': '48px',
    full: '9999px', // Arrotondamento completo (cerchio o pillola)
  },
  primitive: {
    violet: {
      50: '#FCFAFF',
      100: '#F5F0FF',
      200: 'E7DBFF',
      300: '#D0BCFF',
      400: '#B89BFF',
      500: '#A078FF',
      600: '#8455E0',
      700: '#6730C2',
      800: '#4D109E',
      900: '#340080',
      950: '#1F004D',
    },
    neutral: {
      50: '#FCFBFC',
      100: '#F8F7FA',
      200: '#F0EDF4',
      300: '#E7E3ED',
      400: '#DCD6E5',
      500: '#CBC3D7',
      600: '#A99EB9', // Tonalità intermedia di transizione
      700: '#837694', // Più scuro, ideale per bordi o testi secondari
      800: '#5C506D', // Grigio/viola scuro
      900: '#382D47', // Molto scuro
      950: '#22192E', // Profondo e scurissimo, ideale per sfondi o contrasti accentuati
    },
  },
  semantic: {
    primary: {
      50: '{violet.50}',
      100: '{violet.100}',
      200: '{violet.200}',
      300: '{violet.300}',
      400: '{violet.400}',
      500: '{violet.500}',
      600: '{violet.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}',
    },
    colorScheme: {
      dark: {
        surface: {
          50: '#FAFAFC',
          100: '#F6F6F8',
          200: '#E9E9EE',
          300: '#D6D6DE',
          400: '#B8B8C6',
          500: '#8E8FA3',
          600: '#5E5F73',
          700: '#494454',
          800: '#2C2832',
          900: '#1B1F2D',
          950: '#0E1017',
        },

        primary: {
          color: '{primary.500}',
          contrastColor: '{surface.800}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
      },
    },
  },
  components: {
    tag: {
      root: {
        fontSize: '0.75rem',
        fontWeight: '500',
      },
    },
  },
});
