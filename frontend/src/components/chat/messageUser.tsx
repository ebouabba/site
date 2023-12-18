import { useEffect, useState } from "react"

interface messageProps {
    id: number
    text: String
    createdAt: string
    updatedAt: string
    senderId: number
    receiverId: number
}

export default function MessageUser() {

    const [data, setData] = useState<messageProps[]>([])

    const getData = async () => {
        const respose = await fetch('http://localhost:3333/chat/all',{
            credentials: 'include',
        })
        const result = await respose.json()
        setData(Array.from(result))
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="">
            {data.map((item) => (
                <>
                    <div className="w-[348px] h-[105px] bg-blue-400 bg-opacity-30">
                        <h1>{item.id}</h1>
                        <h2>{item.text}</h2>
                        <h3>{item.createdAt}</h3>
                    </div>
                </>
            ))}
        </div>
    )
}
