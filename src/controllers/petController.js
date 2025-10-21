import Pet from "../models/Pet.js";

export const getPets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Pet.findAndCountAll({
      where: {
        isActive: true,
      },
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalPets: count,
      petsPerPage: limit,
      pets: rows,
    });
  } catch (error) {
    console.error("Error obtaining pets:", error);
    return res.status(500).json({
      message: "Error obtaining pets",
      error: error.message,
    });
  }
};

export const createPet = async (req, res) => {
  try {
    const { photo, petName, species, breed, age, weight, gender, owner } =
      req.body;

    if (!petName || !owner) {
      return res.status(400).json({
        message: "The petName and owner fields are required.",
      });
    }

    const newPet = await Pet.create({
      photo,
      petName,
      species,
      breed,
      age,
      weight,
      gender,
      owner,
    });

    return res.status(201).json({
      message: "Pet successfully created",
      pet: newPet,
    });
  } catch (error) {
    console.error("Error creating pet:", error);
    return res.status(500).json({
      message: "Error creating pet",
      error: error.message,
    });
  }
};
