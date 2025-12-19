import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategoryStore, Category } from '@/store/categoryStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: z.string().max(500).optional(),
  parentId: z.string().nullable(),
  icon: z.string().max(10).optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  status: z.enum(['active', 'inactive']),
  featured: z.boolean(),
  position: z.number().min(0),
  showOnMenu: z.boolean(),
  showOnHomepage: z.boolean(),
  showInSearch: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export default function CategoryFormDialog({ open, onOpenChange, category }: Props) {
  const { categories, addCategory, updateCategory } = useCategoryStore();
  const isEditing = !!category;

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parentId: null,
      icon: '',
      metaTitle: '',
      metaDescription: '',
      status: 'active',
      featured: false,
      position: 1,
      showOnMenu: true,
      showOnHomepage: true,
      showInSearch: true,
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        parentId: category.parentId,
        icon: category.icon || '',
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || '',
        status: category.status,
        featured: category.featured,
        position: category.position,
        showOnMenu: category.showOnMenu,
        showOnHomepage: category.showOnHomepage,
        showInSearch: category.showInSearch,
      });
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        parentId: null,
        icon: '',
        metaTitle: '',
        metaDescription: '',
        status: 'active',
        featured: false,
        position: categories.length + 1,
        showOnMenu: true,
        showOnHomepage: true,
        showInSearch: true,
      });
    }
  }, [category, form, categories.length]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    form.setValue('name', name);
    if (!isEditing || !form.getValues('slug')) {
      form.setValue('slug', generateSlug(name));
    }
  };

  const onSubmit = (data: CategoryFormData) => {
    if (isEditing && category) {
      updateCategory(category.id, {
        ...data,
        image: category.image,
        banner: category.banner,
      });
      toast.success('Category updated');
    } else {
      addCategory({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        parentId: data.parentId,
        icon: data.icon || null,
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        status: data.status,
        featured: data.featured,
        position: data.position,
        showOnMenu: data.showOnMenu,
        showOnHomepage: data.showOnHomepage,
        showInSearch: data.showInSearch,
        image: null,
        banner: null,
      });
      toast.success('Category created');
    }
    onOpenChange(false);
  };

  const parentOptions = categories.filter((c) => c.id !== category?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="visibility">Visibility</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="bg-secondary border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-secondary border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Category description..."
                          rows={3}
                          className="bg-secondary border-border resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Category</FormLabel>
                        <Select
                          value={field.value || 'none'}
                          onValueChange={(value) =>
                            field.onChange(value === 'none' ? null : value)
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="bg-secondary border-border">
                              <SelectValue placeholder="Select parent" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No Parent (Root)</SelectItem>
                            {parentOptions.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon (Emoji)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="📱"
                            className="bg-secondary border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="bg-secondary border-border">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Position</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-secondary border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title (max 60 chars)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="SEO title for search engines"
                          maxLength={60}
                          className="bg-secondary border-border"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/60 characters
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description (max 160 chars)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="SEO description for search engines"
                          maxLength={160}
                          rows={3}
                          className="bg-secondary border-border resize-none"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/160 characters
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="visibility" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="showOnMenu"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <FormLabel className="text-base">Show on Menu</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Display this category in navigation menu
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="showOnHomepage"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <FormLabel className="text-base">Show on Homepage</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Display this category on homepage
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="showInSearch"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <FormLabel className="text-base">Show in Search</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Allow this category to appear in search results
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-border p-4 bg-accent/50">
                      <div>
                        <FormLabel className="text-base">⭐ Featured Category</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Show in "Shop by Category" section on homepage
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary text-primary-foreground">
                {isEditing ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
