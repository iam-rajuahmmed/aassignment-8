'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { addBook } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';
import { PlusCircle, UploadCloud, Image as ImageIcon, BookOpen, User, Mail, Layers } from 'lucide-react';

export default function AddBookPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Fiction',
    copies: 1,
    image: '',
    description: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'BookNook | Add Book';
  }, []);

  // Image Upload handler to ImgBB
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size < 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading('Uploading cover image to ImgBB...');

    try {
      const imgData = new FormData();
      imgData.append('image', file);

      // ImgBB upload endpoint
      const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'd5a0c8e2270923055ba2e6467362df5b';
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: 'POST',
        body: imgData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
        toast.success('Cover image uploaded successfully!', { id: toastId });
      } else {
        // Fallback to local data URL preview if ImgBB API key has reached quota
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
          toast.success('Image loaded successfully!', { id: toastId });
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Local preview fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
        toast.success('Image loaded preview successfully!', { id: toastId });
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.category) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!formData.image) {
      toast.error('Please provide a cover image for the book.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await addBook(
        {
          title: formData.title,
          author: formData.author,
          category: formData.category,
          copies: Number(formData.copies) || 1,
          image: formData.image,
          description: formData.description,
          userName: user?.name,
          userEmail: user?.email,
        },
        token
      );

      toast.success(response.message || 'Book added to library successfully!');
      router.push('/my-books');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add book. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto py-6 animate-in fade-in duration-300">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900 mb-3">
            <PlusCircle className="w-4 h-4" />
            <span>Contribute to Library</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Add a New Book
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm max-w-lg mx-auto">
            Share your favorite reads with the BookNook community. Complete the details below to catalog the book.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xl p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Book Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Sapiens: A Brief History"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Author Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. Yuval Noah Harari"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Category & Total Copies (Challenge field) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Category / Genre <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Kids">Kids</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Total Copies Available <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    required
                    value={formData.copies}
                    onChange={(e) => setFormData({ ...formData, copies: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Layers className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Book Image Upload / URL */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Book Cover Image (Upload to ImgBB or Direct URL) <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* File Upload to ImgBB */}
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 rounded-2xl p-4 text-center cursor-pointer flex flex-col items-center justify-center transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    disabled={uploadingImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {uploadingImage ? 'Uploading image...' : 'Click to upload image'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="Or paste direct image URL (https://...)"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <ImageIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-10 h-14 object-cover rounded shadow-2xs"
                      />
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate">
                        Cover image loaded ready
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Short Description / Synopsis
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Write a concise overview of the book to help readers know what it is about..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Read-Only User Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Contributor Name (Read-Only)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={user?.name || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 text-sm cursor-not-allowed"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Contributor Email (Read-Only)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 text-sm cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-600/30 hover:scale-[1.01] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>{submitting ? 'Adding Book to Library...' : 'Add Book'}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </ProtectedRoute>
  );
}

