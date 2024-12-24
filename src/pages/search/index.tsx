import SearchableLayout from "@/components/searchable-layout";
import { ReactNode, useEffect, useState } from "react";
// import books from "@/mock/books.json";
import BookItem from "@/components/book-item";
// import {
//   GetServerSidePropsContext,
//   GetStaticPropsContext,
//   InferGetServerSidePropsType,
// } from "next";
import fetchBooks from "@/lib/fetch-books";
import { useRouter } from "next/router";
import { BookData } from "@/types";

//SSR
// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const q = context.query.q;
//   const books = await fetchBooks(q as string);

//   return {
//     props: {
//       books,
//     },
//   };
// };

// export default function Page({
//   books,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   return (
//     <div>
//       {books.map((book) => (
//         <BookItem key={book.id} {...book} />
//       ))}
//     </div>
//   );
// }

/**
 * SSG 방식으로는 아래와 같이 작성할 수 없다.
 * 빌드 시점에 한 번만 수행하는 것인데, 빌드 시점에서는 parameter를 알 수 없기 때문이다.
 * 따라서 아래와 같이 context.query는 존재하지 않는다.
 * 굳이 SSG로 작성된 페이지에 parameter를 전달하려면, 클라이언트 사이드에서 fetch 하여 사용한다.
 **/
// export const getStaticProps = async (context: GetStaticPropsContext) => {
//   const q = context.query.q;
//   const books = await fetchBooks(q as string);

//   return {
//     props: {
//       books,
//     },
//   };
// };

export default function Page() {
  const [books, setBooks] = useState<BookData[]>([]);
  const router = useRouter();
  const q = router.query.q;

  const fetchSearchResult = async () => {
    const data = await fetchBooks(q as string);
    setBooks(data);
  };

  useEffect(() => {
    if (q) fetchSearchResult();
  }, [q]);

  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
