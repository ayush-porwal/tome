import { storage } from "wxt/storage";

import { Collection, TomeData } from "@/types/storage";

export class StorageService {
  static async getData(): Promise<TomeData> {
    const tomeData = await storage.getItem<TomeData>("sync:tomeData");

    if (!tomeData) {
      return {
        resources: {},
        collections: [],
      } as TomeData;
    }

    return tomeData;
  }

  static async createCollection(name: string): Promise<Collection> {
    const tomeData = await this.getData();

    const newCollection: Collection = {
      name,
      id: crypto.randomUUID(),
      createdAt: new Date().toUTCString(),
    };

    tomeData.collections?.push(newCollection);
    tomeData.resources[newCollection.id] = [];

    await storage.setItem("sync:tomeData", tomeData);

    return newCollection;
  }

  static async addResource(collectionId: string, tab: chrome.tabs.Tab) {
    const tomeData = await this.getData();

    if (!tab.url || !tab.title) {
      return;
    }

    const newResource = {
      url: tab.url,
      name: tab.title,
      id: crypto.randomUUID(),
      createdAt: new Date().toUTCString(),
    };

    tomeData.resources[collectionId].push(newResource);

    await storage.setItem("sync:tomeData", tomeData);
  }
}
