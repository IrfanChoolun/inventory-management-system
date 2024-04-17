import "./Dashboard.scss";
import CommonLayout from "../../components/CommonLayout";

function Dashboard({
	expandedItems,
	setExpandedItems,
	globalUser,
	setGlobalUser,
}: {
	expandedItems: any;
	setExpandedItems: any;
	globalUser: any;
	setGlobalUser: any;
}) {
	return (
		<CommonLayout
			pageName="dashboard"
			// breadCrumbText="Dashboard"
			expandedItems={expandedItems}
			setExpandedItems={setExpandedItems}
			globalUser={globalUser}
			setGlobalUser={setGlobalUser}
		>
			<h1>Dashboard</h1>
		</CommonLayout>
	);
}

export default Dashboard;
