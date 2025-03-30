import { TomeData } from "@/types/storage";

export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason === "install") {
      await storage.setItem<TomeData>("sync:tomeData", {
        resources: {},
        collections: [],
      });
    }
  });
});
