const urls = [
  'https://klocast.com/',
  'https://klocast.com/podcast/episode-1/',
  'https://klocast.com/podcast/beginner-1-your-own-domain/',
  'https://klocast.com/feed/podcast/',
  'https://klocast.kloclabs.com/',
];
for (const url of urls) {
  const response = await fetch(url, { redirect: 'manual' });
  console.log(
    `${response.status}\t${url}${response.headers.get('location') ? `\t→ ${response.headers.get('location')}` : ''}`,
  );
}
