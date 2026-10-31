function Loading() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-background"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary"
          role="status"
          aria-label="Loading"
        />
        <p className="text-sm font-medium">Loading...</p>
      </div>
    </main>
  );
}

export default Loading;
