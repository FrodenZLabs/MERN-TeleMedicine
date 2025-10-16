import {
  Badge,
  Datepicker,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { HiChevronRight } from "react-icons/hi";
import { HiArrowSmallRight } from "react-icons/hi2";

const PaymentTransaction = () => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Transactions</h3>
          <span className="text-base font-normal text-gray-600">
            This is a list of latest transactions
          </span>
        </div>
        <div className="shrink-0">
          <a
            href="#"
            className="flex rounded-lg p-2 text-sm font-medium text-primary-700 hover:bg-gray-100 dark:text-primary-500"
          >
            <span className="p-2"> View all </span>
            <HiArrowSmallRight className="translate-y-2" size={20} />
          </a>
        </div>
      </div>
      <div className="mt-8 flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm sm:rounded-lg">
              <Table
                striped
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
              >
                <TableHead className="bg-gray-50 dark:bg-gray-700">
                  <TableRow>
                    <TableHeadCell>Transactions</TableHeadCell>
                    <TableHeadCell>Date &amp; Time</TableHeadCell>
                    <TableHeadCell>Amount</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody className="bg-white dark:bg-gray-800">
                  <TableRow>
                    <TableCell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900">
                      Payment from{" "}
                      <span className="font-semibold">Bonnie Green</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500">
                      Apr 23, 2024
                    </TableCell>
                    <TableCell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900">
                      Kshs. 25,000
                    </TableCell>
                    <TableCell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 sm:pt-6">
        <Datepicker autoHide={false} />
        <div className="shrink-0">
          <a
            href="#"
            className="flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-500"
          >
            <span className="p-1"> Transactions report </span>
            <HiChevronRight size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentTransaction;
