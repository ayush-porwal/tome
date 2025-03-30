import { useState, useEffect } from "react";
import { StorageService } from "@/services/storage";
import { TomeData } from "@/types/storage";

function App() {
  const [collections, setCollections] = useState<TomeData["collections"]>([]);

  const initialize = async () => {
    const { collections } = await StorageService.getData();
    setCollections(collections);
  };

  useEffect(() => {
    initialize();
  }, []);

  const handleCreateCollection = async () => {
    await StorageService.createCollection("Something");
    initialize();
  };

  const handleAddResource = async (id: string) => {
    const [currentTab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    await StorageService.addResource(id, currentTab);
    initialize();
  };

  return (
    <>
      <div className="flex justify-between items-center p-2">
        <h1 className="text-xl font-bold">Tome</h1>
        <button
          onClick={handleCreateCollection}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Create Collection
        </button>
      </div>
      <ul className="mt-4 space-y-2 p-2">
        {collections.map((collection) => (
          <li
            key={collection.id}
            className="flex justify-between items-center p-2 border rounded"
          >
            <p>{collection.name}</p>
            <button
              onClick={() => handleAddResource(collection.id)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
