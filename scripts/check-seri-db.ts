import { db } from '../lib/db/index';

async function check() {
  const result = await db.query.posts.findMany({
    where: (posts, { isNotNull }) => isNotNull(posts.seriesId),
    columns: { slug: true, title: true, seriesId: true, seriesOrder: true, status: true, publishedAt: true },
  });
  console.log('Total seri posts in DB:', result.length);
  console.log('---');
  result.forEach(p => console.log(p.seriesId, '|', p.seriesOrder, '|', p.status, '|', p.slug));
  process.exit(0);
}
check().catch(e => { console.error(e); process.exit(1); });
