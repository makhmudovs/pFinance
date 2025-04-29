import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { formatMoney } from "@/lib/currency";

export function Pots({
  pots,
}: {
  pots: {
    id: string;
    potName: string;
    potAmt: number;
  }[];
}) {
  return (
    <div className="rounded-xl bg-white dark:bg-muted/50 shadow-sm p-4 mb-6">
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Pots
      </h2>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]">{"#"}</TableHead>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pots.length > 0 ? (
            pots.map((pot, i) => (
              <TableRow key={pot.id}>
                <TableCell className="w-[30px]">{i + 1}</TableCell>
                <TableCell className="font-medium">
                  {"potID" + pot.id}
                </TableCell>
                <TableCell>{pot.potName}</TableCell>
                <TableCell className="text-right">
                  {formatMoney(pot.potAmt)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>----</TableCell>
              <TableCell>----</TableCell>
              <TableCell>----</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
