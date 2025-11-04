(async () => {
  const url = process.argv[2] || 'http://localhost:4000/api/search?q=test';
  try {
    const res = await fetch(url);
    console.log('status', res.status);
    const text = await res.text();
    console.log('body:', text);
  } catch (err) {
    console.error('fetch error', err);
    process.exit(1);
  }
})();
