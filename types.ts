
export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  scatterPos: [number, number, number];
  treePos: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  color: string;
}

export interface AiResponse {
  greeting: string;
  mood: string;
}
