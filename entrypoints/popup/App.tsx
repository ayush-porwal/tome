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

  const handleCreateCollection = () => {
    StorageService.createCollection("Something");
  };

  const handleAddResource = async (id: string) => {
    const [currentTab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    StorageService.addResource(id, currentTab);
  };

  return (
    <>
      <div className="flex">
        <h1>Tome</h1>
        <button onClick={handleCreateCollection}>Create Collection</button>
      </div>
      <ul>
        {collections.map((collection) => (
          <li className="flex justify-between">
            <p>{collection.name}</p>
            <button onClick={() => handleAddResource(collection.id)}>
              Add
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
