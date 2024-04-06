import "./Dashboard.scss";
import CommonLayout from "../../components/CommonLayout";

function Dashboard({
  expandedItems,
  setExpandedItems,
}: {
  expandedItems: any;
  setExpandedItems: any;
}) {
  return (
    <CommonLayout
      pageName="dashboard"
      breadCrumbText="Dashboard"
      expandedItems={expandedItems}
      setExpandedItems={setExpandedItems}
    >
      <h1>Dashboard</h1>
    </CommonLayout>
  );
}

export default Dashboard;
