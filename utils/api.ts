const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(endpoint: string, options = {}): Promise<any> {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    let errorMessage = "Erro desconhecido";

    try {
      const errorData = await res.json();
      errorMessage = errorData.message || JSON.stringify(errorData);
    } catch (err) {
      errorMessage = await res.text();
    }

    throw new Error(`Erro na API: ${res.status} - ${errorMessage}`);
  }

  const contentType = res.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
}

export async function apiRequestForm(endpoint: string, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    let errorMessage = "Erro desconhecido";

    try {
      errorMessage = await res.text();
    } catch (err) {
      console.error("Erro ao processar resposta da API", err);
    }

    throw new Error(`Erro na API: ${res.status} - ${errorMessage}`);
  }

  return res;
}
