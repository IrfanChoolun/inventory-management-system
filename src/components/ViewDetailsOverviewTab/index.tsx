import { ProductVariation, Location, Category } from "@/utils/ProductService";
import "./ViewDetailsOverviewTab.scss";
import { Badge, Table, TableColumnsType } from "antd";

interface LocationDataType {
	key: string;
	// name: JSX.Element;
	// description: JSX.Element;
	location: string;
	stock: number;
	// status: JSX.Element;
}

interface DetailsDataType {
	key: string;
	item_type: string;
	variations: Array<any>;
}

const ViewDetailsOverviewTab = ({
	product: product,
	locations,
	category,
}: {
	product: ProductVariation[];
	locations: Location[];
	category: string;
}) => {
	// Locations Table
	const loc_data: LocationDataType[] = product[0].stock_per_location.map(
		(item, index) => {
			// console.log("item:", item.location);
			let stock;
			let location = ""; // Update the variable type to Location
			locations.map((loc) => {
				if (loc.id === item.location) {
					location = loc.name;
					stock = item.stock;
				}
			});
			return {
				key: index.toString(),
				location: location,
				stock: item.stock,
			};
		}
	);

	const loc_columns: TableColumnsType<LocationDataType> = [
		{
			title: "key",
			dataIndex: "key",
			key: "key",
			hidden: true,
		},
		{
			title: "Location",
			dataIndex: "location",
			key: "location",
			// hidden: true,
		},
		{
			title: "Stock",
			dataIndex: "stock",
			key: "stock",
		},
	];

	return (
		<div className="viewDetailsOverviewTab">
			<h5>{product[0].name}</h5>
			<div className="grid_container">
				<div className="grid_row">
					<div className="grid_label">SKU</div>
					<div className="grid_value">{product[0].sku}</div>
				</div>
				<div className="grid_row">
					<div className="grid_label">Price</div>
					<div className="grid_value">{product[0].price}</div>
				</div>
				<div className="grid_row">
					<div className="grid_label">Min Stock</div>
					<div className="grid_value">{product[0].min_stock}</div>
				</div>
				<div className="grid_row">
					<div className="grid_label">Status</div>
					<div className="grid_value">
						{product[0].status ? (
							<Badge status="success" text="In Stock" />
						) : (
							<Badge status="error" text="Out of Stock" />
						)}
					</div>
				</div>
				{/* {product.map((product, index) => {
					return (
						<div className="grid_row" key={index}>
							<div className="grid_label">{index}</div>
							<div className="grid_value"></div>
						</div>
						// <div key={product.id} className="grid_item">
						// 	<h5>{product.name}</h5>
						// 	<p>{product.price}</p>
						// 	<p>{product.stock_level}</p>
						// 	<p>{product.stock}</p>
						// 	<p>{product.status}</p>
						// 	<p>{product.min_stock}</p>
						// 	<p>{product.location}</p>
						// </div>
					);
				})} */}
			</div>
			<div className="variations">
				<h5>Details</h5>
				<div className="grid_container">
					<div className="grid_row">
						<div className="grid_label">Item Type</div>
						<div className="grid_value">{category}</div>
					</div>
					{Object.keys((product[0] as any).variations).map(
						(key: string) => {
							if (
								Object.prototype.hasOwnProperty.call(
									(product[0] as any).variations,
									key
								)
							) {
								const value: any = (product[0] as any)
									.variations[key];
								return (
									<div className="grid_row" key={key}>
										<div className="grid_label">{key}</div>
										<div className="grid_value">
											{value}
										</div>
									</div>
								);
							}
							return null;
						}
					)}
				</div>
			</div>
			<div className="locations">
				<h5>Stock Locations</h5>
				<Table
					columns={loc_columns}
					rowKey={(record) => record.key}
					rowClassName="parent-row"
					dataSource={loc_data}
					className="location-table"
					pagination={false}
					// onChange={handleChange}
				/>
			</div>
		</div>
	);
};

export default ViewDetailsOverviewTab;
