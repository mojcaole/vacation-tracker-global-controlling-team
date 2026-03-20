const Legend = () => {
  return (
    <div className="flex flex-wrap items-center gap-6 mb-8">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-primary" />
        <span className="text-sm font-medium uppercase tracking-wide">Public Holiday</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-school-holiday" />
        <span className="text-sm font-medium uppercase tracking-wide">School Holiday</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-weekend border border-border" />
        <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Weekend</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gradient-to-r from-[hsl(214,100%,33%)] via-[hsl(160,84%,39%)] to-[hsl(350,80%,55%)]" />
        <span className="text-sm font-medium uppercase tracking-wide">Vacation (per member)</span>
      </div>
    </div>
  );
};

export default Legend;
