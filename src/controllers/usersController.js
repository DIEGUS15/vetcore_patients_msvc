import { getUsers, getUsersByRole } from "../services/authService.js";

/**
 * Obtiene la lista de usuarios desde el Auth Service
 */
export const fetchUsers = async (req, res) => {
  try {
    const { page, limit, role } = req.query;

    // Obtener el token del header Authorization
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
      });
    }

    let users;
    if (role) {
      // Si se especifica un rol, filtrar por rol
      users = await getUsersByRole(role, token);
      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } else {
      // Obtener todos los usuarios con paginación
      const response = await getUsers({ page, limit, token });
      return res.status(200).json(response);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(503).json({
      success: false,
      message: "Could not fetch users from Auth Service",
      error: error.message,
    });
  }
};
