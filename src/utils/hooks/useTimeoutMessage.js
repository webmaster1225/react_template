import { useEffect, useState } from "react";

function useTimeOutMessage(interval = 3000) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      let timeout = setTimeout(() => setMessage(""), interval);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [message]);

  return [message, setMessage];
}

export default useTimeOutMessage;
