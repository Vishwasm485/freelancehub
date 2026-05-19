import { useEffect, useState } from "react";
import "./EmployeeTasks.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ChatModal from "../common/ChatModal";
import EmployeeNavbar from "./EmployeeNavbar";

function EmployeeTasks({ setPage }) {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [progressInput, setProgressInput] = useState("");
  const [detailsInput, setDetailsInput] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatAssignment, setChatAssignment] = useState(null); 

  useEffect(() => {
    if (!user?.user_id) return;

    fetch(`http://127.0.0.1:5000/api/employee/assigned/${user.user_id}`)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, [user?.user_id]);

  const viewStatus = async (assignmentId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/employee/status/${assignmentId}`
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        alert("Server error while fetching status");
        return;
      }

      const data = await res.json();

      setProgress(data.completion_percentage || 0);
      setSelectedTask({
        ...data,
        assignment_id: assignmentId
      });

      setProgressInput("");
      setDetailsInput("");

      setShowModal(true);

    } catch (err) {
      console.error("Fetch failed:", err);
      alert("Backend not reachable");
    }
  };
  const updateProgress = async () => {
  if (!progressInput || progressInput < 0 || progressInput > 100) {
    alert("Enter valid % (0-100)");
    return;
  }

  await fetch("http://127.0.0.1:5000/api/employee/update-progress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      assignment_id: selectedTask.assignment_id,
      completion_percentage: Number(progressInput),
      details: detailsInput
    })
  });

  alert("Progress Updated ✅");
  setProgressInput("");
  setDetailsInput("");
};
const viewPayment = async (assignmentId) => {
  try {
    const res = await fetch(
      `http://127.0.0.1:5000/api/employee/payment-history/${assignmentId}`
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Server error:", text);
      alert("Server error: check backend route");
      return;
    }

    const data = await res.json();

    console.log("PAYMENT DATA:", data); 

    setPaymentData(data);
    setShowPaymentModal(true);

  } catch (err) {
    console.error("Fetch failed:", err);
    alert("Backend not reachable");
  }
};
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr.replace(" ", "T"));

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
useEffect(() => {
  if (paymentData?.history) {
    console.log("FULL PAYMENT DATA:", paymentData);

    paymentData.history.forEach(p => {
      console.log("RAW DATE:", p.payment_date);
      console.log("TYPE:", typeof p.payment_date);
    });
  }
}, [paymentData]);
  return (
    <div className="task-page">

      {/* ✅ NAVBAR (ADD HERE) */}
      <EmployeeNavbar
          setPage={setPage}
          active="my-tasks"
        />

      {/* ✅ PAGE CONTENT */}
      <div className="tasks-content">
        <div className="tasks-header">

          <h1>My Tasks</h1>

          <p>
            Track assigned projects,
            monitor progress and manage payments.
          </p>

        </div>
        <div className="tasks-grid">
          {tasks.map(t => (
            <div key={t.assignment_id} className="task-card">

              <div className="task-meta">

                <p>
                  <b>Skills:</b> {t.skills}
                </p>

                <p>
                  <b>Deadline:</b> {t.deadline}
                </p>

                <p>
                  <b>Employer:</b> {t.employer_name}
                </p>

                <p>
                  <b>Email:</b> {t.email}
                </p>

                <p>
                  <b>Phone:</b> {t.phone}
                </p>

                <p className="amount">
                  ₹{t.agreed_amount}
                </p>

              </div>

              {t.file_path && (
                <a
                  className="attachment-btn"
                  href={`http://127.0.0.1:5000/${t.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Attachment
                </a>
              )}

              <div className="task-actions">
                <button className="status-btn" onClick={()=>viewStatus(t.assignment_id)}>
                  View Status
                </button>

                <button className="payment-btn" onClick={() => viewPayment(t.assignment_id)}>
                  View Payment
                </button>

                <button className="chat-btn" onClick={() => {
                  setChatAssignment(t.assignment_id);
                  setShowChat(true);
                }}>
                  Chat
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
  {showModal && (
    <div className="modal-overlay">
    <div className="modal">

      <span className="close" onClick={() => setShowModal(false)}>✖</span>

      <h3>Task Progress</h3>

      <div className="progress-wrapper">
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            pathColor: "#2563eb",
            trailColor: "#dbeafe",
            textColor: "#0f172a"
          })}
        />
      </div>

      <p><b>Deadline:</b> {selectedTask?.deadline}</p>
      <p><b>Days Remaining:</b> {selectedTask?.days_remaining}</p>

      {/* ✅ NEW INPUTS */}
      <input
        type="number"
        placeholder="Enter completion %"
        value={progressInput}
        onChange={(e) => setProgressInput(e.target.value)}
      />

      <textarea
        placeholder="Update details..."
        value={detailsInput}
        onChange={(e) => setDetailsInput(e.target.value)}
      />

      <button className="submit-btn" onClick={updateProgress}>
        Submit Update
      </button>

    </div>
    </div>
)}
{showPaymentModal && (
  <div className="modal-overlay">
    <div className="modal">

      <span className="close" onClick={() => setShowPaymentModal(false)}>✖</span>

      <h3>Payment Details</h3>

      <p><b>Total Budget:</b> ₹{paymentData?.agreed}</p>
      <p><b>Received:</b> ₹{paymentData?.received}</p>
      <p><b>Remaining:</b> ₹{paymentData?.remaining}</p>

      <hr />

      <h4>Payment History</h4>

      {paymentData?.history?.length === 0 ? (
        <p>No payments yet</p>
      ) : (
        <div className="history">
          {paymentData.history.map(p => {
            console.log("RAW DATE:", p.payment_date);
            return (
            <div key={p.id} className="history-item">
              <p>💰 ₹{p.amount_paid}</p>
              <p>📅 {formatDate(p.payment_date)}</p>
            </div>
            );
          })}
        </div>
      )}

    </div>
  </div>
)}
{showChat && (
  <ChatModal
    assignmentId={chatAssignment}
    userId={user.user_id}
    onClose={() => setShowChat(false)}
  />
)}
    </div>
  );
}

export default EmployeeTasks;