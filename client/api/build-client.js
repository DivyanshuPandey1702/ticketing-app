import axios from "axios";
import { parse } from "cookie";
import https from "https";

const createApiClient = (baseURL, headers = {}) => {
  const api = axios.create({
    baseURL,
    headers,
    withCredentials: true, // Ensure credentials like cookies are sent with the request
    httpsAgent: new https.Agent({
      rejectUnauthorized: false, // This allows self-signed certificates
    }),
  });
  console.log("is it there ", headers.cookie);
  let accessToken;
  if (headers.cookie) {
    const accessTokenString = parse(headers.cookie).accessToken;
    if (typeof accessTokenString === "string") {
      accessToken = parse(headers.cookie).accessToken;
    } else {
      accessToken = null;
    }
  }

  // Response Interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          console.log(headers.cookie);
          const requestApiToServerWhileInSSR = axios.create({
            baseURL:
              "https://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: {
              ...headers,
              Cookie: headers.cookie || "",
            },
            withCredentials: true,
            httpsAgent: new https.Agent({
              rejectUnauthorized: false, // This allows self-signed certificates
            }),
          });
          const { data } = await requestApiToServerWhileInSSR.post(
            "/api/users/refresh-token",
            {},
            { withCredentials: true }
          );
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          accessToken = data.accessToken;
          return axios.request(error.config);
        } catch (err) {
          console.error("Refresh token failed", err);
        }
      }
      return Promise.reject(error);
    }
  );

  // Request Interceptor
  api.interceptors.request.use((config) => {
    console.log("accessToken:", accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  return api;
};

export default ({ req }) => {
  // Determine if we are on the server or the browser
  // Server-side API client
  return createApiClient(
    "https://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    req.headers // Pass headers from the incoming request,
  );
};
