// // app/Admin/reports/page.tsx
// 'use client'

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts'

// export default function ReportsPage() {
//   const data = [
//     { name: 'Jan', downloads: 30, requests: 15 },
//     { name: 'Feb', downloads: 45, requests: 22 },
//     { name: 'Mar', downloads: 60, requests: 30 },
//   ]

//   return (
//     <div className='p-4 sm:p-6'>
//       <h1 className='text-2xl sm:text-3xl font-bold mb-4 text-white'>
//         Reports & Analytics
//       </h1>
//       <div className='bg-gray-800 p-4 sm:p-6 rounded-xl w-full'>
//         <ResponsiveContainer width='100%' height={300}>
//           <BarChart data={data}>
//             <XAxis dataKey='name' stroke='#ccc' />
//             <YAxis stroke='#ccc' />
//             <Tooltip />
//             <Bar dataKey='downloads' fill='#4F46E5' />
//             <Bar dataKey='requests' fill='#10B981' />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   )
// }
// app/Admin/reports/page.tsx
"use client";

import { useDownloads } from "@/contexts/DownloadsContext";
import { useRequests } from "@/contexts/RequestsContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

// Colors for charts
const COLORS = [
  "#4F46E5",
  "#10B981",
  "#EF4444",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-xl">
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const { downloads } = useDownloads();
  const { requests } = useRequests();
  const { t } = useLanguage();

  // Calculate monthly statistics
  const getMonthlyStats = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();

    return months.map((month, index) => {
      const monthStart = new Date(currentYear, index, 1);
      const monthEnd = new Date(currentYear, index + 1, 0);

      // Filter downloads for this month (using last download date)
      const monthDownloads = downloads.filter((download) => {
        const downloadDate = new Date(download.last);
        return downloadDate >= monthStart && downloadDate <= monthEnd;
      });

      // Filter requests for this month
      const monthRequests = requests.filter((request) => {
        const requestDate = new Date(request.date);
        return requestDate >= monthStart && requestDate <= monthEnd;
      });

      // Calculate total downloads count for the month
      const totalDownloads = monthDownloads.reduce(
        (sum, download) => sum + download.count,
        0
      );

      return {
        month,
        downloads: totalDownloads,
        requests: monthRequests.length,
        pending: monthRequests.filter((r) => r.status === "Pending").length,
        approved: monthRequests.filter((r) => r.status === "Approved").length,
        rejected: monthRequests.filter((r) => r.status === "Rejected").length,
      };
    });
  };

  // Get product statistics
  const getProductStats = () => {
    const products = [
      "Gasha Antivirus",
      "Gasha VPN",
      "Gasha WAF",
      "Nisir SIEM",
    ];

    return products.map((product) => {
      const productDownloads = downloads.filter((download) =>
        download.file
          .toLowerCase()
          .includes(product.toLowerCase().replace(" ", ""))
      );

      const productRequests = requests.filter((request) =>
        request.type
          ?.toLowerCase()
          .includes(
            product.toLowerCase().split(" ")[1] || product.toLowerCase()
          )
      );

      const totalDownloads = productDownloads.reduce(
        (sum, download) => sum + download.count,
        0
      );

      return {
        product,
        downloads: totalDownloads,
        requests: productRequests.length,
      };
    });
  };

  // Get request status data for pie chart
  const getRequestStatusData = () => {
    const pending = requests.filter((r) => r.status === "Pending").length;
    const approved = requests.filter((r) => r.status === "Approved").length;
    const rejected = requests.filter((r) => r.status === "Rejected").length;

    return [
      { name: "Pending", value: pending, color: "#F59E0B" },
      { name: "Approved", value: approved, color: "#10B981" },
      { name: "Rejected", value: rejected, color: "#EF4444" },
    ];
  };

  // Get download statistics by product for pie chart
  const getDownloadDistribution = () => {
    const productStats = getProductStats();
    return productStats.map((stat) => ({
      name: stat.product,
      value: stat.downloads,
    }));
  };

  // Get weekly trends
  const getWeeklyTrends = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayKey = date.toLocaleDateString("en-US", { weekday: "short" });

      const dayDownloads = downloads
        .filter((download) => {
          const downloadDate = new Date(download.last);
          return downloadDate.toDateString() === date.toDateString();
        })
        .reduce((sum, download) => sum + download.count, 0);

      const dayRequests = requests.filter((request) => {
        const requestDate = new Date(request.date);
        return requestDate.toDateString() === date.toDateString();
      }).length;

      days.push({
        day: dayKey,
        downloads: dayDownloads,
        requests: dayRequests,
      });
    }
    return days;
  };

  // Performance metrics
  const getPerformanceMetrics = () => {
    const totalDownloads = downloads.reduce(
      (sum, download) => sum + download.count,
      0
    );
    const totalRequests = requests.length;
    const approvedRequests = requests.filter(
      (r) => r.status === "Approved"
    ).length;
    const approvalRate =
      totalRequests > 0
        ? Math.round((approvedRequests / totalRequests) * 100)
        : 0;
    const pendingRequests = requests.filter(
      (r) => r.status === "Pending"
    ).length;

    // Find most downloaded product
    const productStats = getProductStats();
    const mostDownloaded = productStats.reduce(
      (prev, current) => (prev.downloads > current.downloads ? prev : current),
      { product: "None", downloads: 0 }
    );

    return {
      totalDownloads,
      totalRequests,
      approvalRate,
      pendingRequests,
      mostDownloaded: mostDownloaded.product,
    };
  };

  const monthlyStats = getMonthlyStats();
  const productStats = getProductStats();
  const requestStatusData = getRequestStatusData();
  const downloadDistribution = getDownloadDistribution();
  const weeklyTrends = getWeeklyTrends();
  const performanceMetrics = getPerformanceMetrics();

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
        {t("reports_dashboard_title")}
      </h1>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-2">
            Total Downloads
          </h3>
          <p className="text-3xl font-bold text-blue-400">
            {performanceMetrics.totalDownloads}
          </p>
          <p className="text-sm text-gray-400 mt-2">All time downloads</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-2">
            Total Requests
          </h3>
          <p className="text-3xl font-bold text-green-400">
            {performanceMetrics.totalRequests}
          </p>
          <p className="text-sm text-gray-400 mt-2">All time requests</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-2">
            Approval Rate
          </h3>
          <p className="text-3xl font-bold text-emerald-400">
            {performanceMetrics.approvalRate}%
          </p>
          <p className="text-sm text-gray-400 mt-2">Requests approved</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-2">
            Pending Requests
          </h3>
          <p className="text-3xl font-bold text-yellow-400">
            {performanceMetrics.pendingRequests}
          </p>
          <p className="text-sm text-gray-400 mt-2">Awaiting review</p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Downloads & Requests Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t("monthly_activity")}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="downloads"
                name={t("legend_downloads")}
                fill="#4F46E5"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="requests"
                name={t("legend_requests")}
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Request Status Distribution */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t("request_status_distribution")}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={requestStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {requestStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Trends */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t("weekly_trends")}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="downloads"
                name={t("legend_downloads")}
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="requests"
                name={t("legend_requests")}
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Download Distribution by Product */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t("download_distribution")}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={downloadDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {downloadDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          {t("product_performance")}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="product"
              stroke="#9CA3AF"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="downloads"
              name={t("legend_downloads")}
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="requests"
              name={t("legend_requests")}
              fill="#F59E0B"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Summary */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30">
        <h2 className="text-xl font-semibold text-white mb-4">
          {t("data_summary")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">
              {t("downloads_information")}
            </h3>
            <p className="text-gray-400">
              Total unique files: {downloads.length}
            </p>
            <p className="text-gray-400">
              {t("most_downloaded")}: {performanceMetrics.mostDownloaded}
            </p>
            <p className="text-gray-400">
              {t("last_updated")}: {new Date().toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">
              {t("requests_information")}
            </h3>
            <p className="text-gray-400">
              {t("approval_rate_summary")}: {performanceMetrics.approvalRate}%
            </p>
            <p className="text-gray-400">
              {t("pending_reviews")}: {performanceMetrics.pendingRequests}
            </p>
            <p className="text-gray-400">
              {t("total_products")}: {productStats.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
