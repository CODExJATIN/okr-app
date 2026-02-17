 # WHY PRISMA

- easy learning curve
    - high abstaction & limited SQL control but makes it easier to write simple queries and also has support to write rawQueries that are not prone to SQL injection , so its safe


- best for REST API where you dont need to write a lot of boilerplate for simple CRUD operations
    - fast development & clean code
        - Drizzle can be great in the hands of a single developer who knows SQL or prefers learning it. But once you have a team, Prisma removes the friction and knowledge risk that slows you down.


- prisma → fully type-safe
- drizzle→ only results are type safe(you can mess up while building queries)


With Prisma, your data model lives in a single file: schema.prisma.

- **It’s explicit**: No need to infer types your schema is right there.
- **It’s readable**: Even non-technical teammates can understand your models and relationships.

#### prisma schema
```
model User {
  id    Int     @id @default(autoincrement())
  name  String?
  email String  @unique
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  authorId  Int?
  author    User?   @relation(fields: [authorId], references: [id])
}
```

#### drizzle schema
```
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  email: varchar('email', { length: 256 }).unique(),
})

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  content: text('content'),
  published: boolean('published'),
  authorId: integer('author_id').references(() => users.id),
})
```