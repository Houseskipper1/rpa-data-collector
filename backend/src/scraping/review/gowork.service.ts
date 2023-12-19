const axiosGoWork = require('axios');
const cheerioGoWork = require('cheerio');

async function fetchReviewsGoWork(url) {
  try {
    const response = await axiosGoWork.get('https://gowork.fr/' + url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0',
      },
    });

    if (response.status === 200) {
      const html = response.data;
      const $ = cheerioGoWork.load(html);

      const reviews = [];

      $('.review').each((index, element) => {
        const reviewEntity = {
          id: $(element).attr('id'),
          rating: $(element).find('.review__rating').text(),
          text: $(element).find('.review__content p').text(),
          datePublished: $(element).find('.review__date').attr('datetime'),
          author: $(element).find('.review__nick').attr('datetime'),
        };
        reviews.push(reviewEntity);
      });

      return reviews;
    } else {
      throw new Error(
        `Erreur lors de la récupération de la page: ${response.status}`,
      );
    }
  } catch (error) {
    throw new Error(`Erreur: ${error.message}`);
  }
}

const entrepriseName = process.argv[2];

fetchReviewsGoWork(entrepriseName)
  .then((reviews) => {
    console.log(reviews);
  })
  .catch((error) => {
    console.error(error.message);
  });

// Exemple d'utilisation:
// node .\src\reviews\gowork.service.ts sarl-favata-saint-julien-les-metz
