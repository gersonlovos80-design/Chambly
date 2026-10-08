const API_URL = "http://localhost/chambly_api";

export async function registrarUsuario(datos) {
  const response = await fetch(`${API_URL}/registro.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  return await response.json();
}

export async function loginUsuario(correo, password, modo = "") {
  const response = await fetch(`${API_URL}/login.php`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: correo,
      password: password,
      modo,
    }),
  });

  return await response.json();
}

export async function actualizarPerfilRol(payload) {
  const response = await fetch(`${API_URL}/role_profile.php`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(result.mensaje || "No se pudo actualizar el perfil o el modo");
  }
  return result;
}

export async function obtenerPerfilesRol() {
  const response = await fetch(`${API_URL}/role_profile.php`, {
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(result.mensaje || "No se pudieron cargar los perfiles de la cuenta");
  }
  return result;
}

async function solicitarApi(ruta, options = {}) {
  const response = await fetch(`${API_URL}/${ruta}`, {
    credentials: "include",
    ...options,
  });
  const responseText = await response.text();
  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    const responseHint = responseText
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 220);
    throw new Error(
      `El servidor devolvió una respuesta no válida (HTTP ${response.status}).${responseHint ? ` Respuesta: ${responseHint}` : " Revisa que XAMPP esté activo y que el endpoint PHP no tenga errores."}`
    );
  }
  if (!response.ok || !result.ok) {
    throw new Error(result.mensaje || "No se pudo completar la operación");
  }
  return result;
}

export async function obtenerSolicitudes() {
  return solicitarApi("solicitudes.php");
}

export async function obtenerProfesionales(category = "") {
  return solicitarApi(`profesionales.php?categoria=${encodeURIComponent(category)}`);
}

export async function crearSolicitud(payload) {
  return solicitarApi("solicitudes.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", ...payload }),
  });
}

export async function responderSolicitud(solicitudId, decision) {
  return solicitarApi("solicitudes.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "respond", solicitudId, decision }),
  });
}

export async function completarSolicitud(solicitudId) {
  return solicitarApi("solicitudes.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "complete", solicitudId }),
  });
}

export async function obtenerConversaciones() {
  return solicitarApi("conversaciones.php");
}

export async function enviarMensaje(conversacionId, contenido) {
  return solicitarApi("conversaciones.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "send", conversacionId, contenido }),
  });
}

export async function crearPresupuesto(conversacionId, items, deliveryMode, scheduledDate) {
  return solicitarApi("conversaciones.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "create_quote",
      conversacionId,
      items,
      deliveryMode,
      scheduledDate,
    }),
  });
}

export async function responderPresupuesto(conversacionId, quoteId, decision) {
  return solicitarApi("conversaciones.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "respond_quote",
      conversacionId,
      quoteId,
      decision,
    }),
  });
}

export async function obtenerResenas(profesionalId) {
  return solicitarApi(`resenas.php?profesional_id=${encodeURIComponent(profesionalId)}`);
}

export async function crearResena(payload) {
  return solicitarApi("resenas.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", ...payload }),
  });
}

export async function obtenerNotificaciones() {
  return solicitarApi("notificaciones.php");
}

export async function marcarNotificacionLeida(notificationId) {
  return solicitarApi("notificaciones.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notificationId }),
  });
}

export async function logoutUsuario() {
  const response = await fetch(`${API_URL}/logout.php`, {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(result.mensaje || "No se pudo cerrar la sesión del servidor");
  }
  return result;
}