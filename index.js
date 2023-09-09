const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000; 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/chapter/:chapterId/verse/:verseId', async (req, res) => {
  const chapterId = req.params.chapterId;
  const verseId = req.params.verseId;

  try {
    const response = await axios.get(`https://www.holy-bhagavad-gita.org/chapter/${chapterId}/verse/${verseId}`);

    const $ = cheerio.load(response.data);
    // search for div id originalVerse in $ (cheerio object)
    const verse = $('#originalVerse').text().trim();   
    const romanized = $('#transliteration').text().trim(); 
    const meaning = $('#wordMeanings').text().trim();
    let translation = $('#translation').text().trim();
   
    // Remove chapter and verse names using regular expressions
    translation = translation.replace(/\b\d+\.\d+:\s*/i, '').replace(/^BG\s+/i, '');

   
    const finalres = [
      {
        verse: verse,
        romanized: romanized,
        wordMeanings: meaning,
        translation: translation
      }
    ];

    res.send(finalres);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the data.');
  }
});

app.get('/chapter/:chapterId', async (req, res) => {
  const chapterId = req.params.chapterId;

  try {
    const response = await axios.get(`https://www.holy-bhagavad-gita.org/chapter/${chapterId}`);
    const $ = cheerio.load(response.data);

    const chaptername = $('h1').text().trim();
    const chapterdeschead = $('.chapterDescHeading').text().trim();
    const chapterdesc = $('.chapterIntro').text().trim();

    // Select all list items and map them individually
    const listItems = [];
    $('.listItem').each((index, element) => {
      let listItemText = $(element).text().replace(/\n/g, '').trim(); // Remove all newline characters
      listItemText = listItemText.replace(/\s+/g, ' '); // Remove extra spaces

      // Remove the specific line using a regular expression
      listItemText = listItemText.replace(/View commentary »/i, '');

      listItems.push(listItemText);
    });

    const finalres = [
      {
        chaptername: chaptername,
        chapterdeschead: chapterdeschead,
        chapterdesc: chapterdesc,
        list: listItems, // Use the modified list items here
      },
    ];

    res.send(finalres);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the data.');
  }
});




module.exports = app;