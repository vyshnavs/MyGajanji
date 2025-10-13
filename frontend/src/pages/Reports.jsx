import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/connection";

export default function Reports() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    if (!from || !to) return alert("Please select date range");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/reports?from=${from}&to=${to}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (type) => {
    const token = localStorage.getItem("token");
    const url = `/reports/download/${type}?from=${from}&to=${to}`;
    const res = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    const blob = new Blob([res.data], { type: type === "pdf" ? "application/pdf" : "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `MyGajanji_Financial_Report.${type}`;
    link.click();
  };

  // Calculate totals from report data
  const totalIncome = report?.transactions?.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalExpense = report?.transactions?.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0) || 0;
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-black p-6 md:p-10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with Home Button */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Home Button */}
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white transition-all duration-300 p-3 rounded-2xl hover:bg-gray-800/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 hover:scale-105"
              title="Go to Home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>

            <div>
              <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Financial Reports
              </h1>
              <p className="text-gray-400 mt-2">Generate comprehensive financial reports and export in multiple formats</p>
            </div>
          </div>
        </header>

        {/* Date Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 p-6 bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 hover:border-gray-700 transition-all duration-500">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm p-3 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 flex-1">
              <label className="text-gray-400 text-sm whitespace-nowrap">From Date</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-transparent text-white px-2 py-1 outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm p-3 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 flex-1">
              <label className="text-gray-400 text-sm whitespace-nowrap">To Date</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-transparent text-white px-2 py-1 outline-none w-full"
              />
            </div>

            <button
              onClick={fetchReport}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-semibold hover:shadow-blue-500/25 whitespace-nowrap"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </div>
              ) : (
                "Generate Report"
              )}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Total Income</div>
                  <div className="text-white font-bold text-2xl">
                    ₹{totalIncome.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-400/40 transition-all duration-500 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Total Expense</div>
                  <div className="text-white font-bold text-2xl">
                    ₹{totalExpense.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 hover:border-green-400/40 transition-all duration-500 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Net Balance</div>
                  <div className={`font-bold text-2xl ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹{netBalance.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Download Buttons */}
        {report && (
          <div className="flex justify-center gap-4 mb-8">
            <button 
              onClick={() => downloadFile("pdf")} 
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold hover:shadow-red-500/25 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
            <button 
              onClick={() => downloadFile("csv")} 
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold hover:shadow-emerald-500/25 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CSV
            </button>
          </div>
        )}

        {/* Table Preview */}
        {report && (
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-500 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-xl font-bold text-white bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                Transactions Preview
              </h2>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-700/50 bg-gray-900/30">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left">
                    <tr className="border-b border-gray-700/50">
                      <th className="px-4 py-3 text-gray-300 bg-gray-800/50">Amount</th>
                      <th className="px-4 py-3 text-gray-300 bg-gray-800/50">Category</th>
                      <th className="px-4 py-3 text-gray-300 bg-gray-800/50">Type</th>
                      <th className="px-4 py-3 text-gray-300 bg-gray-800/50">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.transactions.map((t, i) => (
                      <tr 
                        key={i} 
                        className="border-b border-gray-800/30 hover:bg-gray-700/20 transition-all duration-300"
                      >
                        <td className="px-4 py-3 text-white font-medium">₹{t.amount}</td>
                        <td className="px-4 py-3 text-gray-200">{t.category}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            t.type === "income" 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{new Date(t.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {!report && (
          <footer className="mt-6 text-center text-gray-500 text-sm">
            <p>💡 Select a date range and generate comprehensive financial reports with export options</p>
          </footer>
        )}
      </div>
    </div>
  );
}