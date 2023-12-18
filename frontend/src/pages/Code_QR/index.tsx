import { AppProps } from "@/interface/data";

import React from "react";
import Code_QR from "../../components/user/Code_QR";
// import UserInfo from "../../components/user/Profile";
export default function Home({ currentUser }: AppProps) {
  return (
    <main>
      <Code_QR currentUser={currentUser} />
    </main>);
}