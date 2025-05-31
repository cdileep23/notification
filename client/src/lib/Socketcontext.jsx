import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // Get user ID from sessionStorage
  const getUserId = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      return user?.userId || null;
    } catch {
      return null;
    }
  };

  // Initialize socket connection and set up event listeners
  const initializeSocket = (roomId = null) => {
    const userId = getUserId();
    if (!userId) {
      console.error("No user ID found in sessionStorage");
      return;
    }

    // Clean up existing connection if it exists
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log("Initializing socket connection...");
    socketRef.current = io("https://notification-1-rtqp.onrender.com", {
      query: { userId },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

   
    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected:", socketRef.current.id);
      setIsConnected(true);

      const joinId = roomId || userId;
      socketRef.current.emit("join-room", joinId);
      console.log(`📡 Joined room: ${joinId}`);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
      setIsConnected(false);
    });
 socketRef.current.on('push-notification',(data)=>{
  console.log("Notifcation received")
  toast.success(data.message)
 })
     
    
   
    const originalEmit = socketRef.current.emit;
    socketRef.current.emit = function (...args) {
      console.log("📤 Emitting event:", args[0], args.slice(1));
      return originalEmit.apply(this, args);
    };

    // Log all received events
    socketRef.current.onAny((event, ...args) => {
      console.log("📥 Received event:", event, args);
    });
  };

  // Connect to default room (user's own room)
  const connect = () => {
    initializeSocket();
  };

  // Connect and join specific room
  const connectAndJoinRoom = (roomId) => {
    initializeSocket(roomId);
  };

  // Disconnect socket
  const disconnect = () => {
    if (socketRef.current) {
      console.log("Disconnecting socket...");
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  };

  // Initialize socket on mount and when user changes
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        connect,
        connectAndJoinRoom,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
