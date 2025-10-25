// backend/src/controllers/contentController.js

export async function faq(_req, res, _next) {
  // Replace with DB/CMS later
  res.json([
    { q: 'How does email verification work?', a: 'Click the emailed link to activate your account.' },
    { q: 'What is Wallet Sync?', a: 'Unifies balances and transactions across supported wallets.' },
    { q: 'How do I request a QFS Card?', a: 'Go to Dashboard → Cards and submit your request.' },
  ])
}

export async function news(_req, res, _next) {
  res.json([
    { id: 1, title: 'Platform update', teaser: 'We shipped dashboard improvements.', date: '2025-10-01' },
    { id: 2, title: 'Security note', teaser: 'Best practices for wallet hygiene.', date: '2025-09-20' },
  ])
}

export async function partners(_req, res, _next) {
  res.json([
    'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_Telegram.png',
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/0/08/Google_New_Logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_Twitter.svg',
  ])
}
