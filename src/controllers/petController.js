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

export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { photo, petName, species, breed, age, weight, gender, owner } =
      req.body;

    // Buscar la mascota por ID
    const pet = await Pet.findByPk(id);

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    // Verificar que la mascota esté activa
    if (!pet.isActive) {
      return res.status(400).json({
        message: "Cannot update an inactive pet",
      });
    }

    // Preparar datos para actualizar
    const updateData = {
      photo: photo !== undefined ? photo : pet.photo,
      petName: petName || pet.petName,
      species: species !== undefined ? species : pet.species,
      breed: breed !== undefined ? breed : pet.breed,
      age: age !== undefined ? age : pet.age,
      weight: weight !== undefined ? weight : pet.weight,
      gender: gender !== undefined ? gender : pet.gender,
      owner: owner || pet.owner,
    };

    // Actualizar la mascota
    await pet.update(updateData);

    return res.status(200).json({
      message: "Pet successfully updated",
      pet: pet,
    });
  } catch (error) {
    console.error("Error updating pet:", error);
    return res.status(500).json({
      message: "Error updating pet",
      error: error.message,
    });
  }
};

export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la mascota por ID
    const pet = await Pet.findByPk(id);

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    // Verificar si la mascota ya está inactiva
    if (!pet.isActive) {
      return res.status(400).json({
        message: "Pet is already inactive",
      });
    }

    // Soft delete: cambiar isActive a false
    await pet.update({ isActive: false });

    return res.status(200).json({
      message: "Pet successfully deactivated",
      pet: {
        id: pet.id,
        petName: pet.petName,
        isActive: pet.isActive,
      },
    });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return res.status(500).json({
      message: "Error deleting pet",
      error: error.message,
    });
  }
};
