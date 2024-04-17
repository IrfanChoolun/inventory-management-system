const ProductsTable = () => {
	return (
		<Table
			columns={columns}
			rowKey={(record) => record.key}
			expandable={{
				expandedRowRender: (record) => expandedRowRender(record.key),
				defaultExpandedRowKeys: ["0"],
				// rowExpandable: (record) => isRowExpandable(record.key),
				// expandRowByClick: true,
				// onExpand={(record, event) => {
				// 	console.log(record, record);
				// },
				// }},
			}}
			rowClassName="parent-row"
			dataSource={data}
			// onChange={handleChange}
		/>
	);
};
