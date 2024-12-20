const Category = require('../models/category.model');

const categoryService = {
  async getAllCategories() {
    try {
      return await Category.findAll({ raw: true });
    } catch (error) {
      throw error;
    }
  },

  createCategory: async (newName, newImgUrl) => {
    try {
      return await Category.create({
        name: newName,
        img_url: newImgUrl,
      });
    } catch (error) {
      throw error;
    }
  },

  getCategoryById: async (idCat) => {
    try {
      return await Category.findOne({
        where: {
          id: idCat,
        },
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  },

  updateCategoryById: async (idCat, newName) => {
    try {
      return await Category.update({ name: newName }, { where: { id: idCat } });
    } catch (error) {
      throw error;
    }
  },

  updateCatImgById: async (idCat, url) => {
    try {
      return await Category.update({ img_url: url }, { where: { id: idCat } });
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (idCat) => {
    try {
      return await Category.destroy({ where: { id: idCat } });
    } catch (error) {
      throw error;
    }
  },
};

module.exports = categoryService;
