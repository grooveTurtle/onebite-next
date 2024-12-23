import { useRouter } from "next/router";

export default function Page() {
  const route = useRouter();
  // id 라는 props 이름으로 들어가있는데, 현재 소스명이 [id]이기 때문에 자동으로 props 설정
  const { id } = route.query;

  return <h1>Book {id}</h1>;
}
