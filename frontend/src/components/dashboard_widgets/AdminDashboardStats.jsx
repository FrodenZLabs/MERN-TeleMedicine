import { Tooltip } from "flowbite-react";
import { HiArrowSmallRight, HiArrowTrendingUp } from "react-icons/hi2";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const AdminDashboardStats = () => {
  return (
    <div className="my-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      <NewPatientsLastMonth />
      <TotalAppointmentsLastMonth />
    </div>
  );
};

function NewPatientsLastMonth() {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm sm-p-6 xl:p-8">
      <div className="flex items-center">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
            2,340
          </span>
          <h3 className="text-base font-normal text-gray-600">
            Total Patients Last Month
          </h3>
        </div>
        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-green-600">
          <span className="p-1">14.6%</span> <HiArrowTrendingUp size={20} />
        </div>
      </div>
      <PatientsChart />
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 sm:pt-6">
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 sm:text-sm"
          >
            <span className="p-2"> Patient's Report</span>
            <HiArrowSmallRight className="translate-y-2" size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}

function TotalAppointmentsLastMonth() {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm sm-p-6 xl:p-8">
      <div className="flex items-center">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
            2,340
          </span>
          <h3 className="text-base font-normal text-gray-600">
            Last Month Total Appointments
          </h3>
        </div>
        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-green-600">
          <span className="p-1">14.6%</span> <HiArrowTrendingUp size={20} />
        </div>
      </div>
      <PatientsChart />
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 sm:pt-6">
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 sm:text-sm"
          >
            <span className="p-2"> Appointment's Report</span>
            <HiArrowSmallRight className="translate-y-2" size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function PatientsChart() {
  return (
    <ResponsiveContainer maxHeight={200} width="100%" height="100%">
      <LineChart
        width={500}
        height={200}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default AdminDashboardStats;
