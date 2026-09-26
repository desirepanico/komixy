import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/styled';

// TEMA dell'app
export const KomixyPreset = definePreset(Aura, {
  primitive: {
    // borderRadius: {
    //   none: '0',
    //   xs: '2px',
    //   sm: '4px',
    //   md: '6px',
    //   lg: '8px',
    //   xl: '12px',
    // },
    // fuchsia: {
    //   50: '#fdf4ff',
    //   100: '#fae8ff',
    //   200: '#f5d0fe',
    //   300: '#f0abfc',
    //   400: '#e879f9',
    //   500: '#d946ef',
    //   600: '#c026d3',
    //   700: '#a21caf',
    //   800: '#86198f',
    //   900: '#701a75',
    //   950: '#4a044e',
    // },
    violet: {
      100: '#F5F0FF',
      // 200: '#f5d0fe',
      // 300: '#f0abfc',
      // 400: '#e879f9',
      // 500: '#d946ef',
      // 600: '#c026d3',
      // 700: '#a21caf',
      // 800: '#86198f',
      // 900: '#701a75',
    },
  },
  semantic: {
    primary: {
      50: '{fuchsia.50}',
      100: '{fuchsia.100}',
      200: '{fuchsia.200}',
      300: '{fuchsia.300}',
      400: '{fuchsia.400}',
      500: '{fuchsia.500}',
      600: '{fuchsia.600}',
      700: '{fuchsia.700}',
      800: '{fuchsia.800}',
      900: '{fuchsia.900}',
      950: '{fuchsia.950}',
    },
    colorScheme: {
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f8f8f9',
          100: '#f1f1f2',
          200: '#e3e3e5',
          300: '#c9c9cc',
          400: '#a1a1a6',
          500: '#79797f',
          600: '#5c5c62',
          700: '#414146',
          800: '#29292e',
          900: '#131316',
          950: '#08080a',
        },
        primary: {
          color: '{fuchsia.400}',
          contrastColor: '{surface.900}',
          hoverColor: '{fuchsia.300}',
          activeColor: '{fuchsia.200}',
        },
      },
    },
  },
});
