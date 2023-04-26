import React, { ReactNode } from "react";
import Navbar from "./navbar/Navbar";
//import Footer from './footer'

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}