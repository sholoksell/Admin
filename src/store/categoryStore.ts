import { create } from 'zustand';
import { categoryApi, Category as ApiCategory } from '@/services/categoryService';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  image: string | null;
  banner: string | null;
  icon: string | null;
  metaTitle: string;
  metaDescription: string;
  status: 'active' | 'inactive';
  featured: boolean;
  position: number;
  showOnMenu: boolean;
  showOnHomepage: boolean;
  showInSearch: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: 'active' | 'inactive') => Promise<void>;
  reorderCategories: (reorderedCategories: Category[]) => void;
}

const mapApiCategory = (apiCat: ApiCategory): Category => ({
  id: apiCat._id,
  name: apiCat.name,
  slug: apiCat.slug,
  description: apiCat.description,
  parentId: apiCat.parentId,
  image: apiCat.image || null,
  banner: null,
  icon: null,
  metaTitle: apiCat.name,
  metaDescription: apiCat.description,
  status: apiCat.isActive ? 'active' : 'inactive',
  featured: apiCat.featured || false,
  position: apiCat.order,
  showOnMenu: true,
  showOnHomepage: true,
  showInSearch: true,
  createdAt: apiCat.createdAt,
  updatedAt: apiCat.updatedAt,
});

export const useCategoryStore = create<CategoryState>()((set) => ({
  categories: [],
  loading: false,
  
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const data = await categoryApi.getAll();
      const categories = data.map(mapApiCategory);
      set({ categories, loading: false });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ loading: false });
    }
  },
  
  addCategory: async (category) => {
    try {
      const data = await categoryApi.create({
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image || '',
        parentId: category.parentId,
        isActive: category.status === 'active',
        featured: category.featured || false,
        order: category.position,
      });
      set((state) => ({
        categories: [...state.categories, mapApiCategory(data)],
      }));
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },
  
  updateCategory: async (id, updates) => {
    try {
      const data = await categoryApi.update(id, {
        name: updates.name,
        slug: updates.slug,
        description: updates.description,
        image: updates.image || '',
        parentId: updates.parentId,
        isActive: updates.status === 'active',
        featured: updates.featured !== undefined ? updates.featured : false,
        order: updates.position,
      });
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? mapApiCategory(data) : cat
        ),
      }));
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },
  
  deleteCategory: async (id) => {
    try {
      await categoryApi.delete(id);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
  
  bulkDelete: async (ids) => {
    try {
      await categoryApi.bulkDelete(ids);
      set((state) => ({
        categories: state.categories.filter((cat) => !ids.includes(cat.id)),
      }));
    } catch (error) {
      console.error('Error bulk deleting categories:', error);
      throw error;
    }
  },
  
  bulkUpdateStatus: async (ids, status) => {
    try {
      await categoryApi.bulkUpdate(ids, status === 'active');
      set((state) => ({
        categories: state.categories.map((cat) =>
          ids.includes(cat.id) ? { ...cat, status } : cat
        ),
      }));
    } catch (error) {
      console.error('Error bulk updating categories:', error);
      throw error;
    }
  },
  
  reorderCategories: (reorderedCategories) =>
    set({ categories: reorderedCategories }),
}));
