import { useEffect, useState } from "react";
import "./AssignedTasks.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ChatModal from "../common/ChatModal";

function AssignedTasks({ setPage }) {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [fromUpi, setFromUpi] = useState("");
  const [toUpi, setToUpi] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatAssignment, setChatAssignment] = useState(null);
  const upiLink = `upi://pay?pa=${toUpi}&pn=Freelancer&am=${payAmount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
  const [paymentInfo, setPaymentInfo] = useState({
    agreed: 0,
    paid: 0,
    remaining: 0
  });

  const openPayment = async (task) => {
  setSelectedAssignment(task);

  // fetch payment summary
  const res = await fetch(
    `http://127.0.0.1:5000/api/employer/payment-summary/${task.assignment_id}`
  );
  const data = await res.json();

  setPaymentInfo({
    agreed: data.agreed_amount,
    paid: data.total_paid,
    remaining: data.remaining
  });

  setShowPaymentModal(true);
};

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/employer/assignments/${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        console.log("ASSIGNED TASKS DATA:", data);
        setTasks(data);
      });
  }, [user.user_id]);
    const viewStatus = async (assignmentId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/employer/status/${assignmentId}`
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        alert("Failed to fetch status");
        return;
      }

      const data = await res.json();

      setProgress(data.completion_percentage || 0);
      setSelectedTask(data);
      setShowModal(true);

    } catch (err) {
      console.error("Error fetching status:", err);
      alert("Backend not reachable");
    }
  };
const fetchPaymentSummary = async (id) => {
  try {
    const res = await fetch(
      `http://127.0.0.1:5000/api/employer/payment-summary/${id}`
    );

    const data = await res.json();

    setPaymentInfo({
      agreed: data.agreed_amount,
      paid: data.total_paid,
      remaining: data.remaining
    });

  } catch (err) {
    console.error("Failed to refresh payment summary", err);
  }
};
const makePayment = async () => {
  const amount = Number(payAmount);

  // ✅ basic validation
  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  // ✅ frontend constraint (prevents bad requests)
  if (amount > paymentInfo.remaining) {
    alert(`You can only pay up to ₹${paymentInfo.remaining}`);
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/api/employer/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        assignment_id: selectedAssignment.assignment_id,
        amount: amount
      })
    });

    const data = await res.json();

    // ❌ backend error handling
    if (!res.ok) {
      alert(data.error || "Payment failed");
      return;
    }

    // ✅ success
    alert("Payment Successful ✅");

    // 🔁 refresh payment summary (IMPORTANT)
    fetchPaymentSummary(selectedAssignment.assignment_id);

    // reset input
    setPayAmount("");

  } catch (err) {
    console.error(err);
    alert("Server not responding");
  }
};
// 🔹 Build UPI link
const buildUpiLink = () => {
  return `upi://pay?pa=${toUpi}&pn=Freelancer&am=${payAmount}&cu=INR`;
};

// 🔹 Open UPI (mobile)
const openUPI = () => {
  if (!toUpi || !payAmount) {
    alert("Enter UPI ID and amount");
    return;
  }

  window.location.href = buildUpiLink();

  // fallback (desktop)
  setTimeout(() => {
    alert("If nothing opened, use QR code below.");
  }, 2000);
};

