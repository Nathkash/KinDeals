import React, { useState } from 'react';
import { categories } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types/Product';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase'; // Fichier de config Firebase à créer

interface ProductFormProps {
  product?: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const { user } = useAuth();
  const storage = getStorage(app);

  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    stock: product?.stock || 1,
    location: product?.location || '',
    images: product?.images || [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.title.trim()) return setError('Le titre est requis');
      if (!formData.description.trim()) return setError('La description est requise');
      if (formData.price <= 0) return setError('Le prix doit être supérieur à 0');
      if (!formData.category) return setError('Veuillez sélectionner une catégorie');
      if (formData.images.length === 0) return setError('Ajoutez au moins une image');

      console.log('Saving product:', { ...formData, sellerId: user?.id });

      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave();
    } catch (err) {
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newImageUrls: string[] = [];

    for (const file of files) {
      const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      newImageUrls.push(downloadURL);
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImageUrls]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">

        {/* En-tête */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-4">
          <button onClick={onCancel} className="p-2 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{product ? 'Modifier le produit' : 'Ajouter un produit'}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Remplissez les informations de votre produit
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Titre */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Titre du produit *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Ex: iPhone 14 Pro Max 256GB"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg resize-none"
              placeholder="Décrivez votre produit en détail..."
            />
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-medium">Prix (USD) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="0.00"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium">Catégorie *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upload d'images */}
          <div>
            <label className="block text-sm font-medium">Photos du produit</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg cursor-pointer inline-block"
              >
                Choisir des photos
              </label>

              {/* Aperçu des images */}
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img} alt="Produit" className="w-full h-32 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="px-6 py-2 border rounded-lg">
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? 'Sauvegarde...' : (product ? 'Mettre à jour' : 'Publier')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
