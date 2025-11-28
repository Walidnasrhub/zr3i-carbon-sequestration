import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, DollarSign, Calendar, Download } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { month: "Jan", earnings: 225, credits: 15 },
  { month: "Feb", earnings: 240, credits: 16 },
  { month: "Mar", earnings: 255, credits: 17 },
  { month: "Apr", earnings: 270, credits: 18 },
  { month: "May", earnings: 285, credits: 19 },
  { month: "Jun", earnings: 300, credits: 20 },
  { month: "Jul", earnings: 315, credits: 21 },
  { month: "Aug", earnings: 330, credits: 22 },
  { month: "Sep", earnings: 315, credits: 21 },
  { month: "Oct", earnings: 300, credits: 20 },
  { month: "Nov", earnings: 285, credits: 19 },
  { month: "Dec", earnings: 300, credits: 20 },
];

const paymentHistory = [
  {
    id: 1,
    date: "2024-11-30",
    amount: 300,
    credits: 20,
    status: "completed",
  },
  {
    id: 2,
    date: "2024-10-31",
    amount: 300,
    credits: 20,
    status: "completed",
  },
  {
    id: 3,
    date: "2024-09-30",
    amount: 315,
    credits: 21,
    status: "completed",
  },
  {
    id: 4,
    date: "2024-08-31",
    amount: 330,
    credits: 22,
    status: "completed",
  },
  {
    id: 5,
    date: "2024-07-31",
    amount: 315,
    credits: 21,
    status: "completed",
  },
];

export function EarningsTracker() {
  const { language } = useLanguage();

  const totalEarnings = monthlyData.reduce((sum, m) => sum + m.earnings, 0);
  const totalCredits = monthlyData.reduce((sum, m) => sum + m.credits, 0);
  const averageMonthly = Math.round(totalEarnings / monthlyData.length);

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Earnings */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
              {language === "en" ? "YTD" : "منذ البداية"}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">
            {language === "en" ? "Total Earnings" : "إجمالي الأرباح"}
          </p>
          <p className="text-3xl font-bold text-green-700">${totalEarnings}</p>
          <p className="text-xs text-slate-500 mt-2">
            {language === "en" ? "Year to date" : "من بداية السنة"}
          </p>
        </Card>

        {/* Average Monthly */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
              {language === "en" ? "Average" : "متوسط"}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">
            {language === "en" ? "Monthly Average" : "المتوسط الشهري"}
          </p>
          <p className="text-3xl font-bold text-blue-700">${averageMonthly}</p>
          <p className="text-xs text-slate-500 mt-2">
            {language === "en" ? "per month" : "في الشهر"}
          </p>
        </Card>

        {/* Total Credits */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">
              {language === "en" ? "Total" : "الإجمالي"}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">
            {language === "en" ? "Carbon Credits" : "أرصدة الكربون"}
          </p>
          <p className="text-3xl font-bold text-purple-700">{totalCredits}</p>
          <p className="text-xs text-slate-500 mt-2">
            {language === "en" ? "credits" : "أرصدة"}
          </p>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {language === "en"
            ? "Monthly Earnings & Credits"
            : "الأرباح والأرصدة الشهرية"}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="earnings"
              fill="#10b981"
              name={language === "en" ? "Earnings ($)" : "الأرباح ($)"}
            />
            <Bar
              yAxisId="right"
              dataKey="credits"
              fill="#0891b2"
              name={language === "en" ? "Credits" : "الأرصدة"}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Earnings Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {language === "en" ? "Earnings Trend" : "اتجاه الأرباح"}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 4 }}
              activeDot={{ r: 6 }}
              name={language === "en" ? "Earnings" : "الأرباح"}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Payment History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            {language === "en" ? "Payment History" : "سجل الدفع"}
          </h3>
          <button className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 text-sm font-medium">
            <Download className="w-4 h-4" />
            {language === "en" ? "Export" : "تصدير"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">
                  {language === "en" ? "Date" : "التاريخ"}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">
                  {language === "en" ? "Amount" : "المبلغ"}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">
                  {language === "en" ? "Credits" : "الأرصدة"}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">
                  {language === "en" ? "Status" : "الحالة"}
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-3 px-4 text-slate-900">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-green-600">
                    ${payment.amount}
                  </td>
                  <td className="py-3 px-4 text-slate-900">
                    {payment.credits}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {language === "en" ? "Completed" : "مكتمل"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {language === "en" ? "Payment Method" : "طريقة الدفع"}
        </h3>
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
          <div>
            <p className="text-sm text-slate-600">
              {language === "en" ? "Bank Account" : "حساب بنكي"}
            </p>
            <p className="font-semibold text-slate-900">
              {language === "en"
                ? "Saudi National Bank"
                : "البنك الأهلي السعودي"}
            </p>
            <p className="text-sm text-slate-500">
              {language === "en" ? "Account ending in" : "الحساب ينتهي بـ"} 4242
            </p>
          </div>
          <button className="text-cyan-600 hover:text-cyan-700 font-medium text-sm">
            {language === "en" ? "Change" : "تغيير"}
          </button>
        </div>
      </Card>
    </div>
  );
}
