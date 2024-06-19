'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (message: string) => void;
    messages: string[];
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) {
        throw new Error('State is undefined');
    }

    return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<string[]>([])

    const sendMessage: ISocketContext['sendMessage'] = useCallback((message) => {

        if (socket) {
            socket.emit("event:message", { message: message })
        }
    }, [socket])

    const onMessageReceive = useCallback((msg: string) => {

        const { message } = JSON.parse(msg) as { message: string }
        setMessages((prev) => [...prev, message])
    }, [])

    useEffect(() => {
        const _socket = io('http://localhost:8000')
        setSocket(_socket)
        _socket.on("event:message", onMessageReceive)
        return () => {
            _socket.off("event:message", onMessageReceive)
            _socket.disconnect()
            setSocket(undefined)
        }
    }, [])


    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    )
}