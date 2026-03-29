import ProductCart from "../../component/product/ProductCart";
import { useEffect, useState } from "react";
import { Row, Col, message } from "antd";
import { request } from "../../util/request";
import config from "../../util/config";

function ProductPageItemCard() {
  // const { list } = productStore();
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
  });
  const onAddToBagTest = (item) => {
    // បង្ហាញក្នុង Console
    // console.log(item);
    message.success(`បានបន្ថែម "${item.product_name}" ទៅក្នុងកន្ត្រកជោគជ័យ!`);
  };

  useEffect(() => {
    getlist();
  }, []);

  const getlist = async () => {
    setState((pre) => ({ ...pre, loading: true }));

    const res = await request("products", "get", {});
    console.log("Response data:", res);
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        list: res.list || [],
        loading: false,
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
      if (res.errors?.message) {
        message.error(res.errors?.message);
      }
    }
  };

  return (
    <div>
      <div>Product</div>
      {state.loading && <div>កំពុងទាញទិន្នន័យ...</div>}

      <Row gutter={[16, 16]}>
        {state.list?.map((item, index) => (
          <Col key={index} xs={24} md={8} lg={6}>
            <ProductCart
              {...item}
              name={item.product_name}
              description={item.description}
              price={item.price}
              image={config.image_path + item.image}
              onAddToBag={() => onAddToBagTest(item)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ProductPageItemCard;
