export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
        <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with React, shadcn/ui, and Tailwind CSS.
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
