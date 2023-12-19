const axiosAvisVerifies = require('axios');
const cheerioAvisVerifies = require('cheerio');

async function fetchReviews(url) {
  try {
    const response = await axiosAvisVerifies.get(
      'https://www.avis-verifies.com/avis-clients/' + url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0',
        },
      },
    );

    if (response.status === 200) {
      const html = response.data;
      const $ = cheerioAvisVerifies.load(html);

      const reviews = [];

      $('.reviews__item').each((index, element) => {
        const reviewEntity = {
          id: $(element).attr('id'),
          rating: $(element).find('.review__rating-fact').text(),
          text: $(element).find('.review__text').text(),
          datePublished: $(element).find('.review__data-time').attr('datetime'),
          author: $(element).find('.review__data-name').text(),
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

const websiteUrl = process.argv[2];

fetchReviews(websiteUrl)
  .then((reviews) => {
    console.log(reviews);
  })
  .catch((error) => {
    console.error(error.message);
  });

// Exemple d'utilisation:

// windows 
// node .\src\scraping\review\avis-verifies.service.ts arthur-bonnet.com

// Linux && mac
// node ./src/scraping/review/avis-verifies.service.ts arthur-bonnet.com
