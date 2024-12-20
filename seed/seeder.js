const axios = require('axios');
const fs = require('fs');

(async () => {
  const dataArray = []; // Mảng để lưu trữ dữ liệu từ tất cả các trang
  const detailArray = []; // Mảng để lưu trữ dữ liệu chi tiết

  // Lấy dữ liệu từ tất cả các trang bằng Promise.all
  await Promise.all(
    Array.from({ length: 41 }, (_, i) => i + 1).map(async (page) => {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://cuutruyen.net/api/v2/mangas/recently_updated?page=${page}&per_page=50`,
        headers: {
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          cookie:
            '_ga=GA1.1.634467339.1731310794; _ga_XYX6B3RZGR=GS1.1.1734719401.4.1.1734719420.0.0.0; _ga_TYNM1ECQ13=GS1.1.1734719401.4.1.1734719420.0.0.0; _ga_RXD1MEDV8K=GS1.1.1734719401.4.1.1734719420.0.0.0; _ga_5PDF0YV9VE=GS1.1.1734719401.4.1.1734719420.0.0.0',
          priority: 'u=1, i',
          referer: 'https://cuutruyen.net/',
          'sec-ch-ua':
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
      };

      try {
        const response = await axios.request(config);
        console.log(`Fetched data for page ${page}`);
        dataArray.push(...response.data.data);
      } catch (error) {
        console.error(`Error fetching data for page ${page}:`, error.message);
      }
    })
  );

  // Lấy chi tiết cho từng mục bằng Promise.all
  await Promise.all(
    dataArray.map(async (item) => {
      const detailConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://cuutruyen.net/api/v2/mangas/${item.id}`,
        headers: {
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          cookie:
            '_ga=GA1.1.634467339.1731310794; _ga_XYX6B3RZGR=GS1.1.1734719401.4.1.1734719811.0.0.0; _ga_TYNM1ECQ13=GS1.1.1734719401.4.1.1734719811.0.0.0; _ga_RXD1MEDV8K=GS1.1.1734719401.4.1.1734719811.0.0.0; _ga_5PDF0YV9VE=GS1.1.1734719401.4.1.1734719812.0.0.0',
          priority: 'u=1, i',
          referer: `https://cuutruyen.net/mangas/${item.id}`,
          'sec-ch-ua':
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
      };

      try {
        console.log(`Fetching detail for ID ${item.id}`);
        const detailResponse = await axios.request(detailConfig);
        detailArray.push({ ...item, details: detailResponse.data.data });
      } catch (detailError) {
        console.error(
          `Error fetching detail for ID ${item.id}:`,
          detailError.message
        );
        detailArray.push({ ...item, details: null });
      }
    })
  );

  // Ghi dữ liệu sang file JSON
  fs.writeFileSync('manga_data.json', JSON.stringify(detailArray, null, 2));
  console.log('Data has been written to manga_data.json');
})();
