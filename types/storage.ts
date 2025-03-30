export interface Collection {
  id: string;
  name: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  url: string;
  name: string;
  createdAt: string;
}

export interface TomeData {
  collections: Collection[];
  resources: Record<string, Resource[]>;
}
