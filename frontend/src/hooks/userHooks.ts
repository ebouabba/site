import { userProps } from "@/interface/data";
import { useRouter } from "next/navigation";
import { useEffect } from "react";




export const checkAuth = () => {
    const router = useRouter();
    useEffect(() => {
        try {
            async () => {
                const response = await fetch('http://localhost:3333/auth/user', {
                    credentials: 'include',
                });
                if (response.status != 200 && response.status != 201 ) {
                    router.push('/auth/login');
                    return;
                }
            };
        } catch (error) {
        }
    });
}
export const checklogin = () => {
    const router = useRouter();
    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch('http://localhost:3333/auth/user', {
                        credentials: 'include',
                    });

                    if (response.status == 200) {
                        router.push('/');
                        return;
                    }
                } catch (error) {

                }
            }
        )();
    });
}
export const fetchAllUsers = ({ setUsers, currentUser }:
    { setUsers: (users: any) => void, currentUser: userProps }) => {
    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`http://localhost:3333/users/${currentUser.id}`, {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    setUsers(Array.from(content));
                } catch (error) {

                }
            }
        )();
    }, [currentUser]);
}

interface fetchAllAmisprops {
    setAmis: (amis: any) => void;
    currentUser: userProps
}

export const fetchAllAmis = ({ setAmis, currentUser }: fetchAllAmisprops) => {
    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`http://localhost:3333/friends/accepted-friends/${currentUser.id}`, {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    setAmis(Array.from(content));
                } catch (error) {

                }

            }
        )();
    }, [currentUser]);
}
export const fetchCurrentUser = ({ setCurrentUser }: { setCurrentUser: (currentUser: any) => void }) => {

    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch('http://localhost:3333/auth/user', {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    setCurrentUser(content);
                } catch (error) {

                }
            }
        )();
    }, []);
}
export const getCurrentUser = async () => {
    try {
        const response = await fetch('http://localhost:3333/auth/user', {
            credentials: 'include',
        });
        const content = await response.json();
        return content
    } catch (error) {

    }
}
