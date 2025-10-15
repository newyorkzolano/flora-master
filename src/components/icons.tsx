'use client';

import {
  Leaf,
  TreePine,
  Upload,
  FileJson,
  Check,
  X,
  Bot,
  BrainCircuit,
  Image as ImageIcon,
  Plus,
} from 'lucide-react';
import React from 'react';

export const Icons = {
  Leaf,
  Tree: TreePine,
  Upload,
  FileJson,
  Check,
  X,
  Bot,
  BrainCircuit,
  Image: ImageIcon,
  Plus,
  Bud: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Forma base del capullo */}
      <path d="M12 2C7 2 4 5 4 12c0 3 1 6 4 8s5 2 8 0c3-2 4-5 4-8 0-7-3-10-8-10z" />
      {/* Líneas internas para dar la sensación de pétalos cerrados */}
      <path d="M12 2c-1 2-1 4-1 6" />
      <path d="M12 2c1 2 1 4 1 6" />
      <path d="M7 12h10" />
      <path d="M4 12c1 1 2 2 4 2" />
      <path d="M20 12c-1 1-2 2-4 2" />
    </svg>
  ),
  Flower: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Centro de la flor */}
      <circle cx="12" cy="12" r="4" />
      {/* Pétalos */}
      <path d="M12 2c-3 0-5 2-5 5 0 3 2 5 5 5s5-2 5-5c0-3-2-5-5-5z" /> {/* Pétalo superior */}
      <path d="M2 12c0-3 2-5 5-5 3 0 5 2 5 5s-2 5-5 5c-3 0-5-2-5-5z" /> {/* Pétalo izquierdo */}
      <path d="M22 12c0-3-2-5-5-5-3 0-5 2-5 5s2 5 5 5c3 0 5-2 5-5z" /> {/* Pétalo derecho */}
      <path d="M12 22c-3 0-5-2-5-5 0-3 2-5 5-5s5 2 5 5c0 3-2 5-5 5z" /> {/* Pétalo inferior */}
      {/* Pequeños pétalos diagonales para completar la forma */}
      <path d="M19.07 4.93c-2.5-2.5-6.5-2.5-9 0" />
      <path d="M4.93 19.07c2.5 2.5 6.5 2.5 9 0" />
      <path d="M19.07 19.07c-2.5 2.5-6.5 2.5-9 0" />
      <path d="M4.93 4.93c2.5-2.5 6.5-2.5 9 0" />
    </svg>
  ),
};
