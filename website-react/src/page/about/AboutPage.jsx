import { Row, Col, Button } from "antd";
import ProductCart from "../../component/product/ProductCart";
import { productStore } from "../../store/ProductStore";

const AboutPage = () => {
  const { list } = productStore();
  const newlist = [list[0], list[1], list[2], list[3]]; // Take first 4 products
  const onAddToBage = () => {
    alert("Hello");
  };
  return (
    <div style={{ padding: "20px" }}>
      <h1>About Page</h1>
      <p>Here are some of our featured products:</p>
      <Row gutter={[16, 16]}>
        {newlist?.map((item, index) => (
          <Col key={index} xs={24} md={8} lg={6}>
            <ProductCart {...item}
            description={item.des} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AboutPage;
