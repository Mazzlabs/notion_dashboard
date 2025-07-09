require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Initiate OAuth 2.0 flow for GitHub
app.get('/notion/authorize', (req, res) => {
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    scope: 'repo',
    state: Math.random().toString(36).substring(2)
  };
  const url = `https://github.com/login/oauth/authorize?${querystring.stringify(params)}`;
  res.redirect(url);
});

// Exchange code for access token
app.post('/notion/token', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }
  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI
      },
      { headers: { Accept: 'application/json' } }
    );
    res.json(tokenResponse.data);
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// Unfurl URLs for rich previews in Notion
app.post('/unfurl', async (req, res) => {
  const { url, access_token } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Missing url in request' });
  }

  try {
    const parsed = new URL(url);
    let preview = {};

    if (parsed.hostname === 'github.com') {
      const [ , owner, repo ] = parsed.pathname.split('/');
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      const headers = {};
      if (access_token) {
        headers.Authorization = `token ${access_token}`;
      }
      const repoData = (await axios.get(apiUrl, { headers })).data;
      preview = {
        title: repoData.full_name,
        description: repoData.description,
        image: repoData.owner.avatar_url,
        stats: { stars: repoData.stargazers_count, forks: repoData.forks_count },
        url
      };
    } else if (parsed.hostname.includes('leetcode.com')) {
      // Stubbed LeetCode preview
      preview = {
        title: 'LeetCode Resource',
        description: 'Live preview for LeetCode not yet implemented.',
        image: '',
        stats: {},
        url
      };
    } else {
      // Fallback stub for other domains
      preview = { title: url, description: '', image: '', stats: {}, url };
    }

    res.json(preview);
  } catch (error) {
    console.error('Unfurl error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Unfurl processing failed' });
  }
});

// Return a curated list of software design patterns
const patternData = [
  {
    pattern: 'Singleton',
    type: 'Creational',
    resource: 'https://refactoring.guru/design-patterns/singleton',
    useCase: 'Ensure a class has only one instance.'
  },
  {
    pattern: 'Observer',
    type: 'Behavioral',
    resource: 'https://refactoring.guru/design-patterns/observer',
    useCase: 'Notify dependent objects when state changes.'
  },
  {
    pattern: 'Factory Method',
    type: 'Creational',
    resource: 'https://refactoring.guru/design-patterns/factory-method',
    useCase: 'Create objects without specifying the exact class.'
  }
];

app.get('/design-patterns', (req, res) => {
  res.json(patternData);
});

app.listen(port, () => {
  console.log(`Link-preview server running on http://localhost:${port}`);
});
