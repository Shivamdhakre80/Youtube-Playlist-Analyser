// Initialize the API client with your key
gapi.load('client', () => {
    gapi.client.init({
      apiKey: 'AIzaSyB7PEbQUNlylF9wnSbyvahaQ1ExDi3KNNU', // Replace with your API key
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
    });
  });
  
  const playlistForm = document.getElementById('playlist-form');
  const resultsDiv = document.getElementById('results');
  
  playlistForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const playlistURL = document.getElementById('playlist-url').value;
    await fetchPlaylistDetails(playlistURL);
  });
  
  async function fetchPlaylistDetails(playlistURL) {
    try {
      // Extract the playlist ID from the URL
      const playlistId = extractPlaylistId(playlistURL);
  
      // Make an API request to fetch playlist items
      const response = await gapi.client.youtube.playlistItems.list({
        part: 'contentDetails',
        playlistId: playlistId,
        maxResults: 50, // You can adjust this based on your requirements
      });
  
      // Calculate the total duration of the playlist
      const playlistItems = response.result.items;
      let totalDurationInSeconds = 0;
  
      for (const item of playlistItems) {
        const videoDuration = item.contentDetails.videoPublishedAt; // Example: "PT4M13S" for 4 minutes and 13 seconds
        const durationInSeconds = parseYouTubeDuration(videoDuration);
        totalDurationInSeconds += durationInSeconds;
      }
  
      // Display the total duration on your webpage
      resultsDiv.innerHTML = `Total Duration (in seconds): ${totalDurationInSeconds}`;
    } catch (error) {
      console.error('Error fetching playlist details:', error);
    }
  }
  
  // Utility function to extract playlist ID from URL
  function extractPlaylistId(playlistURL) {
    const url = new URL(playlistURL);
    const params = new URLSearchParams(url.search);
    return params.get('list');
  }
  
  // Utility function to parse YouTube video duration strings to seconds
  function parseYouTubeDuration(duration) {
    const match = duration.match(/PT(\d+)M(\d+)S/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      return minutes * 60 + seconds;
    }
    return 0;
  }
  
  // Utility functions (e.g., extractPlaylistId, parseYouTubeDuration) go here