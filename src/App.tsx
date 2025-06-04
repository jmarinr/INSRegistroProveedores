import React, { useState } from "react";
import SeccionDatosGenerales from "./SeccionDatosGenerales";
import SeccionTiposAsistencia from "./SeccionTiposAsistencia";
import SeccionDocumentosRequeridos from "./SeccionDocumentosRequeridos";
import SeccionCondicionesGenerales from "./SeccionCondicionesGenerales";
import StepReview from "./StepReview";

const fontFamily = "Montserrat, sans-serif";
const orange = "#F25A26";
const lightOrange = "#f3713d";
const bgGray = "#f6f8fa";
const tabs = [
  "Datos Generales",
  "Tipos de Asistencia",
  "Documentos Requeridos",
  "Condiciones Generales",
  "Resumen",
];

function Header() {
  return (
    <header
      style={{
        background: orange,
        padding: "40px 0 32px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        marginBottom: "28px",
        fontFamily,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <img
        src="https://cdn.prod.website-files.com/64b580afe0544a5492bb37b7/64b580afe0544a5492bb389f_logo-completo.svg"
        alt="Connect Logo"
        style={{
          width: 300,
          maxWidth: "90vw",
          marginBottom: "8px",
          marginTop: "8px",
        }}
      />
      <div
        style={{
          background: lightOrange,
          color: "#fff",
          fontWeight: 500,
          fontSize: "1.15rem",
          borderRadius: "24px",
          padding: "30px 38px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginTop: "18px",
          maxWidth: 800,
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "block",
            fontWeight: 700,
            fontSize: "1.32rem",
            marginBottom: 12,
            lineHeight: 1.2,
          }}
        >
          Bienvenido al Registro de Comercios Afiliados
        </span>
        Gracias por tu interés en formar parte de nuestra red de asistencia.
        <br />
        <span style={{ display: "block", marginTop: 6 }}>
          Por favor revisa los documentos antes de iniciar.
        </span>
      </div>
    </header>
  );
}

interface TabsProps {
  selected: number;
  onSelect: (idx: number) => void;
}

function Tabs({ selected, onSelect }: TabsProps) {
  return (
    <div
      style={{
        display: "flex",
        background: bgGray,
        borderRadius: "20px 20px 0 0",
        overflow: "auto",
        margin: "0 auto",
        maxWidth: 1100,
        boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
        borderBottom: "1px solid #e3e6ec",
        fontFamily,
      }}
    >
      {tabs.map((tab, idx) => (
        <div
          key={tab}
          onClick={() => idx <= selected && onSelect(idx)}
          style={{
            flex: 1,
            minWidth: 140,
            cursor: idx <= selected ? "pointer" : "not-allowed",
            background: selected === idx ? "#fff" : bgGray,
            color: selected === idx ? orange : "#b7c1cc",
            fontWeight: 700,
            fontSize: "1.09rem",
            textAlign: "center",
            padding: "18px 0 12px 0",
            borderBottom: selected === idx ? `4px solid ${orange}` : "none",
            borderRadius: selected === idx ? "20px 20px 0 0" : "0",
            transition: "all .15s",
          }}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}

const App: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});

  const next = (sectionData: any) => {
    setFormData((prev: any) => ({ ...prev, ...sectionData }));
    setTab((t) => t + 1);
  };
  const prev = () => setTab((t) => (t > 0 ? t - 1 : 0));

  return (
    <div style={{ background: bgGray, minHeight: "100vh", fontFamily }}>
      <Header />
      <Tabs selected={tab} onSelect={setTab} />
      <div>
        {tab === 0 && <SeccionDatosGenerales onNext={next} data={formData} />}
        {tab === 1 && (
          <SeccionTiposAsistencia onNext={next} onPrev={prev} data={formData} />
        )}
        {tab === 2 && (
          <SeccionDocumentosRequeridos
            onNext={next}
            onPrev={prev}
            data={formData}
          />
        )}
        {tab === 3 && (
          <SeccionCondicionesGenerales
            onNext={() => setTab((t) => t + 1)}
            onPrev={prev}
            data={formData}
            onChange={(newData) =>
              setFormData((prev: any) => ({ ...prev, ...newData }))
            }
          />
        )}
        {tab === 4 && <StepReview data={formData} onPrev={prev} />}
      </div>

      {/* Footer de versión */}
      <footer
        style={{
          textAlign: "center",
          fontSize: "0.95rem",
          padding: "20px 0",
          color: "#888",
          borderTop: "1px solid #ddd",
          marginTop: 60,
        }}
      >
        Términos y Privacidad{" "}
        <strong style={{ color: "#333" }}>Registro de Proveedores</strong> ©
        v0.1.18
      </footer>

      <style>
        {`
          @media (max-width: 900px) {
            form > div, .seccion-base {
              grid-template-columns: 1fr !important;
              padding: 14px !important;
            }
            button {
              width: 100% !important;
            }
          }
          body, html {
            font-family: Montserrat, sans-serif;
          }
        `}
      </style>
    </div>
  );
};

export default App;
