// 1. Componente completo: UbicacionSelect.tsx

import React, { useEffect, useState } from "react";
import ubicaciones from "./cr_ubicaciones.json"; // Asegúrate de tener este JSON cargado en src

interface Props {
  onChange: (data: {
    provincia: string;
    canton: string;
    distrito: string;
  }) => void;
  initial?: { provincia?: string; canton?: string; distrito?: string };
}

const UbicacionSelect: React.FC<Props> = ({ onChange, initial }) => {
  const [provincia, setProvincia] = useState(initial?.provincia || "");
  const [canton, setCanton] = useState(initial?.canton || "");
  const [distrito, setDistrito] = useState(initial?.distrito || "");

  const [cantonesDisponibles, setCantonesDisponibles] = useState<string[]>([]);
  const [distritosDisponibles, setDistritosDisponibles] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (provincia) {
      const cantones = Object.keys(ubicaciones[provincia] || {});
      setCantonesDisponibles(cantones);
      if (!cantones.includes(canton)) setCanton("");
    } else {
      setCantonesDisponibles([]);
      setCanton("");
    }
    setDistrito("");
  }, [provincia]);

  useEffect(() => {
    if (provincia && canton) {
      const distritos = ubicaciones[provincia]?.[canton] || [];
      setDistritosDisponibles(distritos);
      if (!distritos.includes(distrito)) setDistrito("");
    } else {
      setDistritosDisponibles([]);
      setDistrito("");
    }
  }, [canton]);

  useEffect(() => {
    if (provincia && canton && distrito) {
      onChange({ provincia, canton, distrito });
    }
  }, [provincia, canton, distrito]);

  return (
    <div
      style={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "1fr 1fr 1fr",
      }}
    >
      <div>
        <label>Provincia</label>
        <select
          value={provincia}
          onChange={(e) => setProvincia(e.target.value)}
        >
          <option value="">Seleccione provincia</option>
          {Object.keys(ubicaciones).map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Cantón</label>
        <select
          value={canton}
          onChange={(e) => setCanton(e.target.value)}
          disabled={!provincia}
        >
          <option value="">Seleccione cantón</option>
          {cantonesDisponibles.map((cant) => (
            <option key={cant} value={cant}>
              {cant}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Distrito</label>
        <select
          value={distrito}
          onChange={(e) => setDistrito(e.target.value)}
          disabled={!canton}
        >
          <option value="">Seleccione distrito</option>
          {distritosDisponibles.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UbicacionSelect;
