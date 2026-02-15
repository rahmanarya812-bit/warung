import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Phone, MapPin, Trash2 } from "lucide-react";

export default function WarungWebsite() {
  const phoneNumber = "6285607492894";

  const menuItems = [
    { id: 1, name: "Nasi Goreng", price: 15000, desc: "Nasi goreng spesial dengan telur dan ayam." },
    { id: 2, name: "Mie Ayam", price: 12000, desc: "Mie ayam gurih dengan topping melimpah." },
    { id: 3, name: "Ayam Geprek", price: 18000, desc: "Ayam crispy dengan sambal pedas mantap." }
  ];

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState("");

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prevCart, { ...item, qty: 1 }];
    });

    setNotification(`${item.name} berhasil ditambahkan ke keranjang ✅`);
    setTimeout(() => setNotification(""), 2000);
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const sendToWhatsApp = () => {
    if (cart.length === 0) return;

    const productList = cart
      .map((item) => `${item.name} x${item.qty}`)
      .join(" + ");

    const rawMessage = `Halo Warung Nusantara, saya ingin membeli ${productList} dan totalnya adalah Rp${totalPrice.toLocaleString("id-ID")}.`;

    const encodedMessage = encodeURIComponent(rawMessage);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white text-gray-800 relative">

      {notification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-5 py-3 rounded-2xl shadow-xl z-50">
          {notification}
        </div>
      )}

      <section className="text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Warung Nusantara
        </motion.h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Menyediakan makanan rumahan lezat, harga terjangkau, dan rasa yang bikin kangen.
        </p>
        <Button
          onClick={() => setShowCart(!showCart)}
          className="rounded-2xl px-6 py-3 text-lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Keranjang ({totalItems})
        </Button>
      </section>

      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-10">Menu Favorit</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-sm mb-4">{item.desc}</p>
                  <p className="font-semibold mb-4">
                    Rp{item.price.toLocaleString("id-ID")}
                  </p>
                  <Button
                    onClick={() => addToCart(item)}
                    className="w-full rounded-xl"
                  >
                    + Tambah ke Keranjang
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {showCart && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <Card className="rounded-2xl shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Detail Keranjang</h2>

              {cart.length === 0 && <p>Keranjang masih kosong.</p>}

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-4 border-b pb-3"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Rp{item.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button onClick={() => decreaseQty(item.id)}>➖</Button>
                    <span>{item.qty}</span>
                    <Button onClick={() => increaseQty(item.id)}>➕</Button>
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {cart.length > 0 && (
                <div className="mt-6">
                  <div className="font-bold text-lg mb-4">
                    Total: Rp{totalPrice.toLocaleString("id-ID")}
                  </div>
                  <Button
                    onClick={sendToWhatsApp}
                    className="w-full rounded-xl text-lg"
                  >
                    Kirim Pesanan ke WhatsApp
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-8">Hubungi Kami</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 flex flex-col items-center">
              <Phone className="h-8 w-8 mb-4" />
              <p>+62 856-0749-2894</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 flex flex-col items-center">
              <MapPin className="h-8 w-8 mb-4" />
              <p>Jl. Raya Warung No. 123, Indonesia</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Warung Nusantara. All rights reserved.
      </footer>
    </div>
  );
}
