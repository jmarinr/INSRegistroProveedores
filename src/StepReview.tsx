import React, { useState } from "react";

const orange = "#F25A26";

// --- Utilidad: Convierte archivo a base64 ---
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("No se pudo convertir a base64"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// --- Extrae TODOS los archivos del formulario ---
async function recolectarArchivos(formData: any) {
  const archivos: { nombre: string; file: File }[] = [];

  // Documentos requeridos
  if (formData.documentos) {
    for (const doc of formData.documentos) {
      if (doc.respaldo && doc.respaldo.name) {
        archivos.push({ nombre: doc.respaldo.name, file: doc.respaldo });
      }
    }
  }

  // Fotos por asistencia
  if (formData.servicios) {
    for (const serv of formData.servicios) {
      if (serv.fotosPorAsistencia) {
        for (const asistencia in serv.fotosPorAsistencia) {
          const files = serv.fotosPorAsistencia[asistencia] || [];
          for (const foto of files) {
            if (foto && foto.name) {
              archivos.push({ nombre: foto.name, file: foto });
            }
          }
        }
      }
      // Fotos de locales
      if (
        serv.localInfo &&
        Array.isArray(serv.localInfo) &&
        serv.localInfo[0]?.locales
      ) {
        for (const local of serv.localInfo[0].locales) {
          if (local.fotosGenerales) {
            for (const foto of local.fotosGenerales) {
              if (foto && foto.name) {
                archivos.push({ nombre: foto.name, file: foto });
              }
            }
          }
        }
      }
    }
  }
  return archivos;
}

// ----------- RESUMEN VISUAL HTML (para el front, sin links S3) -----------
function generarResumenVisualHTML(data: any) {
  const isJuridica = data.tipoId === "juridica";
  const emojiTipo = isJuridica ? "🏢" : "🧑‍💼";
  function safe(value: any) {
    return value ?? "";
  }
  function asistenciaHtml(servicios: any[]) {
    if (!servicios?.length)
      return "<i style='color:#999'>No hay servicios.</i>";
    return servicios
      .map(
        (serv: any, i: number) => `
      <div style="background:#FFF9F6;border-left:5px solid ${orange};border-radius:12px;padding:12px 18px;margin-bottom:16px;margin-top:8px;">
        <div style="font-weight:700;color:${orange};font-size:1.12rem;margin-bottom:4px;">
          <span style="font-size:12px;">◆</span> Servicio #${i + 1}
        </div>
        <div><b>Tipo:</b> ${safe(serv.tipo) || "-"}</div>
        <div><b>Asistencias:</b> ${
          (serv.asistencias || []).length
            ? serv.asistencias
                .map(
                  (a: string) =>
                    `<span style="background:#ffd7c2;color:${orange};border-radius:10px;padding:1px 10px;margin-right:5px;font-weight:600;font-size:14px;">${a}</span>`
                )
                .join(" ")
            : "<span style='color:#999'>-</span>"
        }</div>
        <div><b>Experiencia:</b> ${safe(serv.experiencia) || "-"}</div>
        <div><b>¿Asistencia en local?</b> ${
          serv.local === "Sí" ? "Sí" : "No"
        }</div>
      </div>
    `
      )
      .join("");
  }
  function docsHtml(documentos: any[]) {
    if (!documentos?.length)
      return "<i style='color:#999'>No hay documentos cargados.</i>";
    return `<ul style="margin:0;padding:0 0 0 19px;">
      ${documentos
        .map(
          (doc: any) => `
        <li style="margin-bottom:7px;">
          <span style="font-weight:600;">${doc.requisito}</span> – 
          <span style="color:${doc.inscripcion === "si" ? "green" : orange};">
            ${doc.inscripcion === "si" ? "Inscrito" : "No inscrito"}
          </span>, 
          <span style="color:${doc.vigencia === "vigente" ? "green" : "blue"};">
            ${doc.vigencia === "vigente" ? "Vigente" : "No Vigente"}
          </span>
        </li>
      `
        )
        .join("")}
    </ul>`;
  }
  return `
  <div style="font-family:Montserrat,Arial,sans-serif;color:#363636;">
    <h2 style="color:${orange};font-weight:800;font-size:28px;margin:0 0 18px 0;">
      Resumen de Solcitud
    </h2>
    <h3 style="color:${orange};font-weight:800;font-size:22px;margin:0 0 10px 0;display:flex;align-items:center;gap:9px;">
      📑 Datos Generales
    </h3>
    <div style="background:#FFF6F2;border-radius:16px;padding:16px 24px;margin-bottom:26px;font-size:1.07rem;box-shadow:0 1.5px 9px #F25A2605;">
      <b>Tipo de identificación:</b> ${
        isJuridica ? "Persona Jurídica" : "Persona Física"
      } <span style="font-size:18px;">${emojiTipo}</span><br/>
      <b>Número de identificación:</b> ${safe(data.numeroIdentificacion)}<br/>
      ${isJuridica ? `<b>Razón Social:</b> ${safe(data.razonSocial)}<br/>` : ""}
      <b>Nombre Comercial:</b> ${safe(data.nombreComercial)}<br/>
      <b>Representante Legal:</b> ${safe(data.representanteLegal)}<br/>
      <b>Nacionalidad:</b> ${safe(data.nacionalidad)}<br/>
      <b>Provincia:</b> ${safe(data.provincia)}<br/>
      <b>Cantón:</b> ${safe(data.canton)}<br/>
      <b>Distrito:</b> ${safe(data.distrito)}<br/>
      <b>Detalle:</b> ${safe(data.detalle)}<br/>
      ${
        data.correo1
          ? `<b>Correo electrónico 1:</b> ${safe(data.correo1)}<br/>`
          : ""
      }
      ${
        data.correo2
          ? `<b>Correo electrónico 2:</b> ${safe(data.correo2)}<br/>`
          : ""
      }
      ${data.telefono1 ? `<b>Teléfono 1:</b> ${safe(data.telefono1)}<br/>` : ""}
      ${data.telefono2 ? `<b>Teléfono 2:</b> ${safe(data.telefono2)}<br/>` : ""}
      ${data.telefono3 ? `<b>Teléfono 3:</b> ${safe(data.telefono3)}<br/>` : ""}
      ${data.web ? `<b>Página Web:</b> ${safe(data.web)}<br/>` : ""}
      ${data.facebook ? `<b>Facebook:</b> ${safe(data.facebook)}<br/>` : ""}
      ${data.instagram ? `<b>Instagram:</b> ${safe(data.instagram)}<br/>` : ""}
      ${data.otro ? `<b>Otro:</b> ${safe(data.otro)}<br/>` : ""}
    </div>
    <h3 style="color:${orange};font-weight:800;font-size:22px;margin:0 0 10px 0;display:flex;align-items:center;gap:8px;">
      🛠️ Tipos de Asistencia
    </h3>
    ${asistenciaHtml(data.servicios)}
    <h3 style="color:${orange};font-weight:800;font-size:22px;margin:0 0 10px 0;display:flex;align-items:center;gap:8px;">
      📄 Documentos Requeridos
    </h3>
    <div style="background:#f9f9f7;border-radius:14px;padding:15px 26px;margin-bottom:26px;font-size:1.09rem;box-shadow:0 1.5px 8px #F25A2606;">
      ${docsHtml(data.documentos)}
    </div>
    <h3 style="color:${orange};font-weight:800;font-size:22px;margin:0 0 10px 0;display:flex;align-items:center;gap:8px;">
      ✅ Condiciones Generales
    </h3>
    <div style="background:#f6fbf7;border-radius:12px;padding:13px 25px;font-size:1.09rem;margin-bottom:18px;font-weight:600;">
      ¿Acepta términos y condiciones?:
      <span style="color:${data.acepta ? "green" : orange};font-weight:700;">
        ${data.acepta ? "Sí" : "No"}
      </span>
    </div>
  </div>
  `;
}

// ----------- RESUMEN KAYAKO EN FORMATO TEXTO (NUEVO) -----------
function generarResumenApiLista(data: any) {
  const safe = (v: any) => v ?? "-";
  let out: string[] = [];

  out.push(`===== 📋 Datos ingresados en la Solicitud =====\n`);

  out.push("Datos Generales:");
  out.push(
    [
      [
        "Tipo de ID",
        data.tipoId === "juridica" ? "Persona Jurídica" : "Persona Física",
      ],
      ["Nº Identificación", safe(data.numeroIdentificacion)],
      ["Nombre Comercial", safe(data.nombreComercial)],
      ["Representante Legal", safe(data.representanteLegal)],
      ["Nacionalidad", safe(data.nacionalidad)],
      ["Provincia", safe(data.provincia)],
      ["Cantón", safe(data.canton)],
      ["Distrito", safe(data.distrito)],
      ["Correo 1", safe(data.correo1)],
      ["Correo 2", safe(data.correo2)],
      ["Teléfono 1", safe(data.telefono1)],
      ["Teléfono 2", safe(data.telefono2)],
      ["Teléfono 3", safe(data.telefono3)],
      ["Página web", safe(data.web)],
      ["Facebook", safe(data.facebook)],
      ["Instagram", safe(data.instagram)],
      ["Otro", safe(data.otro)],
    ]
      .filter((row) => row[1] && row[1] !== "-")
      .map((row) => `- ${row[0]}: ${row[1]}`)
      .join("\n")
  );

  out.push("\nTipos de Asistencia:");
  if (!data.servicios || !data.servicios.length) {
    out.push("- No hay servicios registrados.");
  } else {
    data.servicios.forEach((serv: any, idx: number) => {
      out.push(`\n  ${idx + 1}. Tipo: ${safe(serv.tipo)}`);
      out.push(
        `     Asistencias: ${(serv.asistencias || []).join(", ") || "-"}`
      );
      out.push(`     Experiencia: ${safe(serv.experiencia)}`);
      out.push(
        `     ¿Asistencia en local?: ${serv.local === "Sí" ? "Sí" : "No"}`
      );

      // Fotos por asistencia
      if (serv.fotosPorAsistenciaUrls) {
        Object.entries(serv.fotosPorAsistenciaUrls).forEach(
          ([asistencia, urls]: [string, any]) => {
            if (urls.length) {
              out.push(`     ${asistencia}:`);
              urls.forEach((url: string, i: number) => {
                out.push(`       - Foto #${i + 1}: ${url}`);
              });
            }
          }
        );
      }
      // Fotos de locales
      if (
        serv.localInfo &&
        Array.isArray(serv.localInfo) &&
        serv.localInfo[0]?.locales
      ) {
        serv.localInfo[0].locales.forEach((local: any, j: number) => {
          out.push(`     Local #${j + 1}: ${local.ubicacion || ""}`);
          (local.fotosGeneralesUrls || []).forEach((url: string, i: number) => {
            out.push(`       - Foto general #${i + 1}: ${url}`);
          });
        });
      }
    });
  }

  out.push("\nDocumentos Requeridos:");
  if (!data.documentos || !data.documentos.length) {
    out.push("- No hay documentos cargados.");
  } else {
    data.documentos.forEach((doc: any, idx: number) => {
      let docLine = `  ${idx + 1}. ${safe(doc.requisito)} | Inscripción: ${
        doc.inscripcion === "si" ? "Inscrito" : "No inscrito"
      } | Vigencia: ${doc.vigencia === "vigente" ? "Vigente" : "No vigente"}`;
      if (doc.fechaVigencia) docLine += ` | Vence: ${doc.fechaVigencia}`;
      if (doc.respaldoUrl) docLine += ` | Archivo: ${doc.respaldoUrl}`;
      out.push(docLine);
    });
  }

  out.push("\nCondiciones Generales:");
  out.push(`- ¿Acepta términos y condiciones?: ${data.acepta ? "Sí" : "No"}`);

  return out.join("\n");
}

// ----------- VISUAL PARA EL FRONT -----------
function ResumenVisual({ data }: { data: any }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: generarResumenVisualHTML(data) }} />
  );
}

