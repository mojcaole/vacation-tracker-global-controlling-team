interface StatsProps {
  teamMembers: string[];
  getVacationCount: (memberIndex: number) => number;
}

const Stats = ({ teamMembers, getVacationCount }: StatsProps) => {
  return (
    <div className="border-t-2 border-foreground pt-8 mt-12">
      <h3 className="text-lg font-bold uppercase tracking-widest mb-6">Vacation Summary</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {teamMembers.map((member, idx) => {
          const count = getVacationCount(idx);
          return (
            <div
              key={idx}
              className="bg-card border border-border p-4 hover:border-foreground transition-colors"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
                {member}
              </p>
              <p className="text-3xl font-bold mt-2 tabular-nums">
                {count}
                <span className="text-sm font-normal text-muted-foreground ml-1">days</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;
