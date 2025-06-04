import React, { useState } from "react";

const fontFamily = "Montserrat, sans-serif";
const orange = "#F25A26";
const lightOrange = "#f3713d";

// Importar datos completos desde archivo externo si lo prefieres
import ubicacionData from "./cr_ubicaciones.json";

interface Props {
  onNext: (data: any) => void;
  data: any;
}

const SeccionDatosGenerales: React.FC<Props> = ({ onNext, data }) => {
  const [tipoId, setTipoId] = useState<"fisica" | "juridica">(
    data.tipoId || "fisica"
  );
  const [provincia, setProvincia] = useState<string>(data.provincia || "");
  const [canton, setCanton] = useState<string>(data.canton || "");
  const [distrito, setDistrito] = useState<string>(data.distrito || "");
  const [form, setForm] = useState<any>(data);

  const provincias = ubicacionData.map((p) => p.provincia);
  const cantones = provincia
    ? ubicacionData
        .find((p) => p.provincia === provincia)
        ?.cantones.map((c) => c.canton) || []
    : [];
  const distritos =
    provincia && canton
      ? ubicacionData
          .find((p) => p.provincia === provincia)
          ?.cantones.find((ca) => ca.canton === canton)?.distritos || []
      : [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
  };

  const handleProvincia = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvincia(e.target.value);
    setCanton("");
    setDistrito("");
  };
  const handleCanton = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCanton(e.target.value);
    setDistrito("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.numeroIdentificacion ||
      !form.nombreComercial ||
      !form.representanteLegal ||
      !form.nacionalidad ||
      !provincia ||
      !canton ||
      !distrito ||
      !form.detalle
    ) {
      alert("Por favor complete todos los campos obligatorios.");
      return;
    }
    onNext({
      ...form,
      tipoId,
      provincia,
      canton,
      distrito,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 1100,
        margin: "32px auto",
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.09)",
        padding: "38px",
        display: "flex",
        flexDirection: "column",
        gap: "42px",
        fontFamily,
        border: `2px solid ${lightOrange}`,
      }}
    >
      {/* Sección superior de datos generales */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "36px 50px",
        }}
      >
        {/* Tipo de identificación */}
        <div style={{ gridColumn: "1/3" }}>
          <label className="label-connect" style={labelStyle}>
            Tipo de identificación *
            <select
              name="tipoIdentificacion"
              required
              value={tipoId}
              onChange={(e) =>
                setTipoId(e.target.value as "fisica" | "juridica")
              }
              className="input-connect"
              style={inputStyleSelect}
            >
              <option value="fisica">Persona Física</option>
              <option value="juridica">Persona Jurídica</option>
            </select>
          </label>
        </div>

        <label className="label-connect" style={labelStyle}>
          Número de identificación *
          <input
            type="text"
            name="numeroIdentificacion"
            required
            className="input-connect"
            style={inputStyle}
            value={form.numeroIdentificacion || ""}
            onChange={handleChange}
          />
        </label>

        {tipoId === "juridica" && (
          <label className="label-connect" style={labelStyle}>
            Razón Social *
            <input
              type="text"
              name="razonSocial"
              required
              className="input-connect"
              style={inputStyle}
              value={form.razonSocial || ""}
              onChange={handleChange}
            />
          </label>
        )}

        <label className="label-connect" style={labelStyle}>
          Nombre Comercial *
          <input
            type="text"
            name="nombreComercial"
            required
            className="input-connect"
            style={inputStyle}
            value={form.nombreComercial || ""}
            onChange={handleChange}
          />
        </label>

        <label className="label-connect" style={labelStyle}>
          Representante Legal *
          <input
            type="text"
            name="representanteLegal"
            required
            className="input-connect"
            style={inputStyle}
            value={form.representanteLegal || ""}
            onChange={handleChange}
          />
        </label>

        <label className="label-connect" style={labelStyle}>
          Nacionalidad *
          <input
            type="text"
            name="nacionalidad"
            required
            className="input-connect"
            style={inputStyle}
            value={form.nacionalidad || ""}
            onChange={handleChange}
          />
        </label>

        <label className="label-connect" style={labelStyle}>
          Provincia *
          <select
            name="provincia"
            required
            value={provincia}
            onChange={handleProvincia}
            className="input-connect"
            style={inputStyleSelect}
          >
            <option value="">Seleccione provincia</option>
            {provincias.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </label>

        <label className="label-connect" style={labelStyle}>
          Cantón *
          <select
            name="canton"
            required
            value={canton}
            onChange={handleCanton}
            className="input-connect"
            style={inputStyleSelect}
            disabled={!provincia}
          >
            <option value="">Seleccione cantón</option>
            {cantones.map((can) => (
              <option key={can} value={can}>
                {can}
              </option>
            ))}
          </select>
        </label>

        <label
          className="label-connect"
          style={{ ...labelStyle, gridColumn: "1/3" }}
        >
          Distrito *
          <select
            name="distrito"
            required
            value={distrito}
            onChange={(e) => setDistrito(e.target.value)}
            className="input-connect"
            style={inputStyleSelect}
            disabled={!canton}
          >
            <option value="">Seleccione distrito</option>
            {distritos.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </label>

        <label
          className="label-connect"
          style={{ ...labelStyle, gridColumn: "1/3" }}
        >
          Detalle *
          <textarea
            name="detalle"
            required
            rows={2}
            className="input-connect"
            style={{ ...inputStyle, resize: "vertical" }}
            value={form.detalle || ""}
            onChange={handleChange}
          />
        </label>
      </div>

      {/* Sección de contacto */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "36px 50px",
        }}
      >
        <label className="label-connect" style={labelStyle}>
          Correo electrónico 1 *
          <input
            type="email"
            name="correo1"
            required
            className="input-connect"
            style={inputStyle}
            value={form.correo1 || ""}
            onChange={handleChange}
          />
        </label>

        <label className="label-connect" style={labelStyle}>
          Correo electrónico 2
          <input
            type="email"
            name="correo2"
            className="input-connect"
            style={inputStyle}
            value={form.correo2 || ""}
            onChange={handleChange}
          />
        </label>

        <label className="label-connect" style={labelStyle}>
          Teléfono 1
          <input
            type="tel"
            name="telefono1"
            className="input-connect"
            style={inputStyle}
            value={form.telefono1 || ""}
            onChange={handleChange}
          />
        </label>

        <label className="label-connect" style={labelStyle}>
          Teléfono 2
          <input
            type="tel"
            name="telefono2"
            className="input-connect"
            style={inputStyle}
            value={form.telefono2 || ""}
            onChange={handleChange}
          />
        </label>

        <label className="label-connect" style={labelStyle}>
          Teléfono 3
          <input
            type="tel"
            name="telefono3"
            className="input-connect"
            style={inputStyle}
            value={form.telefono3 || ""}
            onChange={handleChange}
          />
        </label>

        <label className="label-connect" style={labelStyle}>
          Página Web
          <input
            type="url"
            name="web"
            className="input-connect"
            style={inputStyle}
            value={form.web || ""}
            onChange={handleChange}
          />
        </label>

        <label className="label-connect" style={labelStyle}>
          Facebook
          <input
            type="text"
            name="facebook"
            className="input-connect"
            style={inputStyle}
            value={form.facebook || ""}
            onChange={handleChange}
          />
        </label>

        <label className="label-connect" style={labelStyle}>
          Instagram
          <input
            type="text"
            name="instagram"
            className="input-connect"
            style={inputStyle}
            value={form.instagram || ""}
            onChange={handleChange}
          />
        </label>

        <label
          className="label-connect"
          style={{ ...labelStyle, gridColumn: "1/3" }}
        >
          Otro
          <input
            type="text"
            name="otro"
            className="input-connect"
            style={inputStyle}
            value={form.otro || ""}
            onChange={handleChange}
          />
        </label>
      </div>

      {/* Botón */}
      <div style={{ textAlign: "right" }}>
        <button
          type="submit"
          style={{
            background: orange,
            color: "#fff",
            fontWeight: 700,
            fontSize: "1.12rem",
            border: "none",
            borderRadius: "12px",
            padding: "14px 48px",
            marginTop: "16px",
            fontFamily,
            boxShadow: "0 2px 8px rgba(242,90,38,0.08)",
            cursor: "pointer",
            transition: "background 0.18s",
          }}
        >
          Siguiente
        </button>
      </div>
    </form>
  );
};

const labelStyle: React.CSSProperties = {
  marginBottom: 0,
  marginRight: 0,
  display: "block",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  marginTop: 10,
  borderRadius: "10px",
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

export default SeccionDatosGenerales;
