import { userProps, messageProps } from '@/interface/data';
import { useEffect, useState } from 'react';

export default function Empty({ users, currentUser, value, setValue }: { users: Array<userProps>, currentUser: userProps, value: number, setValue: (value: number) => void }) {

    const [data, setData] = useState<messageProps[]>([])

    const getData = async () => {
        const respose = await fetch(`http://localhost:3333/chat/${currentUser.id}/${value}`,{
            credentials: 'include',
        });
        const result = await respose.json()
        setData(Array.from(result))
    }
    useEffect(() => {
        getData()
    }, [value])

    return (
        <div className="flex-auto w-64 bg-white">
            {
                data.map((itm) => (
                    <div className="">
                        {itm.text}
                    </div>
                ))
            }
        </div>
    );
}
