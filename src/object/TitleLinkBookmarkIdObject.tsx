export type TitleLinkBookmarkIdObject = {
  bookmarkId: string;
  title: string;
  bookmarkBooks: {
    isbn: string;
  }[];
  bookmarkLibraries: {
    systemId: string;
    libkey: string;
  }[];
  link: string;
};

export type TitleLinkBookmarkIdDto = {
  bookmark_id: string;
  title: string;
  bookmark_books: {
    isbn: string;
  }[];
  bookmark_libraries: {
    system_id: string;
    libkey: string;
  }[];
};

export function dtoToObject(
  dto: TitleLinkBookmarkIdDto
): TitleLinkBookmarkIdObject {
  const isbnCodes = dto.bookmark_books.map((book) => book.isbn).join(",");
  const systemidDetail = dto.bookmark_libraries
    .map((library) => `${library.system_id}:${library.libkey}`)
    .join(",");

  return {
    bookmarkId: dto.bookmark_id,
    title: dto.title,
    bookmarkBooks: dto.bookmark_books.map((book) => ({
      isbn: book.isbn,
    })),
    bookmarkLibraries: dto.bookmark_libraries.map((library) => ({
      systemId: library.system_id,
      libkey: library.libkey,
    })),
    link: `searchResult?prevPage=bookmark&isbn=${isbnCodes}&systemid=${systemidDetail}`,
  };
}
