import React from "react";
import { productStore } from "../../store/productStore";
import { Row, Col } from "antd";
import ProductCart from "../../component/product/ProductCart";

function ProductPage() {
  const { list } = productStore();
  const onAddToBage = (item) => {
    // alert(JSON.stringify(item));
    console.log(item);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>ProductPage</div>
      <Row gutter={[16, 16]}>
        {list?.map((item, index) => (
          <Col key={index} xs={24} md={8} lg={6}>
            <ProductCart
              {...item}
              description={item.des}
              onAddToBage={() => onAddToBage(item)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ProductPage;
