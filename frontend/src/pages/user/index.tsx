import User from "@/components/user/User";
import UserInfo from "../../components/user/UserInfo";
import { AppProps } from "@/interface/data";
export default function Home({ onlineUsersss, currentUser, users, amis }: AppProps) {

  // const re = `/users/[${name}]`

  return (
    <main>
      <User />
    </main>);
}
