import './responsive.css';
import React, { useState, useEffect } from "react";
import Select from "react-select";


const fontFamily = "Montserrat, sans-serif";
const orange = "#F25A26";
const bgGray = "#f6f8fa";

// Datos para el ejemplo
const ASISTENCIA_CATEGORIAS = [
  { value: "hogar", label: "Hogar" },
  { value: "vial", label: "Vial" },
  { value: "mascotas", label: "Mascotas" },
  { value: "salud", label: "Salud" },
];

const ASISTENCIAS = {
  hogar: ["Plomería", "Cambio de cristal"],
  vial: [
    "Cambio de llanta",
    "Envío de combustible",
    "Grúa por accidente",
    "Grúa por avería mecánica",
    "Cerrajería",
  ],
  mascotas: [
    "Baño de mascotas",
    "Desparasitación",
    "Cremación",
    "Cita veterinaria",
  ],
  salud: [
    "Exámenes generales",
    "Cita médica",
    "Telemedicina",
    "Examen de sangre",
  ],
};

const EXPERIENCIAS = [
  "Menos de 1 año",
  "1 año a 3 años",
  "3 años a 5 años",
  "Más de 5 años",
];

const PROVINCIAS = [
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
  "Limón",
];

const ZONAS_ATENCION_OPCIONES = [
  ...PROVINCIAS.map((p) => ({ value: p, label: p })),
  {
    value: "Todo el territorio nacional",
    label: "Todo el territorio nacional",
  },
];

interface Local {
  ubicacion: string;
  observacion: string;
  fotosGenerales: File[];
  fotosGeneralesPreview: string[];
}

interface LocalInfo {
  provincia: string;
  cantidadLocales: number;
  locales: Local[];
}

interface ZonaSeleccionada {
  zona: string;
  horario247?: boolean;
  horarioPersonalizado?: string;
}

interface Servicio {
  tipo: string;
  asistencias: string[];
  experiencia: string;
  local: "No" | "Sí";
  fotosPorAsistencia: { [asistencia: string]: File[] };
  fotosPorAsistenciaPreview: { [asistencia: string]: string[] };
  localInfo?: LocalInfo[];
  zonasSeleccionadas?: ZonaSeleccionada[];
}