// ----------- POPUP DE ÉXITO -----------
function PopUp({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(34,34,34,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9000,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "48px 38px",
          boxShadow: "0 4px 20px #4442",
          textAlign: "center",
          maxWidth: 420,
          border: `2.5px solid ${orange}`,
        }}
      >
        <div style={{ fontSize: "2.4rem", marginBottom: 14, color: orange }}>
          ✔️
        </div>
        <h2 style={{ color: orange, marginBottom: 20 }}>
          ¡Formulario enviado con éxito!
        </h2>
        <p style={{ color: "#222", fontSize: "1.07rem", marginBottom: 18 }}>
          Tu postulación ha sido enviada correctamente. <br />
          Nos pondremos en contacto contigo pronto.
        </p>
        <button
          onClick={onClose}
          style={{
            marginTop: 8,
            background: orange,
            color: "#fff",
            fontWeight: 800,
            border: "none",
            borderRadius: "9px",
            padding: "10px 32px",
            fontSize: "1.09rem",
            cursor: "pointer",
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// ----------- FUNCIONES S3: Subir y Mapear URLs en la data -----------
const subirArchivosAS3 = async (data: any) => {
  const identificador = data.numeroIdentificacion || "sin-id";
  const archivosRaw = await recolectarArchivos(data);

  // Convertir a base64
  const archivos = await Promise.all(
    archivosRaw.map(async ({ nombre, file }) => ({
      nombre,
      contenido: await fileToBase64(file),
    }))
  );

  const payload = {
    identificacion: identificador,
    archivos,
  };

  console.log("[FRONTEND] Payload a uploadProviderFiles:", payload);

  const resp = await fetch(
    "https://connect-voice-api.azurewebsites.net/api/uploadProviderFiles?code=D7V9uOlHWKD2fJn1O/NQsPtPFmyMZVsuNfAKBx9Kyjb1T3MAFZSBOQ==",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!resp.ok) throw new Error("Error al subir archivos a S3");
  const json = await resp.json();
  return json.urls || [];
};

// Limpia arrays y asocia URLs aunque haya objetos vacíos
function integrarUrlsEnData(
  data: any,
  urls: { nombre: string; url: string }[]
) {
  // Clona el objeto para no mutar el original
  const nuevoData = JSON.parse(JSON.stringify(data));

  // Documentos requeridos
  if (nuevoData.documentos) {
    for (const doc of nuevoData.documentos) {
      if (doc.respaldo && doc.respaldo.name) {
        const match = urls.find((u) => u.nombre === doc.respaldo.name);
        if (match) doc.respaldoUrl = match.url;
      }
    }
  }

  // Fotos de asistencias
  if (nuevoData.servicios) {
    for (const serv of nuevoData.servicios) {
      // --- FOTOS POR ASISTENCIA ---
      if (serv.fotosPorAsistencia) {
        serv.fotosPorAsistenciaUrls = {};
        for (const asistencia in serv.fotosPorAsistencia) {
          serv.fotosPorAsistenciaUrls[asistencia] = [];
          const fotosArr = serv.fotosPorAsistencia[asistencia] || [];
          for (let i = 0; i < fotosArr.length; i++) {
            const foto = fotosArr[i];
            // Intenta por nombre, si no existe, usa el mismo index de archivos subidos (por orden)
            let nombreArchivo = foto && foto.name;
            if (!nombreArchivo && urls[i]) {
              nombreArchivo = urls[i].nombre;
            }
            const match = urls.find((u) => u.nombre === nombreArchivo);
            if (match) serv.fotosPorAsistenciaUrls[asistencia].push(match.url);
          }
        }
      }
      // --- FOTOS DE LOCALES ---
      if (
        serv.localInfo &&
        Array.isArray(serv.localInfo) &&
        serv.localInfo[0]?.locales
      ) {
        for (const local of serv.localInfo[0].locales) {
          local.fotosGeneralesUrls = [];
          for (let i = 0; i < (local.fotosGenerales || []).length; i++) {
            const foto = local.fotosGenerales[i];
            let nombreArchivo = foto && foto.name;
            if (!nombreArchivo && urls[i]) {
              nombreArchivo = urls[i].nombre;
            }
            const match = urls.find((u) => u.nombre === nombreArchivo);
            if (match) local.fotosGeneralesUrls.push(match.url);
          }
        }
      }
    }
  }
  return nuevoData;
}

// ----------- STEP REVIEW PRINCIPAL -----------
const StepReview = ({ data, onPrev }: { data: any; onPrev: () => void }) => {
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [dataConUrls, setDataConUrls] = useState<any>(data);
  const acepta = !!data.acepta;

  const handleEnviar = async () => {
    setEnviando(true);
    try {
      // 1. Subir archivos a S3
      const urls = await subirArchivosAS3(data);

      // 2. Actualiza la data para el resumen visual y Kayako (con links)
      const dataActualizada = integrarUrlsEnData(data, urls);
      setDataConUrls(dataActualizada);
      console.log("[DEBUG] Data con URLs integradas:", dataActualizada);

      // 3. Enviar a Kayako/Correo, usando la dataActualizada (con links S3)
      const resumenApiLista = generarResumenApiLista(dataActualizada);
      const jsonRequest = {
        mensaje: resumenApiLista,
        destino: "no-reply@connect.inc",
      };

      console.log("[DEBUG] Enviando a Kayako:", jsonRequest);
      console.log("[DEBUG] Data enviada a Kayako:", dataActualizada);
      console.log("[DEBUG] Resumen enviado a Kayako:", resumenApiLista);

      const resp = await fetch(
        "https://connect-voice-api.azurewebsites.net/api/sendProviderEmail?code=D7V9uOlHWKD2fJn1O/NQsPtPFmyMZVsuNfAKBx9Kyjb1T3MAFZSBOQ==",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonRequest),
        }
      );
      if (!resp.ok) throw new Error("Error al enviar el formulario");

      setExito(true);
    } catch (err) {
      alert(
        "Hubo un error al enviar el formulario. Por favor intenta nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 950,
        margin: "34px auto",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 2px 10px #0002",
        padding: "38px 38px 48px 38px",
        fontFamily: "Montserrat, sans-serif",
        border: `2.3px solid ${orange}`,
      }}
    >
      <ResumenVisual data={dataConUrls} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 22,
        }}
      >
        <button
          type="button"
          onClick={onPrev}
          style={{
            background: "#fff",
            border: `2px solid ${orange}`,
            color: orange,
            fontWeight: 800,
            borderRadius: 13,
            padding: "12px 36px",
            fontSize: "1.13rem",
            cursor: "pointer",
          }}
          disabled={enviando}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={handleEnviar}
          style={{
            background: acepta ? orange : "#FFBAA1",
            color: "#fff",
            fontWeight: 900,
            border: "none",
            borderRadius: "13px",
            padding: "14px 56px",
            fontFamily: "Montserrat, sans-serif",
            boxShadow: "0 2px 8px #F25A2633",
            cursor: acepta && !enviando ? "pointer" : "not-allowed",
            opacity: acepta && !enviando ? 1 : 0.7,
            fontSize: "1.23rem",
            transition: "background 0.14s",
          }}
          disabled={!acepta || enviando}
        >
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </div>
      <PopUp visible={exito} onClose={() => window.location.reload()} />
    </div>
  );
};

export default StepReview;
