import {makeAuthenticatedRequest} from "./authenticated_request.tsx";

export const googleAuth = async (
  credentialResponse,
  { onSuccess, onError }
) => {
  try {
    const { credential } = credentialResponse;
    const response = await makeAuthenticatedRequest(
      `${import.meta.env.VITE_API_HOST}/user/google_login/`,
      {
        method: "POST",
        body: { id_token: credential },
        authenticate: false, // No token needed for Google login
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      localStorage.setItem("access_token", responseData.access);
      localStorage.setItem("refresh_token", responseData.refresh);

      onSuccess && onSuccess(responseData);
    } else {
      onError && onError(responseData.detail);
    }
  } catch (error) {
    console.error(error);
    onError && onError("An error occurred. Please try again.");
  }
};
