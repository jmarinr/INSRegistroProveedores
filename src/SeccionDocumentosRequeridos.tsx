import './responsive.css';

import React, { useState, useEffect } from "react";
const fontFamily = "Montserrat, sans-serif";
const orange = "#F25A26";

// Para la tabla de documentos requeridos (los de siempre)
const REQUISITOS_DEFECTO = [
  { requisito: "Dirección General de Tributación - (DGT)" },
  { requisito: "Caja Costarricense del Seguro Social" },
  { requisito: "Póliza de Riesgos del Trabajo" },
  { requisito: "FODESAF" },
  {
    requisito:
      "Declaración Jurada- Cumplimiento Normativa Legitimación de Capitales",
  },
  {
    requisito:
      "Declaración Jurada de No Estar Bajo Prohibición Legal para Contratar",
  },
  { requisito: "Declaración jurada sentencias judiciales condenatorias" },
  {
    requisito:
      "Declaración Persona Fisica/Juridica",
  },
  {
    requisito:
      "Póliza civil extracontractual",
  },
  
];

const opcionesSiNo = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
];
const opcionesVigencia = [
  { value: "vigente", label: "Vigente" },
  { value: "No Vigente", label: "No Vigente" },
];

interface Documento {
  requisito: string;
  inscripcion: string;
  vigencia: string;
  fechaVigencia: string;
  respaldo: File | null;
}

const DOCS_PATH = "/docs/";
const DOCUMENTOS_COMERCIALES = [
  {
    nombre: "Formulario Persona Física",
    filename: "FORMULARIO_PERSONA_FISICA.pdf",
    desc: "El archivo debe ser completado, firmado con firma digital o a mano.",
    accept: ".pdf",
  },
  {
    nombre: "Formulario Persona Jurídica",
    filename: "FORMULARIO-PERSONA_JURIDICA.pdf",
    desc: "El archivo debe ser completado, firmado con firma digital o a mano.",
    accept: ".pdf",
  },
  {
    nombre:
      "Formato Declaración Jurada de Cumplimiento con la Normativa de Legitimación de Capitales",
    filename:
      "Formato Declaración Jurada de Cumplimiento con la Normativa de Legitimación de Capitales.docx",
    desc: "Descarga, completa y firma este formato.",
    accept: ".doc",
  },
  {
    nombre:
      "Formato - Declaración Jurada de No Estar Bajo Prohibición Legal para Contratar",
    filename:
      "Formato - Declaración Jurada de No Estar Bajo Prohibición Legal para Contratar.docx",
    desc: "Descarga, completa y firma este formato.",
    accept: ".doc",
  },
  {
    nombre:
      "Formato - El comercio afiliado no debe registrar sentencias judiciales condenatorias",
    filename:
      "Formato - El comercio afiliado no debe registrar sentencias judiciales condenatorias.docx",
    desc: "Descarga, completa y firma este formato.",
    accept: ".doc",
  },
];

