import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Leaf } from 'lucide-react';

// Simulación de Redux Store
const useStore = () => {
  const [cart, setCart] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState(new Set());

  const addToCart = (plant) => {
    const existingItem = cart.find(item => item.id === plant.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === plant.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...plant, quantity: 1 }]);
    }
    setDisabledButtons(new Set([...disabledButtons, plant.id]));
  };

  const incrementQuantity = (plantId) => {
    setCart(cart.map(item => 
      item.id === plantId 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decrementQuantity = (plantId) => {
    setCart(cart.map(item => 
      item.id === plantId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const removeFromCart = (plantId) => {
    setCart(cart.filter(item => item.id !== plantId));
    setDisabledButtons(new Set([...disabledButtons].filter(id => id !== plantId)));
  };

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return {
    cart,
    disabledButtons,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice
  };
};

// Datos de las plantas
const plants = [
  // Plantas de Interior
  { id: 1, name: "Monstera Deliciosa", price: 45.99, category: "Interior", image: "🌿" },
  { id: 2, name: "Pothos Dorado", price: 25.99, category: "Interior", image: "🌱" },
  
  // Plantas de Exterior
  { id: 3, name: "Rosa Roja", price: 35.99, category: "Exterior", image: "🌹" },
  { id: 4, name: "Lavanda", price: 28.99, category: "Exterior", image: "🌸" },
  
  // Suculentas
  { id: 5, name: "Aloe Vera", price: 18.99, category: "Suculentas", image: "🌵" },
  { id: 6, name: "Echeveria", price: 22.99, category: "Suculentas", image: "🪴" }
];

const categories = ["Interior", "Exterior", "Suculentas"];

// Componente Principal
const PlantStoreApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const store = useStore();

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-2xl text-center">
        <div className="mb-6">
          <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-green-800 mb-2">PlantHub</h1>
          <h2 className="text-xl text-green-600">Tu tienda de plantas favorita</h2>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-700 text-lg leading-relaxed">
            En PlantHub nos especializamos en brindarte las mejores plantas para transformar 
            tu hogar y jardín. Con más de 10 años de experiencia, ofrecemos plantas de alta 
            calidad, cuidadas con amor y seleccionadas especialmente para ti. Desde plantas 
            de interior que purifican el aire hasta hermosas flores para tu jardín exterior.
          </p>
        </div>
        
        <button 
          onClick={() => setCurrentPage('products')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Comenzar
        </button>
      </div>
    </div>
  );

  const ProductsPage = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentPage('home')}
              className="text-green-600 hover:text-green-800 font-semibold"
            >
              ← Inicio
            </button>
            <h1 className="text-3xl font-bold text-green-800">Nuestras Plantas</h1>
          </div>
          
          <button 
            onClick={() => setCurrentPage('cart')}
            className="relative bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {store.getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">
                {store.getTotalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Productos por categoría */}
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-4 border-b-2 border-green-200 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plants.filter(plant => plant.category === category).map(plant => (
                <div key={plant.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <span className="text-6xl">{plant.image}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{plant.name}</h3>
                    <p className="text-2xl font-bold text-green-600 mb-4">${plant.price}</p>
                    <button
                      onClick={() => store.addToCart(plant)}
                      disabled={store.disabledButtons.has(plant.id)}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                        store.disabledButtons.has(plant.id)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {store.disabledButtons.has(plant.id) ? 'Agregada al carrito' : 'Añadir a la cesta'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CartPage = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentPage('products')}
              className="text-green-600 hover:text-green-800 font-semibold"
            >
              ← Continuar comprando
            </button>
            <h1 className="text-3xl font-bold text-green-800">Carrito de Compras</h1>
          </div>
        </div>

        {store.cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500">Agrega algunas plantas hermosas a tu carrito</p>
          </div>
        ) : (
          <>
            {/* Lista de productos */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Total de plantas: {store.getTotalItems()}
              </h2>
              
              {store.cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">{item.image}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                    <p className="text-green-600 font-semibold">${item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => store.decrementQuantity(item.id)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    
                    <button
                      onClick={() => store.incrementQuantity(item.id)}
                      className="w-8 h-8 rounded-full bg-green-200 hover:bg-green-300 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => store.removeFromCart(item.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="text-right min-w-[80px]">
                    <p className="text-lg font-bold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen del Pedido</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span>${store.getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-2xl font-bold text-green-600">
                    <span>Total:</span>
                    <span>${store.getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-xl transition-colors">
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Renderizado condicional según la página actual
  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'products':
      return <ProductsPage />;
    case 'cart':
      return <CartPage />;
    default:
      return <HomePage />;
  }
};

export default PlantStoreApp;