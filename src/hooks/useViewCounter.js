import { useState, useEffect } from "react";

export function useViewCounter(postId) {
  const [views, setViews] = useState(null);
  const [loadingers, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;


    const url = import.meta.env.PUBLIC_UPSTASH_URL;
    const token = import.meta.env.PUBLIC_UPSTASH_TOKEN;
    const key = `views:${postId}`;

    const incrementAndFetch = async () => {
      try {
        const isLocal = window.location.hostname === "localhost";
        const sessionKey = `visited:${postId}`;
        const alreadyVisited = sessionStorage.getItem(sessionKey);

        if (!isLocal && !alreadyVisited) {
          sessionStorage.setItem(sessionKey, "1");
          await fetch(`${url}/incr/${key}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        await fetch(`${url}/incr/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const data = await res.json();
        setViews(data.result ?? 0);
      } catch (err) {
        console.error("View counter error:", err);
        setViews(null);
      } finally {
        setLoading(false);
      }
    };

    incrementAndFetch();
  }, [postId]);

  return { views, loadingers };
}