import { AppProps, userProps } from "@/interface/data";
import UseProfile from "../../components/user/Profile";
// import UserInfo from "../../components/user/Profile";
export default function Home({ currentUser }: AppProps) {
  return (
    <main>
      <UseProfile />
    </main>);
}