import io from "socket.io-client"
import { useEffect } from "react"

const socket = io(process.env.NEXT_PUBLIC_API_BASE!, { withCredentials: true ,   transports: ["websocket"],})

export function useCustomOrderSocket(onChange: () => void) {
  useEffect(() => {
    function handler() {
      onChange()
    }
    socket.on("customOrder:update", handler)
    return () => {
      socket.off("customOrder:update", handler)
    }
  }, [onChange])
}
