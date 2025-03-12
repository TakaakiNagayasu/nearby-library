import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import type { TitleLinkBookmarkIdDto } from "../../../object/TitleLinkBookmarkIdObject";
import { dtoToObject } from "../../../object/TitleLinkBookmarkIdObject";
import { googleBooksApiRouter } from "./googleBooksApi/googleBooksApi";
import { calilBooksApiRouter } from "./calilApi/calilBooksApi";
import { calilLibrariesApiRouter } from "./calilApi/calilLibrariesApi";

const prisma = new PrismaClient();

const selectBookmarkValidation = z.object({
  bookmarkId: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().uuid({ message: "Invalid date format" })
  ),
});

const insertBookmarkValidation = z.object({
  title: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().min(1).max(100)
  ),
  isbnCodes: z
    .array(z.string().regex(/^[0-9]{9}[0-9X]$|^[0-9]{12}[0-9X]$/))
    .min(1)
    .max(30),
  systemids: z.array(z.string().min(1).max(100)).min(1).max(30),
  libkeyMap: z.map(
    z.string().min(1).max(100),
    z.set(z.string().min(1).max(100)).min(1).max(30)
  ),
});

const deleteBookmarkValidation = z.object({
  bookmarkId: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().uuid({ message: "Invalid date format" })
  ),
});

export const appRouter = router({
  googleBooksApi: googleBooksApiRouter,

  searchLibrariesFromGeoCode: calilLibrariesApiRouter,

  searchLibrariesFromSystemid: calilLibrariesApiRouter,

  firstSearchCalilBooks: calilBooksApiRouter,

  sessionSearchCalilBooks: calilBooksApiRouter,

  selectBookmark: protectedProcedure
    .input(selectBookmarkValidation)
    .query(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.req, ctx.res, authOptions);
      if (!session || !session.user) {
        throw new Error("User not authenticated");
      }
      const bookmark = await prisma.bookmark.findMany({
        where: {
          bookmark_id: input.bookmarkId,
          id: session.user.id,
        },
        select: {
          bookmark_id: true,
          title: true,
          bookmark_books: {
            orderBy: {
              number: "asc",
            },
            select: {
              isbn: true,
            },
          },
          bookmark_libraries: {
            orderBy: {
              number: "asc",
            },
            select: {
              system_id: true,
              libkey: true,
            },
          },
        },
      });
      return bookmark;
    }),

  selectBookmarks: protectedProcedure.query(async ({ ctx }) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }
    const bookmarks: TitleLinkBookmarkIdDto[] = await prisma.bookmark.findMany({
      where: {
        id: session.user.id,
      },
      select: {
        bookmark_id: true,
        title: true,
        bookmark_books: {
          orderBy: {
            number: "asc",
          },
          select: {
            isbn: true,
          },
        },
        bookmark_libraries: {
          orderBy: {
            number: "asc",
          },
          select: {
            system_id: true,
            libkey: true,
          },
        },
      },
    });

    const titleLinkBookmarkIdObject = bookmarks.map((dto) => dtoToObject(dto));
    return titleLinkBookmarkIdObject;
  }),

  insertBookmark: protectedProcedure
    .input(insertBookmarkValidation)
    .mutation(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.req, ctx.res, authOptions);
      if (!session || !session.user) {
        throw new Error("User not authenticated");
      }
      return insertBookmarkWithRelations({
        title: input.title,
        id: session.user.id,
        isbnCodes: input.isbnCodes,
        systemids: input.systemids,
        libkeyMap: input.libkeyMap,
      });
    }),

  deleteBookmark: protectedProcedure
    .input(deleteBookmarkValidation)
    .mutation(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.req, ctx.res, authOptions);
      if (!session || !session.user) {
        throw new Error("User not authenticated");
      }
      return deleteBookmarkWithRelations({
        bookmarkId: input.bookmarkId,
        id: session.user?.id,
      });
    }),
});

async function insertBookmarkWithRelations({
  title,
  id,
  isbnCodes,
  systemids,
  libkeyMap,
}: {
  title: string;
  id: string;
  isbnCodes: string[];
  systemids: string[];
  libkeyMap: Map<string, Set<string>>;
}) {
  return await prisma.$transaction(async (tx) => {
    const newBookmark = await tx.bookmark.create({
      data: {
        title,
        User: {
          connect: { id: id },
        },
      },
    });

    if (isbnCodes.length > 0) {
      await tx.bookmark_books.createMany({
        data: isbnCodes.map((isbn, idx) => ({
          bookmark_id: newBookmark.bookmark_id,
          number: idx + 1,
          isbn: isbn,
        })),
      });
    }

    if (systemids.length > 0) {
      let idx = 1;

      await tx.bookmark_libraries.createMany({
        data: systemids.flatMap((systemid) =>
          Array.from(libkeyMap.get(systemid) ?? []).map((libkey) => ({
            bookmark_id: newBookmark.bookmark_id,
            number: idx++,
            system_id: systemid,
            libkey: libkey,
          }))
        ),
      });
    }

    return newBookmark.title;
  });
}

async function deleteBookmarkWithRelations({
  bookmarkId,
  id,
}: {
  bookmarkId: string;
  id: string;
}) {
  return await prisma.$transaction(async (tx) => {
    await tx.bookmark_books.deleteMany({
      where: { bookmark_id: bookmarkId },
    });

    await tx.bookmark_libraries.deleteMany({
      where: { bookmark_id: bookmarkId },
    });

    const deletedBookmark = await tx.bookmark.deleteMany({
      where: { bookmark_id: bookmarkId, id: id },
    });

    return deletedBookmark.count;
  });
}

export type AppRouter = typeof appRouter;
