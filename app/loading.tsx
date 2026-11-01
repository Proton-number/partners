function Loading() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-background"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <div className="typing-indicator">
          <div className="typing-circle"></div>
          <div className="typing-circle"></div>
          <div className="typing-circle"></div>
          <div className="typing-shadow"></div>
          <div className="typing-shadow"></div>
          <div className="typing-shadow"></div>
        </div>
      </div>
    </main>
  );
}

export default Loading;
