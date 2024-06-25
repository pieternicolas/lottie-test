import clsx from 'clsx';
import { DragEvent, useEffect, useMemo, useState } from 'react';

import { ProjectAnimation } from '~/store/project';

type LayerListProps = {
  layers: ProjectAnimation['layers'];
  onUpdateLayers: (layers: ProjectAnimation['layers']) => void;
};

const LayerList = ({ layers, onUpdateLayers }: LayerListProps) => {
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [hiddenLayers, setHiddenLayers] = useState<string[]>([]);
  const [draggingItem, setDraggingItem] = useState<
    ProjectAnimation['layers'][0] | null
  >(null);

  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    item: ProjectAnimation['layers'][0]
  ) => {
    setDraggingItem(item);
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  const handleDrop = (targetItem: ProjectAnimation['layers'][0]) => {
    if (!draggingItem) return;

    const currentIndex = layers.indexOf(draggingItem);
    const targetIndex = layers.indexOf(targetItem);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const newArray = layers.slice();
      const removedItem = newArray.splice(currentIndex, 1)[0];
      newArray.splice(targetIndex, 0, removedItem);

      onUpdateLayers(
        newArray.map((item, index) => ({ ...item, ind: index + 1 }))
      );
    }
  };

  const handleSelectLayer = (layerName: string) => {
    if (selectedLayers.includes(layerName)) {
      setSelectedLayers(selectedLayers.filter((l) => l !== layerName));
    } else {
      setSelectedLayers([...selectedLayers, layerName]);
    }
  };

  const handleClearSelectedLayers = () => {
    if (confirm('Are you sure you want to clear all selected layers?')) {
      onUpdateLayers(layers.filter((l) => !selectedLayers.includes(l.nm)));
    }
  };

  const handleToggleHiddenLayer = (layerName: string) => {
    onUpdateLayers(
      layers.map((l) => {
        if (l.nm === layerName) {
          return { ...l, hd: !l.hd };
        }
        return l;
      })
    );
  };

  useEffect(() => {
    setHiddenLayers(layers.filter((l) => l.hd).map((l) => l.nm));
  }, [layers]);

  const sortedLayers = useMemo(
    () => layers.sort((a, b) => a.ind - b.ind),
    [layers]
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold mb-2">Layers</p>

        {selectedLayers.length > 0 && (
          <span
            className="font-bold text-red-700 cursor-pointer"
            onClick={handleClearSelectedLayers}
          >
            &#10005;
          </span>
        )}
      </div>

      {sortedLayers.map((layer, index) => (
        <div
          key={index}
          className={clsx(
            'p-2 rounded hover:bg-blue-100 hover:cursor-pointer flex justify-between items-center',
            selectedLayers.includes(layer.nm) ? 'bg-green-100' : ''
          )}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, layer)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(layer)}
          onClick={() => handleSelectLayer(layer.nm)}
        >
          <p className="whitespace-nowrap overflow-hidden text-ellipsis">
            {layer.nm}
          </p>

          <div className="flex gap-1">
            {selectedLayers.includes(layer.nm) && <span>&#10003;</span>}
            {hiddenLayers.includes(layer.nm) ? (
              <span
                className="hover:text-green-500 font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleHiddenLayer(layer.nm);
                }}
              >
                &#8722;
              </span>
            ) : (
              <span
                className="hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleHiddenLayer(layer.nm);
                }}
              >
                &#9788;
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LayerList;
