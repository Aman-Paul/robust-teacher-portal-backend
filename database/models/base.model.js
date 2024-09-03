const { Model, DataTypes } = require('sequelize');

class BaseModel extends Model {
  static init(attributes, options) {
    const baseAttributes = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uniqueId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    };

    const mergedAttributes = { ...baseAttributes, ...attributes };

    return super.init(mergedAttributes, {
      ...options,
      hooks: {
        ...options.hooks,
        beforeCreate: async (instance, options) => {
          if (options.hooks.beforeCreate) {
            await options.hooks.beforeCreate(instance, options);
          }
        },
        beforeUpdate: async (instance, options) => {
          if (options.hooks.beforeUpdate) {
            await options.hooks.beforeUpdate(instance, options);
          }
        },
      },
    });
  }

  static associate(models) {
    // This method can be overridden in child models to define associations
  }
}

module.exports = BaseModel;