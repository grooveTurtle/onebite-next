import GlobalLayout from "@/components/global-layout";
import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactNode } from "react";

type NextpageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

// 모든 page 컴포넌트의 부모 역할을 하는, 전체 페이지의 공통 컴포넌트
// @params Component - page 역할을 할 Component
// @params pageProps - Component에 전달할 props
export default function App({
  Component,
  pageProps,
}: AppProps & { Component: NextpageWithLayout }) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  return <GlobalLayout>{getLayout(<Component {...pageProps} />)}</GlobalLayout>;
}
