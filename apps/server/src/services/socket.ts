import { Server } from "socket.io";
import Redis from "ioredis";

const publisher = new Redis({
    host: "localhost",
    port: 6379,
});

const subscriber = new Redis({
    host: "localhost",
    port: 6379,
});

class SocketService {
    private _io: Server;

    constructor() {
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            }
        });

        subscriber.subscribe("MESSAGES")
    }

    get io() {
        return this._io;
    }

    public initListeners() {
        const io = this._io;
        io.on("connect", async (socket) => {
            socket.on("event:message", async ({ message }: { message: string }) => {
                await publisher.publish("MESSAGES", JSON.stringify({ message }))
            })
        })

        subscriber.on("message", async (channel, message) => {
            if (channel === "MESSAGES") {
                io.emit("event:message", message)
            }
        })
    }
}

export default SocketService