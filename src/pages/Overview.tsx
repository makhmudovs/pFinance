import { Bills } from "@/components/overview/bills";
import { Budgets } from "@/components/overview/budgets";
import { OverviewAmt } from "@/components/overview/overview-amt";
import { Pots } from "@/components/overview/pots";
import { Transactions } from "@/components/overview/transactions";

const Overview = () => {
  const potData = [
    { id: "1", potName: "Laptop", potAmt: 300 },
    { id: "2", potName: "Car", potAmt: 400 },
    { id: "3", potName: "House", potAmt: 500 },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-6">
        <OverviewAmt
          title="Current Balance"
          color="bg-black text-white dark:bg-white dark:text-black"
          amt={3200}
        />
        <OverviewAmt
          title="Income"
          color="bg-white text-black dark:bg-muted/50 dark:text-white"
          amt={1200}
        />
        <OverviewAmt
          title="Expenses"
          color="bg-white text-black dark:bg-muted/50 dark:text-white"
          amt={1200}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="col-span-1 lg:col-span-3">
          <Pots pots={potData || []} />
          <Transactions />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <Budgets />
          <Bills />
        </div>
      </div>
    </div>
  );
};

export default Overview;
