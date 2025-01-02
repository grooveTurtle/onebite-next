import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import style from "./[id].module.css";
import fetchOneBook from "@/lib/fetch-one-book";
import { useRouter } from "next/router";
import Head from "next/head";

// const mockData = {
//   id: 1,
//   title: "한 입 크기로 잘라 먹는 리액트",
//   subTitle: "자바스크립트 기초부터 애플리케이션 배포까지",
//   description:
//     "자바스크립트 기초부터 애플리케이션 배포까지\n처음 시작하기 딱 좋은 리액트 입문서\n\n이 책은 웹 개발에서 가장 많이 사용하는 프레임워크인 리액트 사용 방법을 소개합니다. 인프런, 유데미에서 5000여 명이 수강한 베스트 강좌를 책으로 엮었습니다. 프런트엔드 개발을 희망하는 사람들을 위해 리액트의 기본을 익히고 다양한 앱을 구현하는 데 부족함이 없도록 만들었습니다. \n\n자바스크립트 기초 지식이 부족해 리액트 공부를 망설이는 분, 프런트엔드 개발을 희망하는 취준생으로 리액트가 처음인 분, 퍼블리셔나 백엔드에서 프런트엔드로 직군 전환을 꾀하거나 업무상 리액트가 필요한 분, 뷰, 스벨트 등 다른 프레임워크를 쓰고 있는데, 실용적인 리액트를 배우고 싶은 분, 신입 개발자이지만 자바스크립트나 리액트 기초가 부족한 분에게 유용할 것입니다.",
//   author: "이정환",
//   publisher: "프로그래밍인사이트",
//   coverImgUrl:
//     "https://shopping-phinf.pstatic.net/main_3888828/38888282618.20230913071643.jpg",
// };

// SSR
// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   // 해당 페이지는 애초에 id가 무조건 있어야 하므로, 타입단언(!)를 사용해도 문제없다.
//   const id = context.params!.id; // 기본적으로 string을 반환.
//   const book = await fetchOneBook(Number(id));

//   return {
//     props: {
//       book,
//     },
//   };
// };

// export default function Page({
//   book,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   if (!book) {
//     return "문제가 발생했습니다. 다시 시도해주세요";
//   }

//   const { title, subTitle, description, author, publisher, coverImgUrl } = book;

//   return (
//     <div className={style.container}>
//       <div
//         style={{ backgroundImage: `url('${coverImgUrl}')` }}
//         className={style.cover_img_container}
//       >
//         <img src={coverImgUrl} />
//       </div>
//       <div className={style.title}>{title}</div>
//       <div className={style.subTitle}>{subTitle}</div>
//       <div className={style.author}>
//         {author} | {publisher}
//       </div>
//       <div className={style.description}>{description}</div>
//     </div>
//   );
// }

// SSG
export const getStaticPaths = () => {
  return {
    paths: [
      { params: { id: "1" } },
      { params: { id: "2" } },
      { params: { id: "3" } },
    ],

    // fallback 처리가 false일시 허용되지 않는 params.id로 접근시 not found 페이지로 이동
    // fallback: false,

    // blocking 옵션 처리시, 빌드 타임에 생성 되지 않은 페이지에 대해서는 SSR 방식으로 동작하여 페이지를 생성한다.
    // 생성 된 이후에는 정적 페이지로 동작한다.
    // 당연한 소리겠지만, 페이지 크기가 클 수록 정적 파일을 생성하는 코스트가 크기 때문에 사용에 유의해야한다.
    // + 참고로 pre-fecth에도 영향 받으므로, 스크롤링이나 마우스호버 등의 액션으로 인해 굳이 페이지 접근하지 않아도 정적 페이지 생성이 이뤄진다.
    fallback: "blocking",

    // fallback이 true일 경우, 빌드 타임에 생성되지 않은 페이지에 대해서는 404 페이지로 이동하지 않고,
    // 클라이언트 사이드에서 fetch하여 페이지를 생성한다.
    // 즉, props가 없는 페이지를 우선 반환하여 페이지가 렌더링 되고, 이후에 props만 따로 반환하여 데이터가 있는 페이지로 전환된다.
    // blocking 때와 마찬가지로, 미리 선언된 path가 아닌경우 정적 파일을 생성한다.
    // 아래의 예시라고 하면 getStaticProps가 나중에 계산 된다고 생각하면 된다.
    // fallback: true,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  // 해당 페이지는 애초에 id가 무조건 있어야 하므로, 타입단언(!)를 사용해도 문제없다.
  const id = context.params!.id; // 기본적으로 string을 반환.
  const book = await fetchOneBook(Number(id));

  if (!book) {
    // book 데이터가 없을 경우, 404 페이지로 이동
    return {
      notFound: true,
    };
  }

  return {
    props: {
      book,
    },
  };
};

export default function Page({
  book,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  // fallback blocking이나 true인경우, fallback 상태에 빠져있는 경우에 로딩 처리 등을 표시하기 위함.
  if (router.isFallback) {
    return (
      <>
        <Head>
          <title>한입북스</title>
          <meta property="og:image" content="/thumbnail.png" />
          <meta property="og:title" content="한입북스" />
          <meta
            property="og:description"
            content="한입북스에 등록된 도서들을 만나보세요!"
          />
        </Head>
        <div>로딩중입니다.</div>
      </>
    );
  }

  if (!book) {
    return "문제가 발생했습니다. 다시 시도해주세요";
  }

  const { title, subTitle, description, author, publisher, coverImgUrl } = book;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:image" content={coverImgUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <div className={style.container}>
        <div
          style={{ backgroundImage: `url('${coverImgUrl}')` }}
          className={style.cover_img_container}
        >
          <img src={coverImgUrl} />
        </div>
        <div className={style.title}>{title}</div>
        <div className={style.subTitle}>{subTitle}</div>
        <div className={style.author}>
          {author} | {publisher}
        </div>
        <div className={style.description}>{description}</div>
      </div>
    </>
  );
}
