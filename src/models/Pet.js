import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Pet = sequelize.define(
  "Pet",
  {
    petId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    photo: {
      type: DataTypes.STRING(100),
    },
    petName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    species: {
      type: DataTypes.STRING(100),
    },
    breed: {
      type: DataTypes.STRING(100),
    },
    age: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    gender: {
      type: DataTypes.ENUM("macho", "hembra"),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    owner: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },

  {
    tableName: "pets",
    timestamps: true,
  }
);

export default Pet;
