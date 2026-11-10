import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Database } from './database.js';
import { Prisma } from './generated/prisma/client.js';
import { AnimationQuery } from './dto.js';
import { searchTokens } from './search.js';
const include = {
  category: { select: { slug: true, name: true } },
  tags: { include: { tag: true } },
} satisfies Prisma.AnimationInclude;
type Record = Prisma.AnimationGetPayload<{ include: typeof include }>;
function serialize(record: Record) {
  const {
    categoryId: _categoryId,
    tags,
    createdAt,
    updatedAt,
    ...rest
  } = record;
  void _categoryId; // Internal foreign key is deliberately excluded from the public contract.
  return {
    ...rest,
    tags: tags.map(({ tag }) => tag.name),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}
@Injectable()
export class Catalogue {
  constructor(@Inject(Database) private readonly db: Database) {}
  async list(query: AnimationQuery) {
    const tokens = searchTokens(query.q ?? '');
    // Every meaningful token must occur. All terms are bound parameters, never SQL fragments.
    const predicates = tokens.map(
      (token) =>
        Prisma.sql`a."searchVector" @@ plainto_tsquery('simple', ${token})`,
    );
    const search = predicates.length
      ? Prisma.sql`AND ${Prisma.join(predicates, ' AND ')}`
      : Prisma.empty;
    const category = query.category
      ? Prisma.sql`AND c.slug=${query.category}`
      : Prisma.empty;
    const difficulty = query.difficulty
      ? Prisma.sql`AND a.difficulty::text=${query.difficulty}`
      : Prisma.empty;
    const from = Prisma.sql`FROM "Animation" a JOIN "AnimationCategory" c ON c.id=a."categoryId" WHERE a.published=true ${search} ${category} ${difficulty}`;
    const [counts, matching] = await this.db.$transaction(
      [
        this.db.$queryRaw<{ total: bigint }[]>(
          Prisma.sql`SELECT count(*) AS total ${from}`,
        ),
        this.db.$queryRaw<{ id: string }[]>(
          Prisma.sql`SELECT a.id ${from} ORDER BY a."createdAt",a.slug LIMIT ${query.limit} OFFSET ${(query.page - 1) * query.limit}`,
        ),
      ],
      { isolationLevel: 'RepeatableRead' },
    );
    const ids = matching.map((row) => row.id);
    const rows = await this.db.animation.findMany({
      where: { id: { in: ids }, published: true },
      include,
    });
    const ordered = ids.flatMap((id) => rows.filter((row) => row.id === id));
    return {
      items: ordered.map(serialize),
      total: Number(counts[0]?.total ?? 0),
      page: query.page,
      limit: query.limit,
    };
  }
  async detail(slug: string) {
    const record = await this.db.animation.findFirst({
      where: { slug, published: true },
      include,
    });
    if (!record) throw new NotFoundException('Animasi tidak ditemukan');
    return serialize(record);
  }
  categories() {
    return this.db.animationCategory.findMany({
      select: { slug: true, name: true },
      orderBy: { name: 'asc' },
    });
  }
}