// 🔹 Razorpay
const payWithRazorpay = () => {
  if (!payAmount) {
    alert("Enter amount");
    return;
  }

  const options = {
    key: "YOUR_RAZORPAY_KEY", // replace later
    amount: payAmount * 100,
    currency: "INR",
    name: "FreelanceHub",
    description: "Project Payment",

    handler: function () {
      alert("Payment Successful ✅");
      makePayment(); // save in DB
    },

    theme: {
      color: "#3399cc"
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
 return (
  <div className="assign-page">

    {/* NAVBAR */}
    <div className="navbar">
      <h2>FreelanceHub</h2>
      <div>
        <button onClick={() => setPage("employer")}>Profile</button>
        <button onClick={() => setPage("post-project")}>Post Project</button>
        <button onClick={() => setPage("view-posts")}>View Posts</button>
        <button className="active">Assigned Tasks</button>
        <button onClick={() => setPage("home")}>Logout</button>
      </div>
    </div>

    <div className="container">
      <h2>Assigned Tasks</h2>

      {/* ✅ EMPTY STATE */}
      {tasks.length === 0 ? (
        <p className="empty">No assigned tasks yet</p>
      ) : (
        <div className="grid">
          {tasks.map(t => (
            <div key={t.assignment_id} className="card">

              <h3>{t.title}</h3>
              <p>{t.description}</p>

              <p><b>Skills:</b> {t.skills}</p>
              <p>📅 Deadline: {t.deadline}</p>

              <hr />

              <p><b>Assigned Freelancer:</b> {t.employee_name}</p>
              <p>📧 {t.email}</p>
              <p>📞 {t.phone}</p>

              <p>💰 ₹{t.agreed_amount}</p>

              {t.file_path && (
                <a
                  href={`http://127.0.0.1:5000/${t.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📎 Attachment
                </a>
              )}

              <div className="btns">
                <button onClick={() => viewStatus(t.assignment_id)}>
                  View Status
                </button>
                <button
                  className="payment"
                  onClick={() => openPayment(t)}
                >
                  Make/View Payment
                </button>
                <button className="chat" onClick={() => {
                  setChatAssignment(t.assignment_id);
                  setShowChat(true);
                }}>
                  Chat
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>

    {/* ✅ MODAL */}
    {showModal && (
      <div className="modal-overlay">
        <div className="modal">

          <span className="close" onClick={() => setShowModal(false)}>✖</span>

          <h3>Task Progress</h3>

          <div style={{ width: "180px", margin: "15px auto" }}>
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                pathColor: "#22c55e",
                trailColor: "#f87171",
                textColor: "#333"
              })}
            />
          </div>

          <p><b>Deadline:</b> {selectedTask?.deadline}</p>
          <p><b>Days Remaining:</b> {selectedTask?.days_remaining}</p>
          <p><b>Details:</b> {selectedTask?.details}</p>

          <button
            className="submit-btn"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>

        </div>
      </div>
    )}
    {/* PAYMENT MODAL */}
    {showPaymentModal && (
      <div className="modal-overlay">
        <div className="modal">

          <span className="close" onClick={() => setShowPaymentModal(false)}>✖</span>

          <h3>Payment</h3>

          <p><b>Total:</b> ₹{paymentInfo?.agreed}</p>
          <p><b>Paid:</b> ₹{paymentInfo?.paid}</p>
          <p><b>Remaining:</b> ₹{paymentInfo?.remaining}</p>

          <input
            placeholder="Your UPI ID (you@upi)"
            value={fromUpi}
            onChange={(e) => setFromUpi(e.target.value)}
          />

          <input
            placeholder="Receiver UPI ID"
            value={toUpi}
            onChange={(e) => setToUpi(e.target.value)}
          />

          <input
            type="number"
            placeholder="Enter amount"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
          />

          {/* 🔹 UPI BUTTON */}
          <button className="upi-btn" onClick={openUPI}>
            Pay via UPI
          </button>

          {/* 🔹 APP BUTTONS */}
          <button className="gpay" onClick={openUPI}>
            Google Pay
          </button>

          <button className="phonepe" onClick={openUPI}>
            PhonePe
          </button>

          {/* 🔹 QR CODE */}
          <div className="qr-box">
            <p>Scan & Pay</p>
            <img src={qrUrl} alt="QR Code" />
          </div>

          {/* 🔹 SAVE PAYMENT */}
          <button className="submit-btn" onClick={makePayment}>
            Mark as Paid
          </button>

          {/* 🔹 RAZORPAY */}
          <button className="razorpay-btn" onClick={payWithRazorpay}>
            Pay with Razorpay
          </button>

        </div>
      </div>
    )}
    {/* CHAT MODAL */}
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
export default AssignedTasks;