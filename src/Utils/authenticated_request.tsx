// Function to make authenticated requests
export async function makeAuthenticatedRequest(url, options = {}) {
  const {
    method = "GET",
    body = null,
    contentType = "application/json",
    redirect = true,
    authenticate = true,
  } = options;

  const token = localStorage.getItem("access_token");
  const headers = authenticate ? { Authorization: `Bearer ${token}` } : {};

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  const requestOptions = {
    method,
    headers,
    body: body
      ? contentType === "application/json"
        ? JSON.stringify(body)
        : body
      : null,
  };

  const response = await fetch(url, requestOptions);

  if (response.status === 401 && authenticate) {
    // Token has expired, attempt refresh
    const refreshToken = localStorage.getItem("refresh_token");
    const refreshResponse = await fetch(
      `${import.meta.env.VITE_API_HOST}/token/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (refreshResponse.ok) {
      const { access: newAccessToken } = await refreshResponse.json();
      localStorage.setItem("access_token", newAccessToken);

      // Retry the request with the new access token
      return makeAuthenticatedRequest(url, {
        method,
        body,
        contentType,
        redirect,
        authenticate,
      });
    } else {
      // Clear tokens if refresh fails
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      if (redirect) {
        window.location.href = "/sign-in";
      }
    }
  }

  return response;
}