const SeccionDocumentosRequeridos: React.FC<{
  onPrev: () => void;
  onNext: (data: any) => void;
  data: any;
}> = ({ onPrev, onNext, data }) => {
  // Estado para la tabla de documentos requeridos
  const [documentos, setDocumentos] = useState<Documento[]>(
    data && data.documentos
      ? data.documentos
      : REQUISITOS_DEFECTO.map((r) => ({
          requisito: r.requisito,
          inscripcion: "",
          vigencia: "",
          fechaVigencia: "",
          respaldo: null,
        }))
  );

  // Estado para archivos de las tarjetas comerciales
  const [archivosComerciales, setArchivosComerciales] = useState<
    (File | null)[]
  >(
    data && data.archivosComerciales
      ? data.archivosComerciales
      : Array(DOCUMENTOS_COMERCIALES.length).fill(null)
  );

  // 🔄 SINCRONIZAR ESTADOS LOCALES CUANDO CAMBIA DATA (al volver atrás)
  useEffect(() => {
    if (data && data.documentos) {
      setDocumentos(data.documentos);
    }
    if (data && data.archivosComerciales) {
      setArchivosComerciales(data.archivosComerciales);
    }
  }, [data]);
  // ----------------------------------------

  // HANDLERS PARA LA TABLA
  const handleDocumentoChange = (
    idx: number,
    key: keyof Documento,
    value: string | File | null
  ) => {
    setDocumentos((docs) =>
      docs.map((d, i) => (i === idx ? { ...d, [key]: value } : d))
    );
  };
  const eliminarRespaldo = (idx: number) => {
    setDocumentos((docs) =>
      docs.map((d, i) => (i === idx ? { ...d, respaldo: null } : d))
    );
  };

  // HANDLERS PARA LAS TARJETAS
  const handleArchivoChange = (idx: number, file: File | null) => {
    setArchivosComerciales((arr) => {
      const copia = [...arr];
      copia[idx] = file;
      return copia;
    });
  };
  const eliminarArchivo = (idx: number) => {
    setArchivosComerciales((arr) => {
      const copia = [...arr];
      copia[idx] = null;
      return copia;
    });
  };

  // ENVÍO DEL FORMULARIO
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ documentos, archivosComerciales });
  };

  return (
    <form
      style={{
        maxWidth: 1200,
        margin: "32px auto",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        padding: "42px",
        fontFamily,
        border: `2.5px solid ${orange}`,
      }}
      onSubmit={handleSubmit}
    >
      {/* Título de la tabla */}
      <h2
        style={{
          color: orange,
          fontWeight: 900,
          fontSize: "2.7rem",
          marginBottom: 28,
          letterSpacing: "-1.6px",
          lineHeight: 1.08,
        }}
      >
        Documentos Requeridos
      </h2>
      {/* TABLA DE DOCUMENTOS REQUERIDOS */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1.8px solid #FFD7C2",
          padding: 0,
          marginBottom: 38,
          boxShadow: "0 1px 8px #F25A2606",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.5fr 0.9fr 1.2fr 1.1fr 1.3fr",
            gap: "8px",
            borderRadius: "16px 16px 0 0",
            background: "#FFF4EE",
            fontWeight: 900,
            color: orange,
            fontSize: "1.55rem",
            padding: "20px 0 15px 0",
            borderBottom: "2.5px solid #FFD7C2",
          }}
        >
          <div style={{ textAlign: "left", paddingLeft: 28 }}>Requisito</div>
          <div style={{ textAlign: "center" }}>Inscripción</div>
          <div style={{ textAlign: "center" }}>Vigencia</div>
          <div style={{ textAlign: "center" }}>Fecha Vigencia</div>
          <div style={{ textAlign: "center" }}>Respaldo</div>
        </div>
        {documentos.map((doc, idx) => (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: "2.5fr 0.9fr 1.2fr 1.1fr 1.3fr",
              alignItems: "center",
              gap: "8px",
              borderBottom:
                idx === documentos.length - 1
                  ? undefined
                  : "1.2px solid #FFD7C2",
              background: "#fff",
              padding: "20px 0",
            }}
          >
            {/* Requisito */}
            <div style={{ paddingLeft: 24 }}>
              <div style={{ fontWeight: 800, fontSize: "1.2rem" }}>
                {doc.requisito}
              </div>
            </div>
            {/* Inscripción */}
            <div style={{ textAlign: "center" }}>
              <select
                value={doc.inscripcion}
                style={{
                  ...inputStyleSelect,
                  minWidth: 68,
                  maxWidth: 80,
                  fontWeight: 600,
                  fontSize: "1rem",
                  background: "#fff",
                  border: "1.5px solid #FFD7C2",
                  height: 40,
                  textAlign: "center",
                }}
                onChange={(e) =>
                  handleDocumentoChange(idx, "inscripcion", e.target.value)
                }
              >
                <option value="">Si / No</option>
                {opcionesSiNo.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Vigencia */}
            <div style={{ textAlign: "center" }}>
              <select
                value={doc.vigencia}
                style={{
                  ...inputStyleSelect,
                  minWidth: 90,
                  fontWeight: 600,
                  fontSize: "1rem",
                  background: "#fff",
                  border: "1.5px solid #FFD7C2",
                  height: 40,
                  textAlign: "center",
                }}
                onChange={(e) =>
                  handleDocumentoChange(idx, "vigencia", e.target.value)
                }
              >
                <option value="">Vigencia</option>
                {opcionesVigencia.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Fecha Vigencia */}
            <div style={{ minWidth: 120, textAlign: "center" }}>
              <input
                type="date"
                value={doc.fechaVigencia}
                onChange={(e) =>
                  handleDocumentoChange(idx, "fechaVigencia", e.target.value)
                }
                style={{
                  ...inputStyle,
                  minWidth: 0,
                  fontSize: "1.12rem",
                  marginBottom: 0,
                  height: 40,
                  border: "1.5px solid #FFD7C2",
                  textAlign: "center",
                }}
                placeholder="dd/mm/aaaa"
              />
            </div>
            {/* Respaldo */}
            <div style={{ textAlign: "center" }}>
              <label
                style={{
                  cursor: "pointer",
                  color: orange,
                  fontWeight: 900,
                  fontSize: "1.11rem",
                  textDecoration: "underline",
                }}
              >
                ⇧ Subir PDF
                <input
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    handleDocumentoChange(
                      idx,
                      "respaldo",
                      e.target.files && e.target.files[0]
                        ? e.target.files[0]
                        : null
                    )
                  }
                />
              </label>
              {doc.respaldo && (
                <span
                  style={{
                    color: orange,
                    fontSize: "1em",
                    marginLeft: 8,
                    fontWeight: 800,
                  }}
                >
                  {doc.respaldo.name}
                  <button
                    type="button"
                    style={{
                      marginLeft: 8,
                      color: "#D62B25",
                      fontWeight: 900,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontSize: "1.13em",
                    }}
                    onClick={() => eliminarRespaldo(idx)}
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sección "Conozca a su socio comercial" */}
      <div
        style={{
          marginBottom: 34,
          marginTop: 16,
          color: orange,
          fontWeight: 900,
          fontSize: "2rem",
        }}
      >
        Documentos Conozca a su socio comercial
      </div>
      {/* TARJETAS */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          background: "#FFF4EE",
          borderRadius: 18,
          padding: "34px 26px 28px 26px",
          border: "2px solid #FFD7C2",
          margin: "30px 0 0 0",
          justifyContent: "flex-start",
        }}
      >
        {DOCUMENTOS_COMERCIALES.map((doc, idx) => (
          <div
            key={doc.filename}
            style={{
              flex: 1,
              minWidth: 320,
              maxWidth: 430,
              background: "#fff",
              borderRadius: 13,
              padding: "17px 22px 18px 22px",
              border: "1.5px solid #FFD7C2",
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 7,
              }}
            >
              <span
                style={{
                  fontSize: "2.2rem",
                  color: orange,
                  marginTop: -2,
                }}
              >
                {doc.accept === ".pdf" ? "📄" : "📝"}
              </span>
              <span
                style={{
                  fontWeight: 800,
                  color: orange,
                  fontSize: "1.15rem",
                }}
              >
                {doc.nombre}
              </span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <a
                href={`${DOCS_PATH}${doc.filename}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: orange,
                  fontWeight: 800,
                  fontSize: "1.09rem",
                  textDecoration: "underline",
                }}
              >
                Descargar {doc.accept === ".pdf" ? "PDF" : "DOC"}
              </a>
            </div>
            <div
              style={{
                color: "#9d8e82",
                fontSize: "1.01rem",
                marginBottom: 9,
                fontWeight: 500,
              }}
            >
              
                
            </div>
          </div>
        ))}
      </div>

      {/* BOTONES */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: 33,
          gap: 18,
        }}
      >
        <button
          type="button"
          style={{
            background: "#fff",
            color: orange,
            fontWeight: 900,
            fontSize: "1.21rem",
            border: `2.5px solid ${orange}`,
            borderRadius: "15px",
            padding: "17px 56px",
            fontFamily,
            marginRight: 8,
            cursor: "pointer",
            transition: "background 0.18s",
          }}
          onClick={onPrev}
        >
          Anterior
        </button>
        <button
          type="submit"
          style={{
            background: orange,
            color: "#fff",
            fontWeight: 900,
            fontSize: "1.21rem",
            border: "none",
            borderRadius: "15px",
            padding: "17px 56px",
            fontFamily,
            boxShadow: "0 2px 8px #F25A2633",
            cursor: "pointer",
            marginLeft: 8,
            transition: "background 0.18s",
          }}
        >
          Siguiente
        </button>
      </div>
    </form>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px",
  marginTop: 0,
  borderRadius: "10px",
  border: "1.8px solid #FFD7C2",
  fontSize: "1.11rem",
  fontFamily,
  background: "#fff8f5",
  transition: "border 0.18s, background 0.18s",
};
const inputStyleSelect: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  fontWeight: 700,
  fontSize: "1.14rem",
  background: "#fff8f5",
};

export default SeccionDocumentosRequeridos;
