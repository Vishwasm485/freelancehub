function ViewResources({ setPage }) {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>View Resources</h2>
      <p>All uploaded resources will appear here 📂</p>

      <button onClick={() => setPage("admin")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default ViewResources;