import { useState } from 'react';

export const useSelection = <T>(initialItems: T[]) => {
  const [selected, setSelected] = useState<T[]>(initialItems);

  const handleSelect = (item: T) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return [selected, handleSelect, setSelected] as const;
};
