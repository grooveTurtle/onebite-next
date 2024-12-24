// CSS Module 이용
import SearchableLayout from "@/components/searchable-layout";
import style from "./index.module.css";
import { ReactNode, useEffect } from "react";
// import books from "@/mock/books.json";
import BookItem from "@/components/book-item";
import { InferGetServerSidePropsType } from "next";
import fetchBooks from "@/lib/fetch-books";
import fetchRandomBooks from "@/lib/fetch-random-books";

// SSR 방식
// 컴포넌트보다 먼저 실행되어서, 컴포넌트에 필요한 데이터를 불러오는 함수
// 오직 서버측에서만 실행, 딱 사전렌더링 과정에서 한 번만 실행.
export const getServerSideProps = async () => {
  // const allBooks = await fetchBooks();
  // const recoBooks = await fetchRandomBooks();
  // 병렬로 실행
  const [allBooks, recoBooks] = await Promise.all([
    fetchBooks(),
    fetchRandomBooks(),
  ]);

  // 서버에서 실행 되므로 브라우저에선 확인 불가능, 서버 콘솔에만 출력
  console.log("server side props");

  // next.js 에서는 getServerSideProps 함수가 반환하는 객체에 props 라는 키를 포함해야함.
  return {
    props: {
      allBooks,
      recoBooks,
    },
  };
};

// 서버에서 한 번, 브라우저에서 한 번, 총 두 번 실행
export default function Home({
  allBooks,
  recoBooks,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // 서버에서 실행되는 시점에서 window 객체 undefined 오류 발생.
  // window.location
  console.log("allBooks", allBooks);

  // window 객체 등, 클라이언트 단에서만 사용 해야하는 구문이 포함 될 때에는.
  // mount 되는 시점에서만 실행되게끔, useEffect를 활용한다.
  useEffect(() => {
    console.log(window);
  }, []);

  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {recoBooks.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {allBooks.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
    </div>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