const SeccionTiposAsistencia: React.FC<{
  onNext: (data: any) => void;
  onPrev: () => void;
  data?: any;
}> = ({ onNext, onPrev, data }) => {
  const [servicios, setServicios] = useState<Servicio[]>(
    data && data.servicios
      ? data.servicios
      : [
          {
            tipo: "",
            asistencias: [],
            experiencia: "",
            local: "No",
            fotosPorAsistencia: {},
            fotosPorAsistenciaPreview: {},
            localInfo: [
              {
                provincia: "",
                cantidadLocales: 1,
                locales: [
                  {
                    ubicacion: "",
                    observacion: "",
                    fotosGenerales: [],
                    fotosGeneralesPreview: [],
                  },
                ],
              },
            ],
            zonasSeleccionadas: [],
          },
        ]
  );
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (data && data.servicios) {
      setServicios(data.servicios);
    }
  }, [data]);

  // Manejar cambios generales de servicio
  const handleServicioChange = (idx: number, changes: Partial<Servicio>) => {
    setServicios((s) =>
      s.map((ser, i) => (i === idx ? { ...ser, ...changes } : ser))
    );
  };

  // Manejar cambios de tipo (limpia asistencias)
  const handleTipoChange = (idx: number, value: string) => {
    handleServicioChange(idx, {
      tipo: value,
      asistencias: [],
      fotosPorAsistencia: {},
      fotosPorAsistenciaPreview: {},
    });
  };

  // Manejar cambio en asistencias (limpia previews de asistencias quitadas)
  const handleAsistenciasChange = (idx: number, asistencias: string[]) => {
    setServicios((s) =>
      s.map((ser, i) => {
        if (i !== idx) return ser;
        const nuevasFotos = {} as { [a: string]: File[] };
        const nuevasFotosPreview = {} as { [a: string]: string[] };
        asistencias.forEach((a) => {
          nuevasFotos[a] = ser.fotosPorAsistencia?.[a] || [];
          nuevasFotosPreview[a] = ser.fotosPorAsistenciaPreview?.[a] || [];
        });
        return {
          ...ser,
          asistencias,
          fotosPorAsistencia: nuevasFotos,
          fotosPorAsistenciaPreview: nuevasFotosPreview,
        };
      })
    );
  };

  // --- AJUSTE PARA ACUMULAR IMÁGENES ---
  // Fotos por asistencia (agrega sin perder las anteriores)
  const handleFotosPorAsistencia = (
    servicioIdx: number,
    asistencia: string,
    files: FileList | null
  ) => {
    if (!files) return;
    setServicios((s) =>
      s.map((ser, i) => {
        if (i !== servicioIdx) return ser;
        const prevArchivos = ser.fotosPorAsistencia[asistencia] || [];
        const arr = [...prevArchivos, ...Array.from(files)];
        const prevPreviews = ser.fotosPorAsistenciaPreview[asistencia] || [];
        const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
        const previews = [...prevPreviews, ...newPreviews];
        return {
          ...ser,
          fotosPorAsistencia: {
            ...ser.fotosPorAsistencia,
            [asistencia]: arr,
          },
          fotosPorAsistenciaPreview: {
            ...ser.fotosPorAsistenciaPreview,
            [asistencia]: previews,
          },
        };
      })
    );
  };

  // Eliminar foto por asistencia
  const handleEliminarFotoPorAsistencia = (
    servicioIdx: number,
    asistencia: string,
    fotoIdx: number
  ) => {
    setServicios((s) =>
      s.map((ser, i) => {
        if (i !== servicioIdx) return ser;
        const arr = (ser.fotosPorAsistencia[asistencia] || []).filter(
          (_, idx) => idx !== fotoIdx
        );
        const arrPrev = (
          ser.fotosPorAsistenciaPreview[asistencia] || []
        ).filter((_, idx) => idx !== fotoIdx);
        return {
          ...ser,
          fotosPorAsistencia: {
            ...ser.fotosPorAsistencia,
            [asistencia]: arr,
          },
          fotosPorAsistenciaPreview: {
            ...ser.fotosPorAsistenciaPreview,
            [asistencia]: arrPrev,
          },
        };
      })
    );
  };

  // --- AJUSTE PARA ACUMULAR FOTOS GENERALES POR LOCAL ---
  const handleFotosGenerales = (
    servicioIdx: number,
    localIdx: number,
    files: FileList | null
  ) => {
    if (!files) return;
    setServicios((s) =>
      s.map((ser, i) => {
        if (i !== servicioIdx) return ser;
        const info = ser.localInfo ? [...ser.localInfo] : [];
        if (!info[0]) return ser;
        const prev = info[0].locales[localIdx].fotosGenerales || [];
        const arr = [...prev, ...Array.from(files)];
        const prevPreviews = info[0].locales[localIdx].fotosGeneralesPreview || [];
        const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
        const previews = [...prevPreviews, ...newPreviews];
        info[0].locales[localIdx].fotosGenerales = arr;
        info[0].locales[localIdx].fotosGeneralesPreview = previews;
        return { ...ser, localInfo: info };
      })
    );
  };

  // Eliminar foto general por local
  const handleEliminarFotoGeneral = (
    servicioIdx: number,
    localIdx: number,
    fotoIdx: number
  ) => {
    setServicios((s) =>
      s.map((ser, i) => {
        if (i !== servicioIdx) return ser;
        const info = ser.localInfo ? [...ser.localInfo] : [];
        if (!info[0]) return ser;
        const locales = info[0].locales.map((loc, j) => {
          if (j !== localIdx) return loc;
          const arr = (loc.fotosGenerales || []).filter(
            (_, idx) => idx !== fotoIdx
          );
          const arrPrev = (loc.fotosGeneralesPreview || []).filter(
            (_, idx) => idx !== fotoIdx
          );
          return {
            ...loc,
            fotosGenerales: arr,
            fotosGeneralesPreview: arrPrev,
          };
        });
        info[0].locales = locales;
        return { ...ser, localInfo: info };
      })
    );
  };

  // Manejar cambios en info de locales
  const handleLocalInfoChange = (
    servicioIdx: number,
    localInfo: LocalInfo[]
  ) => {
    handleServicioChange(servicioIdx, { localInfo });
  };

  // Manejar zonas seleccionadas
  const handleZonasSeleccionadas = (servIdx: number, zonas: any[]) => {
    setServicios((s) =>
      s.map((ser, i) =>
        i === servIdx
          ? {
              ...ser,
              zonasSeleccionadas: zonas.map((z) => ({
                zona: z.value,
              })),
            }
          : ser
      )
    );
  };

  // Manejar horario de zona
  const handleZonaHorario = (
    servIdx: number,
    zonaIdx: number,
    field: "horario247" | "horarioPersonalizado",
    value: any
  ) => {
    setServicios((s) =>
      s.map((ser, i) => {
        if (i !== servIdx) return ser;
        const zonas = [...(ser.zonasSeleccionadas || [])];
        zonas[zonaIdx] = { ...zonas[zonaIdx], [field]: value };
        return { ...ser, zonasSeleccionadas: zonas };
      })
    );
  };

  // Validar: mínimo 1 foto por asistencia y 5 por local si corresponde
  const puedeAvanzar = () => {
    for (const serv of servicios) {
      // Validación asistencias
      for (const asistencia of serv.asistencias) {
        if (
          !serv.fotosPorAsistencia[asistencia] ||
          serv.fotosPorAsistencia[asistencia].length < 1
        ) {
          return false;
        }
      }
      // Validación locales
      if (serv.local === "Sí" && serv.localInfo && serv.localInfo[0]) {
        for (const loc of serv.localInfo[0].locales) {
          if (!loc.fotosGenerales || loc.fotosGenerales.length < 5) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // Componente locales
  const LocalesSection: React.FC<{
    servicioIdx: number;
    localInfo?: LocalInfo[];
    onChange: (li: LocalInfo[]) => void;
    tipoAsistencia: string;
  }> = ({ servicioIdx, localInfo, onChange, tipoAsistencia }) => {
    const info = localInfo?.[0] || {
      provincia: "",
      cantidadLocales: 1,
      locales: [
        {
          ubicacion: "",
          observacion: "",
          fotosGenerales: [],
          fotosGeneralesPreview: [],
        },
      ],
    };
    // Provincia y cantidad
    const handleProvincia = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange([{ ...info, provincia: e.target.value }]);
    };
    const handleCantidadLocales = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = Math.max(1, Number(e.target.value) || 1);
      let locales = [...info.locales];
      if (val > locales.length) {
        for (let i = locales.length; i < val; i++)
          locales.push({
            ubicacion: "",
            observacion: "",
            fotosGenerales: [],
            fotosGeneralesPreview: [],
          });
      } else {
        locales = locales.slice(0, val);
      }
      onChange([{ ...info, cantidadLocales: val, locales }]);
    };

    const handleLocalField = (
      localIdx: number,
      campo: keyof Local,
      value: string | FileList
    ) => {
      let locales = [...info.locales];
      if (campo === "fotosGenerales" && value instanceof FileList) {
        // Acumular imágenes generales también aquí
        const prev = locales[localIdx].fotosGenerales || [];
        const arr = [...prev, ...Array.from(value)];
        const prevPreviews = locales[localIdx].fotosGeneralesPreview || [];
        const newPreviews = Array.from(value).map((f) => URL.createObjectURL(f));
        const previews = [...prevPreviews, ...newPreviews];
        locales[localIdx].fotosGenerales = arr;
        locales[localIdx].fotosGeneralesPreview = previews;
      } else {
        (locales[localIdx] as any)[campo] = value;
      }
      onChange([{ ...info, locales }]);
    };

    return (
      <div
        style={{
          background: "#f9fdfc",
          border: "1.5px solid #d2efec",
          borderRadius: "13px",
          padding: "20px",
          marginTop: 16,
          marginBottom: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: "1 1 150px", minWidth: 220 }}>
            <label className="label-connect">
              Provincia *
              <select
                value={info.provincia}
                onChange={handleProvincia}
                style={inputStyleSelect}
                required
              >
                <option value="">Seleccione provincia</option>
                {PROVINCIAS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
          </div>
          <div style={{ flex: "1 1 180px", minWidth: 180 }}>
            <label className="label-connect">
              Cantidad de locales *
              <input
                type="number"
                min={1}
                value={info.cantidadLocales || 1}
                onChange={handleCantidadLocales}
                style={inputStyle}
                required
              />
            </label>
          </div>
        </div>
        {info.locales.map((loc, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid #ececec",
              borderRadius: "12px",
              marginTop: 20,
              marginBottom: 10,
              padding: "18px",
            }}
          >
            <span
              style={{ color: orange, fontWeight: 700, fontSize: "1.08rem" }}
            >
              Local #{i + 1} ({tipoAsistencia})
            </span>
            <label className="label-connect" style={{ marginTop: 12 }}>
              Ubicación
              <input
                type="text"
                placeholder="Dirección exacta o referencia"
                style={inputStyle}
                value={loc.ubicacion}
                onChange={(e) =>
                  handleLocalField(i, "ubicacion", e.target.value)
                }
              />
            </label>
            <label className="label-connect" style={{ marginTop: 10 }}>
              Observación
              <input
                type="text"
                style={inputStyle}
                value={loc.observacion}
                onChange={(e) =>
                  handleLocalField(i, "observacion", e.target.value)
                }
              />
            </label>
            <label className="label-connect" style={{ marginTop: 10 }}>
              Fotografías generales (mínimo 5)
              <input
                type="file"
                multiple
                accept="image/*"
                style={{ display: "block", marginTop: 6 }}
                onChange={(e) =>
                  handleFotosGenerales(servicioIdx, i, e.target.files!)
                }
              />
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 6,
                  flexWrap: "wrap",
                }}
              >
                {loc.fotosGeneralesPreview?.map((src, j) => (
                  <div key={j} style={{ position: "relative" }}>
                    <img
                      src={src}
                      alt="miniatura"
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid #d1d1d1",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleEliminarFotoGeneral(servicioIdx, i, j)
                      }
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -8,
                        border: "none",
                        background: "#f44",
                        color: "#fff",
                        borderRadius: "50%",
                        width: 19,
                        height: 19,
                        cursor: "pointer",
                        fontSize: "1em",
                        fontWeight: 700,
                        boxShadow: "0 0 4px #c9c",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {touched &&
                (!loc.fotosGenerales || loc.fotosGenerales.length < 5) && (
                  <span style={{ color: "#D62B25", fontWeight: 700 }}>
                    Debes adjuntar al menos 5 fotografías por local.
                  </span>
                )}
            </label>
          </div>
        ))}
      </div>
    );
  };

  // Render principal (sin cambios)
  return (
    <form
      style={{
        maxWidth: 1100,
        margin: "32px auto",
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.09)",
        padding: "38px",
        fontFamily,
        border: `2px solid ${orange}`,
      }}
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (puedeAvanzar()) {
          onNext({ servicios });
        }
      }}
    >
      <h2
        style={{
          color: orange,
          fontWeight: 800,
          fontSize: "2.3rem",
          marginBottom: 12,
          letterSpacing: "-1.5px",
        }}
      >
        Tipos de Asistencia
      </h2>
      <div
        style={{
          borderRadius: 18,
          border: "1.5px solid #e3ecf3",
          boxShadow: "0 1px 4px #e3e6ec38",
          padding: 18,
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            fontWeight: 800,
            color: orange,
            fontSize: "1.15rem",
            background: "#fff8f5",
            borderRadius: "14px 14px 0 0",
            padding: "18px 0",
            marginBottom: 10,
            gap: 12,
            letterSpacing: "-0.5px",
          }}
        >
          <div style={{ flex: 1, textAlign: "center" }}>Tipo de Asistencia</div>
          <div style={{ flex: 2, textAlign: "center" }}>
            Asistencias Brindadas
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>Experiencia</div>
          <div style={{ flex: 2, textAlign: "center" }}>
            Fotografías (mín. 1)
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            Asistencia en Local
          </div>
          <div style={{ width: 100 }}></div>
        </div>
        {servicios.map((serv, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 10,
              padding: "18px 0",
              borderBottom:
                idx < servicios.length - 1 ? "1px solid #e7eaf1" : undefined,
            }}
          >
            {/* Tipo de Asistencia */}
            <div style={{ flex: 1 }}>
              <select
                value={serv.tipo}
                style={inputStyleSelect}
                onChange={(e) => handleTipoChange(idx, e.target.value)}
              >
                <option value="">Seleccione</option>
                {ASISTENCIA_CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Asistencias Brindadas */}
            <div style={{ flex: 2, minWidth: 250 }}>
              <Select
                isMulti
                options={(
                  ASISTENCIAS[serv.tipo as keyof typeof ASISTENCIAS] || []
                ).map((op) => ({
                  value: op,
                  label: op,
                }))}
                value={serv.asistencias.map((a) => ({ value: a, label: a }))}
                onChange={(options) => {
                  const values = (options as any[]).map((opt) => opt.value);
                  handleAsistenciasChange(idx, values);
                }}
                placeholder="Selecciona una o varias asistencias"
                closeMenuOnSelect={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: orange,
                    boxShadow: "none",
                    "&:hover": { borderColor: orange },
                    minHeight: 46,
                    fontFamily,
                    fontWeight: 600,
                    fontSize: "1.07rem",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: orange,
                    color: "#fff",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#fff",
                    fontWeight: 700,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#fff",
                    ":hover": { backgroundColor: "#f44", color: "#fff" },
                  }),
                  option: (base, { isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected ? orange : "#fff",
                    color: isSelected ? "#fff" : orange,
                    fontWeight: isSelected ? 700 : 600,
                    fontSize: "1.06rem",
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 10,
                  colors: {
                    ...theme.colors,
                    primary25: "#FFF5F0",
                    primary: orange,
                  },
                })}
              />
              <span
                style={{
                  fontSize: "0.93em",
                  color: "#959595",
                  marginTop: 3,
                  display: "block",
                  textAlign: "center",
                }}
              >
                Selecciona una o varias asistencias
              </span>
            </div>
            {/* Experiencia */}
            <div style={{ flex: 1 }}>
              <select
                value={serv.experiencia}
                style={inputStyleSelect}
                onChange={(e) =>
                  handleServicioChange(idx, { experiencia: e.target.value })
                }
              >
                <option value="">Seleccione</option>
                {EXPERIENCIAS.map((exp) => (
                  <option key={exp}>{exp}</option>
                ))}
              </select>
            </div>
            {/* Fotografías por asistencia (SIEMPRE visible) */}
            <div style={{ flex: 2 }}>
              {serv.asistencias.map((asistencia) => (
                <div key={asistencia} style={{ marginBottom: 12 }}>
                  <strong style={{ color: orange }}>
                    Fotografías para: {asistencia} (mínimo 1)
                  </strong>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      handleFotosPorAsistencia(idx, asistencia, e.target.files)
                    }
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    {(serv.fotosPorAsistenciaPreview[asistencia] || []).map(
                      (src, i) => (
                        <div key={i} style={{ position: "relative" }}>
                          <img
                            src={src}
                            alt="miniatura"
                            style={{
                              width: 54,
                              height: 54,
                              borderRadius: 8,
                              objectFit: "cover",
                              border: "1px solid #b8b8b8",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleEliminarFotoPorAsistencia(
                                idx,
                                asistencia,
                                i
                              )
                            }
                            style={{
                              position: "absolute",
                              top: -6,
                              right: -8,
                              border: "none",
                              background: "#f44",
                              color: "#fff",
                              borderRadius: "50%",
                              width: 19,
                              height: 19,
                              cursor: "pointer",
                              fontSize: "1em",
                              fontWeight: 700,
                              boxShadow: "0 0 4px #c9c",
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>
                  {touched &&
                    (!serv.fotosPorAsistencia[asistencia] ||
                      serv.fotosPorAsistencia[asistencia].length < 1) && (
                      <span style={{ color: "#D62B25", fontWeight: 700 }}>
                        Falta fotografía para {asistencia} (mínimo 1)
                      </span>
                    )}
                </div>
              ))}
            </div>
            {/* Asistencia en local */}
            <div style={{ flex: 1 }}>
              <select
                value={serv.local}
                style={inputStyleSelect}
                onChange={(e) =>
                  handleServicioChange(idx, {
                    local: e.target.value as "No" | "Sí",
                  })
                }
              >
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>
            {/* Eliminar Servicio */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 100,
              }}
            >
              {servicios.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setServicios((s) => s.filter((_, i) => i !== idx))
                  }
                  style={btnEliminar}
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
        {/* Campos de locales si aplica */}
        {servicios.map(
          (serv, idx) =>
            serv.local === "Sí" && (
              <LocalesSection
                key={`local-${idx}`}
                servicioIdx={idx}
                localInfo={serv.localInfo}
                onChange={(li) => handleLocalInfoChange(idx, li)}
                tipoAsistencia={serv.tipo}
              />
            )
        )}
        {/* Zona de atención y horario por servicio */}
        {servicios.map((serv, idx) => (
          <div
            key={`zonas-${idx}`}
            style={{
              background: "#fcf7f3",
              borderRadius: 18,
              border: "1.5px solid #fbe4d5",
              padding: "22px 18px 8px 18px",
              margin: "18px 0 0 0",
            }}
          >
            <label
              style={{
                color: orange,
                fontWeight: 700,
                fontSize: "1.38rem",
                marginBottom: 8,
              }}
            >
              Zona de atención{" "}
              <span
                style={{
                  color: "#282828",
                  fontWeight: 400,
                  fontSize: "1.12rem",
                }}
              >
                (
                {ASISTENCIA_CATEGORIAS.find((c) => c.value === serv.tipo)
                  ?.label || ""}
                )
              </span>
            </label>
            <Select
              isMulti
              options={ZONAS_ATENCION_OPCIONES}
              value={
                serv.zonasSeleccionadas?.map((z) => ({
                  value: z.zona,
                  label: z.zona,
                })) || []
              }
              onChange={(options) =>
                handleZonasSeleccionadas(
                  idx,
                  options as { value: string; label: string }[]
                )
              }
              placeholder="Seleccione una o varias zonas"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: orange,
                  minHeight: 44,
                  fontSize: "1.06rem",
                  fontWeight: 600,
                }),
              }}
              closeMenuOnSelect={false}
            />
            {/* Horario por zona */}
            {(serv.zonasSeleccionadas || []).map((zona, zonaIdx) => (
              <div key={zona.zona} style={{ margin: "10px 0 20px 0" }}>
                <strong style={{ color: orange }}>{zona.zona}</strong>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    marginTop: 7,
                  }}
                >
                  <select
                    value={
                      zona.horario247 === undefined
                        ? ""
                        : zona.horario247
                        ? "24/7"
                        : "personalizado"
                    }
                    onChange={(e) =>
                      handleZonaHorario(
                        idx,
                        zonaIdx,
                        "horario247",
                        e.target.value === "24/7"
                      )
                    }
                    style={inputStyleSelect}
                  >
                    <option value="">Seleccione horario</option>
                    <option value="24/7">24/7</option>
                    <option value="personalizado">Personalizado</option>
                  </select>
                  {!zona.horario247 && zona.horario247 !== undefined && (
                    <input
                      type="text"
                      placeholder="Ej: Lunes a Viernes 8am a 5pm"
                      value={zona.horarioPersonalizado || ""}
                      onChange={(e) =>
                        handleZonaHorario(
                          idx,
                          zonaIdx,
                          "horarioPersonalizado",
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Botón Agregar servicio debajo de la lista */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          marginTop: 12,
        }}
      >
        <button
          type="button"
          style={btnAgregar}
          onClick={() =>
            setServicios((s) => [
              ...s,
              {
                tipo: "",
                asistencias: [],
                experiencia: "",
                local: "No",
                fotosPorAsistencia: {},
                fotosPorAsistenciaPreview: {},
                localInfo: [
                  {
                    provincia: "",
                    cantidadLocales: 1,
                    locales: [
                      {
                        ubicacion: "",
                        observacion: "",
                        fotosGenerales: [],
                        fotosGeneralesPreview: [],
                      },
                    ],
                  },
                ],
                zonasSeleccionadas: [],
              },
            ])
          }
        >
          + Agregar servicio
        </button>
      </div>
      {/* Acciones navegación alineadas a la derecha */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: 36,
          gap: 16,
        }}
      >
        <button type="button" style={btnBack} onClick={onPrev}>
          Anterior
        </button>
        <button
          type="submit"
          style={{
            ...btnNext,
            opacity: puedeAvanzar() ? 1 : 0.6,
            cursor: puedeAvanzar() ? "pointer" : "not-allowed",
          }}
          disabled={!puedeAvanzar()}
        >
          Siguiente
        </button>
      </div>
      <style>
        {`
        .input-connect:focus {
          outline: 2px solid ${orange};
          border-color: ${orange};
          background: #fff8f5;
        }
        .label-connect {
          color: ${orange};
          font-weight: 600;
          font-size: 1.07rem;
          margin-bottom: 9px;
          display: block;
        }
        `}
      </style>
    </form>
  );
};

// Estilos base
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px",
  marginTop: 8,
  borderRadius: "9px",
  border: "1.5px solid #d4dbe5",
  fontSize: "1rem",
  fontFamily,
  background: "#f8fbfd",
  transition: "border 0.18s, background 0.18s",
};
const inputStyleSelect: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
};
const btnNext: React.CSSProperties = {
  background: orange,
  color: "#fff",
  fontWeight: 700,
  fontSize: "1.13rem",
  border: "none",
  borderRadius: "13px",
  padding: "14px 44px",
  fontFamily,
  boxShadow: "0 2px 8px #F25A2633",
  cursor: "pointer",
  marginLeft: 8,
  transition: "background 0.16s",
};
const btnBack: React.CSSProperties = {
  background: "#fff",
  color: orange,
  fontWeight: 700,
  fontSize: "1.12rem",
  border: `2px solid ${orange}`,
  borderRadius: "13px",
  padding: "14px 44px",
  fontFamily,
  marginRight: 8,
  cursor: "pointer",
  transition: "background 0.16s",
};
const btnAgregar: React.CSSProperties = {
  background: "#fff",
  color: orange,
  fontWeight: 700,
  fontSize: "1.08rem",
  border: `2px solid ${orange}`,
  borderRadius: "13px",
  padding: "13px 28px",
  fontFamily,
  marginLeft: 8,
  cursor: "pointer",
};
const btnEliminar: React.CSSProperties = {
  background: "#fff",
  color: "#D62B25",
  fontWeight: 700,
  border: "1.5px solid #D62B25",
  borderRadius: "10px",
  padding: "8px 18px",
  fontSize: "1.02rem",
  cursor: "pointer",
  marginTop: 4,
  marginBottom: 4,
};

export default SeccionTiposAsistencia;
