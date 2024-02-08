document.addEventListener('DOMContentLoaded', () => {
  // Fetch data from Reddit API
  const redditApiUrl = 'https://old.reddit.com/r/politics/rising.json';

  // Fetch data from The New York Times API
  const nytApiKey = 'BNhwJDEVFCAxXchlxVOyWAarOGvKO9Id'; // Replace with your actual API key
  const nytApiUrl = `https://api.nytimes.com/svc/topstories/v2/politics.json?api-key=${nytApiKey}`;

  // Fetch data from NewsAPI
  const newsApiKey = '051d05b5fdd64911800ecbe4e3d293cc'; // Replace with your actual API key
  const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=politics&apiKey=${newsApiKey}`;

  // Function to fetch and populate data
  async function fetchDataAndPopulate() {
    // Reddit's Rising Political Stories
    async function fetchRedditPoliticalStories() {
      try {
        const response = await fetch(redditApiUrl);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const redditData = await response.json();
        const redditPoliticalStories = redditData.data.children
          .slice(0, 15) // Limit to the top 15 items
          .map(child => ({
            title: child.data.title,
            url: `https://old.reddit.com${child.data.permalink}`
          }));

        populateTable('redditPoliticalTableBody', redditPoliticalStories);
      } catch (error) {
        console.error('Error fetching Reddit political stories:', error.message);
      }
    }

    // Top 15 New York Times Political Stories
    async function fetchNytPoliticalStories() {
      try {
        const response = await fetch(nytApiUrl);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const nytPoliticalStories = (await response.json()).results
          .slice(0, 15); // Limit to the top 15 items

        populateTable('nytPoliticalTableBody', nytPoliticalStories);
      } catch (error) {
        console.error('Error fetching New York Times political stories:', error.message);
      }
    }

    // Top NewsAPI Political Stories
async function fetchNewsApiPoliticalStories() {
  try {
    const response = await fetch(newsApiUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const newsApiPoliticalStories = (await response.json()).articles
      .slice(0, 15) // Limit to the top 15 items
      .filter(story => !story.url.includes('espn') && !story.url.includes('youtube.com')&& !story.url.includes('horoscope')&& !story.url.includes('weather'))
      .map(story => ({
        title: story.title,
        url: story.url
      }));

    populateTable('newsApiPoliticalTableBody', newsApiPoliticalStories);
  } catch (error) {
    console.error('Error fetching NewsAPI political stories:', error.message);
  }
}


    // Populate table with data
    function populateTable(tableBodyId, politicalStories) {
      const tableBody = document.getElementById(tableBodyId);

      if (!tableBody) {
        console.error(`Table body with id '${tableBodyId}' not found.`);
        return;
      }

      tableBody.innerHTML = '';

      politicalStories.forEach((story, index) => {
        const row = tableBody.insertRow();
        const numberCell = row.insertCell(0);
        const titleCell = row.insertCell(1);
        const urlCell = row.insertCell(2);

        numberCell.textContent = index + 1;
        titleCell.textContent = story.title;
        urlCell.innerHTML = `<a href="${story.url}" target="_blank">${story.url}</a>`;
      });
      console.log(`Table body with id '${tableBodyId}' found.`);
    }

    // Fetch and populate data
    fetchRedditPoliticalStories();
    fetchNytPoliticalStories();
    fetchNewsApiPoliticalStories();
  }

  // Fetch and populate data initially
  fetchDataAndPopulate();

  // Set up automatic updates every 10 minutes (adjust as needed)
  const updateInterval = 10 * 60 * 1000; // 10 minutes in milliseconds
  setInterval(fetchDataAndPopulate, updateInterval);
});
