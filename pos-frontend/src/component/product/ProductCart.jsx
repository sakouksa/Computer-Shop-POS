import React, { useState } from "react"; // 1. Import useState
import { Button, Row } from "antd";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa6";

const ProductCard = ({
  name,
  description,
  price,
  image,
  id,
  onAddToWishlist,
  wishlist,
}) => {
  // 2. បង្កើត state ដើម្បីដឹងថា mouse កំពុងដាក់ពីលើឬអត់
  const [isHovered, setIsHovered] = useState(false);
  

  return (
    <div style={{ height: "100%", display: "flex" }}>
      <div
        // 3. ដាក់ event ដើម្បីចាប់ពេល mouse ចូល និង ចេញ
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

          // 4. កន្លែងកែប្រែ Style ពេល Hover
          boxShadow: isHovered
            ? "rgba(0, 0, 0, 0.2) 0px 20px 30px"
            : "rgba(149, 157, 165, 0.4) 0px 8px 24px",

          // ធ្វើឱ្យប្រអប់ងើបឡើងលើបន្តិចពេល Hover
          transform: isHovered ? "translateY(-5px)" : "translateY(0)",

          // ធ្វើឱ្យចលនារលូន (Smooth animation)
          transition: "all 0.3s ease",
          cursor: "pointer", // ដូររូប Mouse ទៅជាដៃ
        }}
      >
        <div>
          {/* ផ្នែករូបភាព */}
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
              alt={name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: 5,
                marginBottom: 10,
              }}
            />
          </div>
          <Row justify="space-between">
            <div style={{ fontWeight: "bold", fontSize: 16 }}>{name}</div>
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

        {/* ប៊ូតុង */}
        <div style={{ textAlign: "right", marginTop: 15 }}>
          <Button type="primary" >
            Add to bag
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
