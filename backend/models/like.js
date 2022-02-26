"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      models.Like.belongsTo(models.User, {
        foreignKey: "userId",
      });
      models.Like.belongsTo(models.Post, {
        foreignKey: "postId",
      });
      models.Like.belongsTo(models.Comment, {
        foreignKey: "commentId",
      });
    }
  }
  Like.init(
    {
      commentId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Comment",
          key: "id",
        },
      },
      postId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Post",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Like",
    }
  );
  return Like;
};
