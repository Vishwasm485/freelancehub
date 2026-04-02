function PostResource({ setPage }) {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Post Resource</h2>
      <p>Upload learning materials here 📚</p>

      <button onClick={() => setPage("admin")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default PostResource;