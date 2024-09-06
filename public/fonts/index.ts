import { Path } from 'three';

export const typeFonts = [
  {
    family: 'Nunito Sans',
    path: 'fonts/Nunito_Sans_10pt_ExtraBold_Regular.json',
  },
  {
    family: 'Helvetiker',
    path: 'fonts/helvetiker_regular.typeface.json',
  },
] as const;

export type JsonFont = (typeof typeFonts)[number];
