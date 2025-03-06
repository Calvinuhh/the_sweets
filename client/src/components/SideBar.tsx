import { ChangeEvent } from "react";

interface SideBarProps {
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  sortOrder: "ASC" | "DESC" | "";
  setSortOrder: (order: "ASC" | "DESC" | "") => void;
}

const SideBar = ({
  selectedTypes,
  setSelectedTypes,
  sortOrder,
  setSortOrder,
}: SideBarProps) => {
  const dessertTypes = [
    { value: "torta", label: "Tortas" },
    { value: "postre_frio", label: "Postres Fríos" },
    { value: "rollo", label: "Rollos" },
    { value: "galleta", label: "Galletas" },
  ];

  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (selectedTypes.includes(value)) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes([value]);
    }
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "ASC" | "DESC" | "");
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg w-[300px]">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Filtros</h3>

      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Tipo de Postre</h4>
        {dessertTypes.map((type) => (
          <label
            key={type.value}
            className="flex items-center gap-2 cursor-pointer mb-2"
          >
            <input
              type="checkbox"
              value={type.value}
              checked={selectedTypes.includes(type.value)}
              onChange={handleTypeChange}
              className="w-4 h-4"
            />
            <span>{type.label}</span>
          </label>
        ))}
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-2">Ordenar por Precio</h4>
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Seleccionar</option>
          <option value="ASC">Menor a Mayor Precio</option>
          <option value="DESC">Mayor a Menor Precio</option>
        </select>
      </div>
    </div>
  );
};

export default SideBar;
