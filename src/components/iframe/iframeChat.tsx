"use client";

import { useEffect } from "react";

const IframeChat = () => {
    useEffect(() => {
        // Create iframe
        const iframe = document.createElement("iframe");

        // Add iframe styles
        const style = document.createElement("style");
        style.textContent = `
      .chat-frame {
        position: fixed;
        bottom: 50px;
        right: 50px;
        border: none;
        z-index: 1000; /* Ensure it appears above other elements */
      }
    `;
        document.head.appendChild(style);

        iframe.src = "https://corinna-ai.project.nexcodes.me/chatbot";
        iframe.classList.add("chat-frame");
        document.body.appendChild(iframe);

        const handleMessage = (e: MessageEvent) => {
            if (e.origin !== "https://corinna-ai.project.nexcodes.me") return;

            try {
                const dimensions = JSON.parse(e.data);
                iframe.width = dimensions.width;
                iframe.height = dimensions.height;

                iframe.contentWindow?.postMessage(
                    {
                        id: "fe260355-96c1-4125-93fa-37060c49b9df",
                        width: window.innerWidth,
                        height: window.innerHeight,
                    },
                    "https://corinna-ai.project.nexcodes.me/"
                );
            } catch (error) {
                console.error("Error processing message:", error);
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            // Cleanup
            window.removeEventListener("message", handleMessage);
            iframe.remove();
            style.remove();
        };
    }, []);

    return null; // This component does not render anything visible directly.
};

export default IframeChat;