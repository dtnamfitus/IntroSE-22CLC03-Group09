const Book = require('../models/book.model');
const { Op, Sequelize } = require('sequelize');

const bookService = {
  async getAllBooks() {
    try {
      const books = await Book.findAll({ raw: true });
      return books;
    } catch (error) {
      throw error;
    }
  },

  async getBookById(id) {
    try {
      const book = await Book.findOne({
        where: { id },
        raw: true,
      });
      return book;
    } catch (error) {
      throw error;
    }
  },

  async countBooks(query, from, to) {
    try {
      const option = {};
      if (query.name && query.name !== '' && query.name !== null) {
        option.where = {
          title: { [Op.iLike]: `%${query.name}%` },
        };
      }
      if (
        query.cat &&
        query.cat !== 0 &&
        query.cat !== null &&
        query.cat !== '0'
      ) {
        option.where = {
          categoryId: query.cat,
        };
      }
      if (from && to) {
        option.where = {
          price: {
            [Op.gte]: from,
            [Op.lte]: to,
          },
        };
      }

      const count = await Book.count({
        where: option,
      });

      return count;
    } catch (error) {
      throw error;
    }
  },

  async searchBook(query, from, to) {
    try {
      // Đảm bảo giá trị mặc định cho query.name và query.cat nếu undefined
      const name = query.name || ''; // Nếu không có query.name, sử dụng chuỗi rỗng
      const category = query.cat !== undefined ? query.cat : 0; // Nếu không có query.cat, sử dụng 0

      // Tạo điều kiện where
      const whereConditions = {
        [Op.and]: [
          name
            ? { title: { [Op.iLike]: `%${name}%` } } // Tìm kiếm nếu name không rỗng
            : null,
          category === 0
            ? { categoryId: { [Op.ne]: null } } // Nếu category là 0, lấy tất cả các category
            : { categoryId: category }, // Nếu có category, lọc theo categoryId
          { price: { [Op.gte]: from } }, // Giá lớn hơn hoặc bằng `from`
          { price: { [Op.lte]: to } }, // Giá nhỏ hơn hoặc bằng `to`
        ].filter(Boolean), // Loại bỏ các điều kiện null hoặc undefined
      };

      // Truy vấn cơ sở dữ liệu
      const books = await Book.findAll({
        where: whereConditions,
        raw: true,
      });

      return books;
    } catch (error) {
      throw error; // Ném lỗi để caller xử lý
    }
  },

  async searchBookByLimit(query, startingLimit, resultPerPage, from, to) {
    try {
      const option = {
        offset: startingLimit,
        limit: resultPerPage,
        raw: true,
      };
      if (query.name && query.name !== '' && query.name !== null) {
        option.where = {
          title: { [Op.iLike]: `%${query.name}%` },
        };
      }
      if (
        query.cat &&
        query.cat !== 0 &&
        query.cat !== null &&
        query.cat !== '0'
      ) {
        option.where = {
          categoryId: query.cat,
        };
      }
      if (from && to) {
        option.where = {
          price: {
            [Op.gte]: from,
            [Op.lte]: to,
          },
        };
      }
      const books = await Book.findAll(option);
      return books;
    } catch (error) {
      throw error;
    }
  },

  async getBooksByCategoryId(categoryId) {
    try {
      const books = await Book.findAll({
        where: { categoryId },
        raw: true,
      });
      return books;
    } catch (error) {
      throw error;
    }
  },

  async getRelatedBooks(categoryId) {
    try {
      const books = await Book.findAll({
        where: { categoryId },
        limit: 4,
        order: Sequelize.literal('RANDOM()'),
        raw: true,
      });
      return books;
    } catch (error) {
      throw error;
    }
  },

  async getBooksLimit(startingLimit, resultPerPage) {
    try {
      const books = await Book.findAll({
        offset: startingLimit,
        limit: resultPerPage,
        raw: true,
      });
      return books;
    } catch (error) {
      throw error;
    }
  },

  async searchBookAndSortedByLimit(
    query,
    startingLimit,
    resultPerPage,
    from,
    to
  ) {
    try {
      const whereConditions = {
        [Op.and]: [
          query.name ? { title: { [Op.iLike]: `%${query.name}%` } } : null,
          query.cat === 0
            ? { categoryId: { [Op.ne]: null } }
            : { categoryId: query.cat },
          { price: { [Op.gte]: from } },
          { price: { [Op.lte]: to } },
        ].filter(Boolean),
      };

      const orderBy =
        query.sort === 'desc'
          ? [['title', 'DESC']]
          : query.sort === 'asc'
          ? [['title', 'ASC']]
          : [['price', 'ASC']];

      const books = await Book.findAll({
        offset: startingLimit,
        limit: resultPerPage,
        where: whereConditions,
        order: orderBy,
        raw: true,
      });

      return books;
    } catch (error) {
      throw error;
    }
  },

  async countBookAndSortedByLimit(
    query,
    startingLimit,
    resultPerPage,
    from,
    to
  ) {
    try {
      const whereConditions = {
        [Op.and]: [
          query.name ? { title: { [Op.iLike]: `%${query.name}%` } } : null,
          query.cat === 0
            ? { categoryId: { [Op.ne]: null } }
            : { categoryId: query.cat },
          { price: { [Op.gte]: from } },
          { price: { [Op.lte]: to } },
        ].filter(Boolean),
      };

      const orderBy =
        query.sort === 'desc'
          ? [['title', 'DESC']]
          : query.sort === 'asc'
          ? [['title', 'ASC']]
          : [['price', 'ASC']];

      const count = await Book.count({
        offset: startingLimit,
        limit: resultPerPage,
        where: whereConditions,
        order: orderBy,
        raw: true,
      });

      return count;
    } catch (error) {
      throw error;
    }
  },

  async getLatestBooks() {
    try {
      const latestBooks = await Book.findAll({
        order: [['createdAt', 'DESC']],
        limit: 4,
        raw: true,
      });
      return latestBooks;
    } catch (error) {
      throw error;
    }
  },

  async updateBookById(bookId, data) {
    try {
      const result = await Book.update(data, {
        where: { id: bookId },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteBookById(bookId) {
    try {
      const result = await Book.destroy({
        where: { id: bookId },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  async createBook(data) {
    try {
      await Book.sync();
      const result = await Book.create(data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteBookByAuthor(idAuthor) {
    try {
      const result = await Book.destroy({
        where: { authorId: idAuthor },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteBookByPublisher(idPub) {
    try {
      const result = await Book.destroy({
        where: { publisherId: idPub },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteBookByCategory(idCat) {
    try {
      const result = await Book.destroy({
        where: { categoryId: idCat },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = bookService;
