import { useEffect, useRef, useCallback, useState } from "react";
import { Loader2, X, Download, Heart, RefreshCw } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { useExcerpts } from "./hooks/useExcerpts";
import { ExcerptCard } from "./components/ExcerptCard";
import { Excerpt } from "./types/Excerpt";

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const { excerpts, loading, error, hasMore, loadMore } = useExcerpts();
  const [likedExcerpts, setLikedExcerpts] = useState<Set<number>>(new Set());
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading && hasMore) {
        loadMore();
      }
    },
    [loading, hasMore, loadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleObserver]);

  const toggleLike = useCallback((id: number) => {
    setLikedExcerpts((prev: Set<number>) => {
      const newLikes = new Set(prev);
      if (newLikes.has(id)) {
        newLikes.delete(id);
      } else {
        newLikes.add(id);
      }
      return newLikes;
    });
  }, []);

  const handleExport = useCallback(() => {
    const likedExcerptsData = excerpts.filter((excerpt: Excerpt) => likedExcerpts.has(excerpt.id));
    const dataStr = JSON.stringify(likedExcerptsData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileName = `booktok-favorites-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileName);
    linkElement.click();
  }, [excerpts, likedExcerpts]);

  return (
    <div className="h-screen w-full bg-black text-white overflow-y-scroll snap-y snap-mandatory hide-scroll">
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => window.location.reload()}
          className="text-2xl font-bold text-white drop-shadow-lg hover:opacity-80 transition-opacity"
        >
          📖 BookTok
        </button>
      </div>

      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <button
          onClick={() => setShowAbout(!showAbout)}
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          About
        </button>
        <button
          onClick={() => setShowLikes(!showLikes)}
          className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1"
        >
          {likedExcerpts.size > 0 && (
            <span className="text-xs bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
              {likedExcerpts.size}
            </span>
          )}
          <span>Likes</span>
        </button>
      </div>

      {showAbout && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 z-[41] p-6 rounded-lg max-w-md relative">
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-2 right-2 text-white/70 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">About BookTok</h2>
            <p className="mb-4">
              A TikTok-style interface for reading textbook excerpts.
            </p>
            <p className="text-white/70">
              Made with ❤️ by{" "}
              <a
                href="https://x.com/Aizkmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                @Aizkmusic
              </a>
            </p>
            <p className="text-white/70 mt-2">
              Check out the code on{" "}
              <a
                href="https://github.com/IsaacGemal/wikitok"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                GitHub
              </a>
            </p>
            <p className="text-white/70 mt-2">
              If you enjoy this project, you can{" "}
              <a
                href="https://buymeacoffee.com/aizk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                buy me a coffee
              </a>
              ! ☕
            </p>
          </div>
          <div
            className={`w-full h-full z-[40] top-1 left-1 bg-[rgb(28 25 23 / 43%)] fixed ${showAbout ? "block" : "hidden"}`}
            onClick={() => setShowAbout(false)}
          ></div>
        </div>
      )}

      {showLikes && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col p-4">
          <div className="bg-gray-900 z-[41] rounded-lg max-w-2xl w-full mx-auto flex-1 flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Liked Excerpts</h2>
              <div className="flex gap-2">
                {likedExcerpts.size > 0 && (
                  <button
                    onClick={handleExport}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                )}
                <button
                  onClick={() => setShowLikes(false)}
                  className="p-1 text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {likedExcerpts.size === 0 ? (
                <div className="text-center text-white/50 py-8">
                  <p>No liked excerpts yet.</p>
                  <p className="text-sm mt-2">
                    Scroll to discover excerpts and tap the heart to save them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {excerpts
                    .filter(excerpt => likedExcerpts.has(excerpt.id))
                    .map((excerpt) => (
                      <div
                        key={excerpt.id}
                        className="bg-gray-800/50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">Excerpt #{excerpt.id}</h3>
                          <button
                            onClick={() => toggleLike(excerpt.id)}
                            className="text-red-500"
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                        <p className="text-sm text-white/70 mt-2 line-clamp-3">
                          {excerpt.text.length > 200 
                            ? `${excerpt.text.substring(0, 200)}...` 
                            : excerpt.text}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="h-full w-full">
        {error ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-2xl font-bold mb-2">Error loading excerpts</h2>
            <p className="text-white/70 mb-6">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : (
          <div className="h-full">
            {excerpts.map((excerpt: Excerpt) => (
              <ExcerptCard
                key={excerpt.id}
                excerpt={excerpt}
                isLiked={likedExcerpts.has(excerpt.id)}
                onLike={() => toggleLike(excerpt.id)}
              />
            ))}
            <div ref={observerTarget} className="h-32 flex items-center justify-center">
              {loading && <Loader2 className="w-8 h-8 animate-spin text-white/50" />}
              {!hasMore && !loading && (
                <p className="text-white/50 text-sm">No more excerpts to show</p>
              )}
            </div>
          </div>
        )}
      </div>
      <Analytics />
    </div>
  );
}

export default App;
