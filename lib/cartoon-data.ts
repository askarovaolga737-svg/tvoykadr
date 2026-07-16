export interface CartoonTemplateMeta {
  id: string;
  faceCenterX: number;
  faceCenterY: number;
  faceRadius: number;
  bodyColor: string;
  secondaryColor: string;
}

export const cartoonTemplateMetadata: CartoonTemplateMeta[] = [
  {
    id: "mock-cartoon-1",
    faceCenterX: 0.5,
    faceCenterY: 0.22,
    faceRadius: 0.1,
    bodyColor: "#dc2626",
    secondaryColor: "#2563eb",
  },
  {
    id: "mock-cartoon-2",
    faceCenterX: 0.5,
    faceCenterY: 0.2,
    faceRadius: 0.09,
    bodyColor: "#d946ef",
    secondaryColor: "#fbbf24",
  },
  {
    id: "mock-cartoon-3",
    faceCenterX: 0.5,
    faceCenterY: 0.28,
    faceRadius: 0.09,
    bodyColor: "#e2e8f0",
    secondaryColor: "#475569",
  },
];
