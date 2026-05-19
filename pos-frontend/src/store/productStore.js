import { List } from "antd";
import { create } from "zustand";
import apple from "../assets/image/apple/apple1.jpg";
import acer from "../assets/image/acer/acer1.jpg";
import dell from "../assets/image/dell/dell1.jpg";
import asus from "../assets/image/asus/asus1.jpg";

export const productStore = create((set) => ({
  count: 10, //state
  list: [
    {
      id: 1,
      name: "Mackbook Pro 2022",
      des: "BRAM: 16GB, SSD: 512GB",
      price: 1200,
      image: apple,
      wishlist: 1,
    },
    {
      id: 2,
      name: "Acer Aspire 5",
      des: "BRAM: 8GB, SSD: 256GB",
      price: 900,
      image: acer,
      wishlist: 1,
    },
    {
      id: 3,
      name: "Dell XPS 13",
      des: "BRAM: 16GB, SSD: 512GB",
      price: 1100,
      image: dell,
      wishlist: 1,
    },
    {
      id: 4,
      name: "Apple MacBook Air",
      des: "BRAM: 16GB, SSD: 1TB",
      price: 1300,
      image: apple,
      wishlist: 1,
    },
    {
      id: 5,
      name: "Asus ROG Zephyrus G14",
      des: "BRAM: 16GB, SSD: 1TB",
      price: 1400,
      image: asus,
      wishlist: 0,
    },
    {
      id: 6,
      name: "Asus ZenBook 14",
      des: "BRAM: 8GB, SSD: 512GB",
      price: 950,
      image: asus,
      wishlist: 0,
    },
    {
      id: 7,
      name: "Acer Swift 3",
      des: "BRAM: 8GB, SSD: 256GB",
      price: 850,
      image: acer,
      wishlist: 0,
    },
    {
      id: 8,
      name: "Lenovo ThinkPad X1",
      des: "BRAM: 16GB, SSD: 512GB",
      price: 1250,
      image: apple,
      wishlist: 1,
    },
    {
      id: 9,
      name: "Razer Blade 15",
      des: "BRAM: 16GB, SSD: 1TB",
      price: 1800,
      image: apple,
      wishlist: 0,
    },
    {
      id: 10,
      name: "Google Pixelbook Go",
      des: "BRAM: 8GB, SSD: 256GB",
      price: 650,
      image: apple,
      wishlist: 1,
    },
  ],
  hanlewishlist: (param) => {
    set((pre) => {
      const indexProduct = pre.list?.findIndex((item) => item.id === param.id);
      pre.list[indexProduct].wishlist = !param.wishlist; //Update only wishlist keyt
      pre.list[indexProduct].price = 500; //Update only wishlist keyt
      return {
        list: pre.list,
      };
    });
  },
}));
