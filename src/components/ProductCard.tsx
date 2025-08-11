import React from 'react';
import { Product } from '../types/Product';
import { MapPin, MessageCircle, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleWhatsAppClick = () => {
    const message = `Bonjour, je suis intéressé(e) par votre produit : ${product.title} - ${formatPrice(product.price)}`;
    const whatsappUrl = `https://wa.me/${product.sellerPhone.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <div className="absolute top-3 left-3">
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Star className="h-3 w-3 fill-current" />
              <span>Featured</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.stock > 0 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {product.stock > 0 ? `${product.stock} disponible${product.stock > 1 ? 's' : ''}` : 'Épuisé'}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* Vendeur */}
        <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-1">
            <span className="font-medium">{product.sellerName}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{product.location}</span>
          </div>
        </div>

        {/* Bouton WhatsApp */}
        <button
          onClick={handleWhatsAppClick}
          disabled={product.stock === 0}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Contacter sur WhatsApp</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;