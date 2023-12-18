import { userProps } from "@/interface/data";

export interface handelSendRequestProps {
    id: Number,
    friendId: Number
    setSend: (value: React.SetStateAction<boolean>) => void
}

export const handelSendRequest = async ({ id, friendId, setSend }: handelSendRequestProps) => {
    try {
        const response = await fetch(`http://localhost:3333/friends/send-request/${friendId}/${id}`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {

            setSend((pr) => !pr)


            console.log('Friend request sent successfully.');
        } else {
            console.error('Failed to send friend request.');
        }
    } catch (error) {
        console.error('Error sending friend request:', error);
    }
};