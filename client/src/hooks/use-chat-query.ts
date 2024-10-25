import { getMessagesQuery } from "@/actions/message.api"
import { useStateProvider } from "@/context/state-context";
import { MessageType } from "@/utils/types";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ChatQueryProps {
    from: number;
    to: number;
}

export function useChatQuery({from, to}: ChatQueryProps) {
    const [{ socket, userInfo, currentChatUser }] = useStateProvider();

    const fetchMessages = async ({ pageParam = 0 }: any) => {
        const { items, nextCursor }: {items: MessageType[], nextCursor: any} = await getMessagesQuery({ from, to, cursor: pageParam });

        return { items, nextCursor };
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["chatMessages", { from: userInfo?.id, to: currentChatUser?.id }],
        queryFn: fetchMessages,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchInterval: socket?.current ? false : 1000,
    });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    };
};