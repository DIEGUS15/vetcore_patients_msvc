import axios from "axios";

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3000";

/**
 * Cliente HTTP para comunicarse con el Auth Service
 */
const authServiceClient = axios.create({
  baseURL: AUTH_SERVICE_URL,
  timeout: 5000, // 5 segundos de timeout
});

/**
 * Obtiene la lista de usuarios del Auth Service
 * @param {Object} options - Opciones de paginación y token
 * @returns {Promise<Object>} Lista de usuarios
 */
export const getUsers = async (options = {}) => {
  try {
    const { page = 1, limit = 100, token } = options;
    const response = await authServiceClient.get("/api/users", {
      params: { page, limit },
      headers: token ? { Authorization: token } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users from Auth Service:", error.message);
    throw new Error("Could not fetch users from Auth Service");
  }
};

/**
 * Verifica si un usuario existe por email
 * @param {string} email - Email del usuario
 * @param {string} token - Token JWT para autenticación (opcional)
 * @returns {Promise<boolean>} True si el usuario existe
 */
export const userExistsByEmail = async (email, token = null) => {
  try {
    const config = {
      params: { page: 1, limit: 1000 }, // Obtener todos los usuarios
    };

    // Agregar token si está disponible
    if (token) {
      config.headers = { Authorization: token };
    }

    const response = await authServiceClient.get(`/api/users`, config);

    if (response.data.success && response.data.data) {
      const users = response.data.data.users;
      return users.some((user) => user.email === email);
    }
    return false;
  } catch (error) {
    console.error(
      "Error checking user existence from Auth Service:",
      error.message
    );
    return false;
  }
};

/**
 * Obtiene usuarios filtrados por rol (ej: solo clientes)
 * @param {string} roleName - Nombre del rol a filtrar
 * @param {string} token - Token de autenticación
 * @returns {Promise<Array>} Lista de usuarios con ese rol
 */
export const getUsersByRole = async (roleName = "client", token = null) => {
  try {
    const response = await authServiceClient.get("/api/users", {
      params: { page: 1, limit: 1000 }, // Obtener todos
      headers: token ? { Authorization: token } : {},
    });

    if (response.data.success && response.data.data) {
      const users = response.data.data.users;
      return users.filter((user) => user.role?.name === roleName);
    }
    return [];
  } catch (error) {
    console.error(
      "Error fetching users by role from Auth Service:",
      error.message
    );
    throw new Error("Could not fetch users by role from Auth Service");
  }
};
