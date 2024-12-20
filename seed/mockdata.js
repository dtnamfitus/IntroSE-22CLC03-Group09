require('dotenv').config();
const { Sequelize } = require('sequelize');

const Author = require('./../src/models/author.model');
const Book = require('./../src/models/book.model');
const Category = require('./../src/models/category.model');
const Publisher = require('./../src/models/publisher.model');

const crawledData = require('./data.js');

const db = new Sequelize(
  process.env.POSTGRESQL_DATABASE,
  process.env.POSTGRESQL_USERNAME,
  process.env.POSTGRESQL_PASSWORD,
  {
    host: process.env.POSTGRESQL_HOST,
    dialect: 'postgres',
  }
);
console.log(process.env)

db.authenticate()
  .then(() => {
    console.log('Database connected');
  })
  .catch((error) => console.log('Error connecting to the database:', error));

const mangaCategories = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'Slice of Life',
  'Sports',
  'Mystery',
  'Science Fiction',
  'Historical',
  'Supernatural',
  'Martial Arts',
  'Thriller',
];

const mangaCategoriesImages = [
  'https://i.ytimg.com/vi/uhtOY29Oz1I/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLALIO8rJrw6MY2Soxw6j_1url2gJA',
  'https://static1.srcdn.com/wordpress/wp-content/uploads/2024/05/jojos-bizarre-adventure-dragon-ball-zatch-bell.jpg',
  'https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/03/15-best-comedy-manga-ranked-according-to-myanimelist.jpg',
  'https://image.lag.vn/upload/news/24/12/09/anime_QGBQ.jpg',
  'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/03/fantasy-manga-manhwa-with-no-anime.jpg',
  'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/12/mixcollage-27-dec-2023-11-15-am-7879.jpg',
  'https://riki.edu.vn/goc-chia-se/wp-content/uploads/2020/07/Horimiya.jpg',
  'https://static1.dualshockersimages.com/wordpress/wp-content/uploads/wm/2024/01/best-slice-of-life-manga-feature.jpg',
  'https://s2982.pcdn.co/wp-content/uploads/2022/01/sports-manga.png',
  'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/11/Mystery-Manga-No-Anime-Feature-Image.jpg',
  'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/01/best-seinen-sci-fi-manga-feature-image.jpg',
  'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/01/best-historical-romance-manhwas.jpg',
  'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/10/collage-maker-26-oct-2023-08-31-am-2117.jpg',
  'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/05/x-best-martial-arts-manhwa-ranked.jpg',
  'https://imgix.ranker.com/list_img_v2/3407/2743407/original/best-psychological-thriller-manga'
];

const vietnamesePublishers = [
  'Nhà xuất bản Giáo dục Việt Nam',
  'Nhà xuất bản Kim Đồng',
  'Nhà xuất bản Trẻ',
  'Nhà xuất bản Lao Động',
  'Nhà xuất bản Văn Học',
  'Nhà xuất bản Hội Nhà Văn',
  'Nhà xuất bản Chính Trị Quốc Gia Sự Thật',
  'Nhà xuất bản Đại Học Quốc Gia Hà Nội',
  'Nhà xuất bản Khoa Học Tự Nhiên và Công Nghệ',
  'Nhà xuất bản Thời Đại',
];

async function seedPublishers() {
  try {
    for (const name of vietnamesePublishers) {
      await Publisher.findOrCreate({ where: { name } }); // Tránh trùng lặp khi chèn
    }
    console.log('Seed publishers successfully');
  } catch (error) {
    console.error('Error seeding publishers:', error);
  }
}

async function seedCategories() {
  try {
    for (let i = 0; i < mangaCategories.length; i++) {
      await Category.findOrCreate({ where: { name: mangaCategories[i], img_url: mangaCategoriesImages[i]} }); // Tránh trùng lặp khi chèn
    }
    console.log('Seed categories successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

function getRandomMultiple() {
  // Random số trong khoảng từ 3 đến 50 (vì 10,000 * 3 = 30,000 và 10,000 * 50 = 500,000)
  const randomFactor = Math.floor(Math.random() * (50 - 3 + 1)) + 3;
  // Nhân kết quả với 10,000 để có số trong khoảng cần thiết
  return randomFactor * 10000;
}

async function clearDatabase() {
  try {
    console.log('Clearing database...');
    await Book.destroy({ truncate: true, cascade: true });
    await Author.destroy({ truncate: true, cascade: true });
    await Category.destroy({ truncate: true, cascade: true });
    await Publisher.destroy({ truncate: true, cascade: true });
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

const authors = crawledData.map((data) => data.details.author.name);

async function seedAuthors() {
  try {
    for (const name of authors) {
      await Author.findOrCreate({ where: { name } }); // Tránh trùng lặp khi chèn
    }
    console.log('Seed authors successfully');
  } catch (error) {
    console.error('Error seeding authors:', error);
  }
}

async function seedBooks() {
  try {
    for (const data of crawledData) {
      const author = await Author.findOne({
        where: { name: data.details.author.name },
      });
      console.log(author);
      const publishers = await Publisher.findAll();
      const categories = await Category.findAll();

      await Book.findOrCreate({
        where: {
          id: data.id,
          title: data.name,
          authorId: author.id,
          publisherId: publishers[Math.floor(Math.random() * publishers.length)].id, // Random Publisher
          categoryId: categories[Math.floor(Math.random() * categories.length)].id, // Random Category
          releaseYear: Math.floor(Math.random() * (2024 - 2010 + 1)) + 2010, // Năm phát hành ngẫu nhiên
          price: getRandomMultiple(), // Giá mặc định
          description: data.details.description,
          language: 'Vietnamese',
          overallRating: 0,
          imageUrl: data.cover_url,
        },
      });
    }
    console.log('Seed books successfully');
  } catch (error) {
    console.error('Error seeding books:', error);
  }
}
          

async function mockDataFromArray() {
  try {
    await clearDatabase(); // Xóa dữ liệu cũ trước khi mock dữ liệu mới
    await seedPublishers(); // Đảm bảo Publisher được seed trước khi sử dụng
    await seedCategories(); // Đảm bảo Category được seed trước khi sử dụng 
    await seedAuthors(); // Đảm bảo Author được seed trước khi sử dụng
    await seedBooks(); // Đảm bảo Book được seed trước khi sử dụng

    console.log('Data mocked successfully for all entries!');
  } catch (error) {
    console.error('Error mocking data:', error);
  }
}

// Dữ liệu crawl sẽ cung cấp danh sách các sách và thông tin chi tiết
mockDataFromArray();
