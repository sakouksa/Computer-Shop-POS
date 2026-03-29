// import React from "react";
// import { Button, Result } from "antd";
// import { ReloadOutlined } from "@ant-design/icons";

// const ServerErrorPage = () => {
//   return (
//     <div style={styles.container}>
//       <Result
//         status="500"
//         title={<span style={styles.title}>500</span>}
//         subTitle={
//           <div style={{ marginTop: "10px" }}>
//             <h2 style={styles.h2}>មានបញ្ហាបច្ចេកទេស!</h2>
//             <p style={styles.p}>
//               សុំទោស! ប្រព័ន្ធកំពុងមានបញ្ហាពីខាងក្នុង Server
//               សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។
//             </p>
//           </div>
//         }
//         extra={
//           <Button
//             type="primary"
//             size="large"
//             icon={<ReloadOutlined />}
//             onClick={() => window.location.reload()}
//             style={styles.btn}
//           >
//             ព្យាយាមម្តងទៀត
//           </Button>
//         }
//       />
//     </div>
//   );
// };

// // ប្រើ styles ដូចខាងលើ ឬប្តូរពណ៌តាមចិត្ត
// const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     minHeight: "80vh",
//     background: "#fff",
//   },
//   title: {
//     fontSize: "80px",
//     fontWeight: "800",
//     color: "#ff4d4f",
//     lineHeight: 1,
//   }, // ប្តូរជាពណ៌ក្រហមសម្រាប់ Server Error
//   h2: { color: "#1a1a1a", fontWeight: "600", fontSize: "22px" },
//   p: {
//     color: "#64748b",
//     fontSize: "15px",
//     maxWidth: "400px",
//     margin: "0 auto",
//   },
//   btn: {
//     borderRadius: "8px",
//     height: "45px",
//     padding: "0 30px",
//     background: "#1a1a1a",
//     border: "none",
//   },
// };

// export default ServerErrorPage;
