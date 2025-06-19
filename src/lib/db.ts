import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres", // or "sqlite"
  logging: false,
});

// User model
export const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  username: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING, allowNull: false },
});

// Project model
export const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM("progress", "completed", "not_started"), defaultValue:"not_started"},
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

// Note model
export const Note = sequelize.define("Note", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: { type: DataTypes.STRING, allowNull: false },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

// Associations
User.hasMany(Project, { foreignKey: "userId", onDelete: "CASCADE" });
Project.belongsTo(User, { foreignKey: "userId" });

Project.hasMany(Note, { foreignKey: "projectId", onDelete: "CASCADE" });
Note.belongsTo(Project, { foreignKey: "projectId" });

// Initialize DB connection and sync (call this once on server startup)
export async function initDB() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true }); // alter true updates schema without dropping tables
}

export default sequelize;
