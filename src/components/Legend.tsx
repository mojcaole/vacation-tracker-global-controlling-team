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
        <div className="w-5 h-5 bg-secondary" />
        <span className="text-sm font-medium uppercase tracking-wide">Vacation</span>
      </div>
    </div>
  );
};

export default Legend;
