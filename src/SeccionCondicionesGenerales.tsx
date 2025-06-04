import './responsive.css';
import React, { useState, useEffect } from "react";

interface Props {
  data?: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const orange = "#F25A26";

const TEXTO_TERMINOS = `
TÉRMINOS Y CONDICIONES DE INSCRIPCIÓN PARA COMERCIOS AFILIADOS
Al completar y enviar este formulario, el comercio interesado declara haber leído, comprendido y aceptado los presentes Términos y Condiciones:

Solicitud no vinculante: Esta inscripción no implica una aceptación automática como comercio afiliado. Es únicamente el inicio de un proceso de evaluación por parte de Connect y del Instituto Nacional de Seguros (INS), conforme al “Reglamento de tipo abierto para la afiliación de comercios a las plataformas de servicio de asistencias y planes de lealtad”.

Evaluación y aceptación: La solicitud será evaluada para verificar el cumplimiento de los requisitos técnicos, legales y operativos exigidos. Connect podrá requerir documentación adicional y se reserva el derecho de aceptar o rechazar la afiliación, sin obligación de justificar su decisión.

Afiliación condicionada: En caso de ser aceptado, el comercio se compromete a cumplir con todos los indicadores de servicio, normativas legales, políticas de calidad, así como con las directrices operativas establecidas por Connect y/o el INS. La afiliación puede ser revisada, suspendida o revocada en cualquier momento.

Relación no laboral: El comercio afiliado reconoce que no existe ninguna relación laboral ni vínculo de subordinación con Connect ni con el INS. Esta afiliación es de carácter comercial y colaborativo, sin generar derechos laborales, obligaciones patronales ni dependencia de ningún tipo.

Facultad de desafiliación: El comercio podrá ser desafiliado en cualquier momento por decisión de Connect o del INS, ya sea por incumplimiento, razones operativas, comerciales o estratégicas. En caso de desafiliación, el comercio quedará vetado para volver a solicitar su afiliación por un período de dos (2) años, incluso si existe cambio de razón social, fusión o absorción.

Confidencialidad y uso de marca: El comercio se compromete a mantener absoluta confidencialidad sobre la información obtenida durante el proceso, y a no utilizar el nombre, logotipo o marcas del INS sin autorización previa.

Política "Conozca a su socio comercial": El comercio declara conocer y cumplir con la política institucional “Conozca a su socio comercial” y se compromete a proporcionar toda la información que se le requiera conforme a dicha política.

Obligación de veracidad: Toda la información suministrada en el formulario y durante el proceso debe ser veraz, completa y actualizada. Cualquier falsedad, omisión o inexactitud podrá ser motivo de rechazo inmediato de la solicitud o de desafiliación, sin perjuicio de las acciones legales correspondientes.
`;

const SeccionCondicionesGenerales: React.FC<Props> = ({
  data = {},
  onChange,
  onNext,
  onPrev,
}) => {
  const [acepta, setAcepta] = useState<boolean>(!!data.acepta);

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange({ acepta });
    }
  }, [acepta, onChange]);

  // Para descargar términos como PDF simple (puedes mejorar esto)
  const descargarPDF = () => {
    const blob = new Blob([TEXTO_TERMINOS], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Terminos_Condiciones_Connect.pdf";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (acepta) onNext();
      }}
      style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}
    >
      <h2 style={{ color: orange, fontWeight: 900, fontSize: 28 }}>
        Condiciones Generales
      </h2>
      <div
        style={{
          background: "#fff",
          border: "1.5px solid #FFD7C2",
          borderRadius: 10,
          padding: 18,
          maxHeight: 280,
          overflowY: "auto",
          fontSize: 15,
          marginBottom: 16,
          color: "#252525",
        }}
      >
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
          {TEXTO_TERMINOS}
        </pre>
      </div>
      <button
        type="button"
        onClick={descargarPDF}
        style={{
          background: orange,
          color: "#fff",
          fontWeight: 800,
          border: "none",
          borderRadius: "8px",
          padding: "8px 22px",
          fontSize: "1rem",
          marginBottom: 22,
          cursor: "pointer",
          boxShadow: "0 2px 8px #F25A2633",
        }}
      >
        Descargar condiciones (PDF)
      </button>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={acepta}
            onChange={(e) => setAcepta(e.target.checked)}
            style={{ marginRight: 7 }}
          />
          He leído y acepto las condiciones generales
        </label>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 28,
        }}
      >
        <button
          type="button"
          onClick={onPrev}
          style={{
            background: "#fff",
            border: `2px solid ${orange}`,
            color: orange,
            fontWeight: 900,
            borderRadius: 13,
            padding: "11px 32px",
            cursor: "pointer",
          }}
        >
          Anterior
        </button>
        <button
          type="submit"
          disabled={!acepta}
          style={{
            background: orange,
            color: "#fff",
            fontWeight: 900,
            border: "none",
            borderRadius: "13px",
            padding: "13px 45px",
            fontFamily: "Montserrat, sans-serif",
            boxShadow: "0 2px 8px #F25A2633",
            cursor: acepta ? "pointer" : "not-allowed",
            opacity: acepta ? 1 : 0.6,
          }}
        >
          Siguiente
        </button>
      </div>
    </form>
  );
};

export default SeccionCondicionesGenerales;
