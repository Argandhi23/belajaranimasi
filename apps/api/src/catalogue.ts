import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Database } from './database.js';
import { Prisma } from './generated/prisma/client.js';
import { AnimationQuery } from './dto.js';
import { searchTokens } from './search.js';
const include = {
  category: { select: { slug: true, name: true } },
  tags: { select: { tag: { select: { name: true } } } },
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
    const categoryJoin = query.category
      ? Prisma.sql`JOIN "AnimationCategory" c ON c.id = a."categoryId"`
      : Prisma.empty;
    const category = query.category
      ? Prisma.sql`AND c.slug=${query.category}`
      : Prisma.empty;
    const difficulty = query.difficulty
      ? Prisma.sql`AND a.difficulty::text=${query.difficulty}`
      : Prisma.empty;
    // Single-snapshot CTE fetches total count and ordered page IDs in one DB round-trip without transaction overhead.
    const [pageResult] = await this.db.$queryRaw<
      { total: number; ids: string[] }[]
    >(
      Prisma.sql`
        WITH matched AS (
          SELECT a.id, a."createdAt", a.slug
          FROM "Animation" a
          ${categoryJoin}
          WHERE a.published = true ${search} ${category} ${difficulty}
        ),
        paged AS (
          SELECT id, "createdAt", slug
          FROM matched
          ORDER BY "createdAt", slug
          LIMIT ${query.limit} OFFSET ${(query.page - 1) * query.limit}
        )
        SELECT
          (SELECT count(*)::int FROM matched) AS total,
          COALESCE((SELECT array_agg(id ORDER BY "createdAt", slug) FROM paged), ARRAY[]::text[]) AS ids
      `,
    );
    const total = Number(pageResult?.total ?? 0);
    const ids = pageResult?.ids ?? [];
    if (ids.length === 0) {
      return {
        items: [],
        total,
        page: query.page,
        limit: query.limit,
      };
    }
    const rows = await this.db.animation.findMany({
      where: { id: { in: ids }, published: true },
      include,
    });
    const byId = new Map(rows.map((row) => [row.id, row]));
    const ordered = ids.flatMap((id) => {
      const row = byId.get(id);
      return row ? [row] : [];
    });
    return {
      items: ordered.map(serialize),
      total,
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
