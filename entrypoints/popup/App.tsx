// third party library imports
import { useState, useEffect } from "react";
import { StorageService } from "@/services/storage";

// component imports
import AddIcon from "@/components/icons/AddIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import BookPlusIcon from "@/components/icons/BookPlusIcon";
import LeftArrowIcon from "@/components/icons/LeftArrowIcon";

// type imports
import { Collection, TomeData } from "@/types/storage";

function App() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [resources, setResources] = useState<TomeData["resources"]>({});
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const initialize = async () => {
    const { collections, resources } = await StorageService.getData();
    setResources(resources);
    setCollections(collections);
  };

  useEffect(() => {
    initialize();
  }, []);

  const handleCreateCollection = async () => {
    const name = prompt("Name your collection:");
    if (!name) return;
    await StorageService.createCollection(name);
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

  const handleOpenResource = (url: string) => {
    chrome.tabs.create({ url });
  };

  const filteredResources =
    selectedCollection && resources[selectedCollection]
      ? resources[selectedCollection].filter((resource) =>
          resource.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  return (
    <div className="h-full bg-gray-50">
      {selectedCollection ? (
        <div className="p-4">
          <div className="flex items-center mb-4">
            <button
              onClick={() => setSelectedCollection(null)}
              className="mr-2 p-2 rounded-full hover:bg-gray-200"
            >
              <LeftArrowIcon />
            </button>
            <h1 className="text-xl font-bold">
              {collections.find((c) => c.id === selectedCollection)?.name}
            </h1>
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <SearchIcon />
          </div>

          {filteredResources.length > 0 ? (
            <ul className="space-y-2">
              {filteredResources.map((resource) => (
                <li
                  key={resource.id}
                  onClick={() => handleOpenResource(resource.url)}
                  className="p-3 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="font-medium text-blue-600 hover:underline">
                    {resource.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {resource.url}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery
                ? "No matching resources found"
                : "No resources in this collection"}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Tome</h1>
            <button
              onClick={handleCreateCollection}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-colors flex items-center"
            >
              <AddIcon />
              New Collection
            </button>
          </div>

          {collections.length > 0 ? (
            <ul className="space-y-3">
              {collections.map((collection) => (
                <li
                  key={collection.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center p-4">
                    <div
                      onClick={() => setSelectedCollection(collection.id)}
                      className="flex-1 cursor-pointer"
                    >
                      <h3 className="font-medium">{collection.name}</h3>
                      <p className="text-xs text-gray-500">
                        {resources[collection.id]?.length || 0} resources
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddResource(collection.id)}
                      className="p-2 rounded-lg transition-colors focus:outline-none hover:cursor-pointer"
                    >
                      <div className="text-blue-600 hover:text-green-800">
                        <BookPlusIcon />
                      </div>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No collections yet. Create your first collection to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
