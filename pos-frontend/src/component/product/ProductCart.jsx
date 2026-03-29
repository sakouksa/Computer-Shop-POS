import React, { useState } from "react"; // 1. Import useState
import { Button, Row } from "antd";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa6";
import { ShoppingCartOutlined } from "@ant-design/icons";
const ProductCard = ({
  product_name,
  description,
  price,
  image,
  id,
  onAddToWishlist,
  wishlist,
  onAddToBag,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ height: "100%", display: "flex" }}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 20,
          backgroundColor: "#FFF",
          borderRadius: 10,
          width: "100%",
          margin: "10px",

          boxShadow: isHovered
            ? "rgba(0, 0, 0, 0.2) 0px 20px 30px"
            : "rgba(149, 157, 165, 0.4) 0px 8px 24px",

          transform: isHovered ? "translateY(-5px)" : "translateY(0)",

          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
      >
        <div>
          <div
            style={{
              height: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={image}
              alt={"រូបភាពមានបញ្ហា" + product_name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: 5,
                marginBottom: 10,
              }}
            />
          </div>
          <Row justify="space-between">
            <div style={{ fontWeight: "bold", fontSize: 16 }}>
              {product_name}
            </div>
            {wishlist ? (
              <FaHeart
                onClick={onAddToWishlist}
                style={{ color: "red", fontSize: 20 }}
              />
            ) : (
              <CiHeart
                onClick={onAddToWishlist}
                style={{ color: "gray", fontSize: 20 }}
              />
            )}
          </Row>

          <div style={{ color: "#666", margin: "5px 0", minHeight: "40px" }}>
            {description}
          </div>

          <div style={{ fontSize: 14, color: "#888" }}>
            <span style={{ textDecoration: "line-through" }}>{price}$</span>
          </div>

          <div style={{ fontWeight: "bold", color: "green", fontSize: 18 }}>
            {price}$ <span style={{ fontSize: 14 }}>10%</span>
          </div>
        </div>

        {/* button add to bag */}
        <div style={{ textAlign: "right", marginTop: 15 }}>
          <Button
            type="primary"
            onClick={onAddToBag}
            icon={<ShoppingCartOutlined />}
            style={{
              borderRadius: "6px",
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "500",
              height: "38px",
              boxShadow: "none",
            }}
          >
            ថែមចូលកន្ត្រក
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
