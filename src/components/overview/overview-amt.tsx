import { Card, CardContent } from "../ui/card";

import { formatMoney } from "../../lib/currency";

export function OverviewAmt({
  amt = 0,
  title = "Current Balance",
  color,
}: {
  amt: number;
  title: string;
  color: string;
}) {
  return (
    <Card className={color}>
      <CardContent className="">
        <div className="font-light mb-2 text-xl">{title}</div>
        <h3 className="text-3xl font-black">{formatMoney(amt)}</h3>
      </CardContent>
    </Card>
  );
}
