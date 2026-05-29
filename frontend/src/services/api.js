// Autor: Brandon
// Descripción: Servicio HTTP encargado de consumir la API REST del backend Flask.

const API_URL = "http://127.0.0.1:5000/api/validate";

export async function validateExpression(expression) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expression }),
  });

  if (!response.ok) {
    throw new Error("No se pudo validar la expresión en el servidor.");
  }

  return response.json();
}
