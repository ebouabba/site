import { AppProps } from "@/interface/data";
import EditProfile from "../../components/user/ListBlocked";
import React from "react";
import ListBlocked from "../../components/user/ListBlocked";
// import UserInfo from "../../components/user/Profile";
export default function Home({ currentUser }: AppProps) {
  return (
    <main>
      <ListBlocked currentUser={currentUser} />
    </main>);
}