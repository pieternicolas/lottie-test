import { DragEvent, useMemo, useState } from 'react';

import { ProjectAnimation } from '~/store/project';

type LayerListProps = {
  layers: ProjectAnimation['layers'];
  onUpdateLayers: (layers: ProjectAnimation['layers']) => void;
};

const LayerList = ({ layers, onUpdateLayers }: LayerListProps) => {
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

  const sortedLayers = useMemo(
    () => layers.sort((a, b) => a.ind - b.ind),
    [layers]
  );

  return (
    <div className="flex flex-col gap-1">
      {sortedLayers.map((layer, index) => (
        <div
          key={index}
          className="p-2 rounded hover:bg-blue-100 hover:cursor-pointer"
          draggable="true"
          onDragStart={(e) => handleDragStart(e, layer)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(layer)}
        >
          <p>{layer.nm}</p>
        </div>
      ))}
    </div>
  );
};

export default LayerList;
