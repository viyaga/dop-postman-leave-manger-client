'use client'

import { useEffect, useState } from "react";

export default function GlobalError({ error }) {
    const [countdown, setCountdown] = useState(69);

    const isConnection = error.message.toLowerCase() !== 'connection closed.'
    const formatTime = (time) => {
        return time < 10 ? `0${time}` : time;
    }


    useEffect(() => {
        if (!isConnection) {
            const timer = setInterval(() => {
                if (countdown > 0) {
                    setCountdown(prevCountdown => prevCountdown - 1);
                    if (countdown === 3) location.reload()
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isConnection, countdown])

    return (
        <html>
            <body
                style={{
                    color: "white",
                    height: "100vh",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px"
                }}>
                <h2
                    style={{
                        textAlign: "center",
                        maxWidth: "400px",
                        margin: "0 auto"
                    }}
                >
                    {isConnection ? 'Something went wrong!' : 'Please hold while we establish a connection to the server.'}
                </h2>
                <p>{isConnection && error?.message}</p>
                <button
                    style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        marginTop: '5px'
                    }}
                    onClick={() => location.reload()}
                >
                    Try after {isConnection ? "some times" : `${formatTime(countdown)} seconds`}
                </button>
            </body>
        </html >
    )
}
