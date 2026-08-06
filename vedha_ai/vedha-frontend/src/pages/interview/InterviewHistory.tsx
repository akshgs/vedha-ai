import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";

import {
  getInterviewHistory,
  type InterviewHistoryItem,
} from "@/services/interview";

export default function InterviewHistory() {
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getInterviewHistory();
        setHistory(data.history);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold text-white">
            Interview History
          </h1>

          <p className="mt-2 text-slate-400">
            View all your previous AI interviews.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-slate-900 p-8 text-center text-white">
            Loading Interview History...
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-2xl bg-slate-900 p-8 text-center text-slate-400">
            No interview history found.
          </div>
        ) : (
          <div className="space-y-5">
            {history.map((item) => (
              <div
                key={item.interview_id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {item.target_role}
                    </h2>

                    <p className="mt-2 text-slate-400">
                      Status :
                      <span className="ml-2 text-cyan-400">
                        {item.status}
                      </span>
                    </p>

                    <p className="mt-2 text-slate-400">
                      Created :
                      <span className="ml-2">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">

                    <div className="text-4xl font-bold text-cyan-400">
                      {item.overall_score ?? "--"}%
                    </div>

                    <Link
                      to={`/student/interview/report/${item.interview_id}`}
                      className="mt-4 inline-block rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-500"
                    >
                      View Report
                    </Link>

                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}