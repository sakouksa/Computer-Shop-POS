import { useEffect, useState, useCallback } from "react"; // ១. បន្ថែម useCallback
import { Row, Col, message } from "antd";
import { request } from "../../util/request";
import config from "../../util/config";
import ProductCart from "../../component/product/ProductCart";

function ProductPageItemCard() {
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
  });

  // ខ្ចប់ getList ជាមួយ useCallback ដើម្បីកុំឲ្យវាបង្កើតថ្មីរាល់ពេល Render
  const getList = useCallback(async () => {
    setState((pre) => ({ ...pre, loading: true }));
    const res = await request("products", "get", {});

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
  }, []);

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onAddToBagTest = (item) => {
    message.success(`បានបន្ថែម "${item.product_name}" ទៅក្នុងកន្ត្រកជោគជ័យ!`);
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
