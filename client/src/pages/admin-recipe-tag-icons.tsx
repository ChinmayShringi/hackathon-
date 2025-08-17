import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ColorPicker } from '@/components/ui/color-picker';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, AlertCircle, CheckCircle, LogOut } from 'lucide-react';
import LucideIconPicker from '@/components/lucide-icon-picker';
import * as LucideIcons from 'lucide-react';
import lucideIconMappingJson from '../../../scripts/lucide-icon-mapping.json';

interface LucideIconMapping {
  kebabToPascalMap: Record<string, string>;
  pascalToKebabMap: Record<string, string>;
  iconNames: string[];
}
const lucideIconMapping = lucideIconMappingJson as LucideIconMapping;
const { kebabToPascalMap } = lucideIconMapping;

interface RecipeTagIcon {
  id: string;
  display: string;
  icon: string | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminStatus {
  isAuthenticated: boolean;
  username: string | null;
}

export default function AdminRecipeTagIcons() {
  const [, setLocation] = useLocation();
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null);
  const [icons, setIcons] = useState<RecipeTagIcon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIcon, setEditingIcon] = useState<RecipeTagIcon | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    display: '',
    icon: '',
    color: ''
  });

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (adminStatus?.isAuthenticated) {
      fetchIcons();
    }
  }, [adminStatus]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/status');
      const data = await response.json();
      
      if (response.ok) {
        setAdminStatus(data);
        if (!data.isAuthenticated) {
          setLocation('/admin/login');
        }
      } else {
        setLocation('/admin/login');
      }
    } catch (error) {
      setLocation('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIcons = async () => {
    try {
      const response = await fetch('/api/admin/recipe-tag-icons');
      const data = await response.json();
      
      if (response.ok) {
        setIcons(data.icons);
      } else {
        setError('Failed to fetch icons');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const handleSave = async () => {
    if (!formData.id || !formData.display) {
      setError('ID and Display are required');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const url = editingIcon 
        ? `/api/admin/recipe-tag-icons/${editingIcon.id}`
        : '/api/admin/recipe-tag-icons';
      
      const method = editingIcon ? 'PUT' : 'POST';
      const body = editingIcon 
        ? { display: formData.display, icon: formData.icon || null, color: formData.color || null }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setIsDialogOpen(false);
        resetForm();
        fetchIcons(); // Refresh the list
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this icon mapping?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/recipe-tag-icons/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccess('Icon mapping deleted successfully');
        fetchIcons(); // Refresh the list
      } else {
        setError('Failed to delete icon mapping');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const handleEdit = (icon: RecipeTagIcon) => {
    setEditingIcon(icon);
    setFormData({
      id: icon.id,
      display: icon.display,
      icon: icon.icon || '',
      color: icon.color || ''
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingIcon(null);
    setFormData({
      id: '',
      display: '',
      icon: '',
      color: ''
    });
    setIsDialogOpen(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setLocation('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetForm = () => {
    setEditingIcon(null);
    setFormData({
      id: '',
      display: '',
      icon: '',
      color: ''
    });
  };

  const renderIcon = (iconName: string | null) => {
    if (!iconName) return <span className="text-gray-500">No icon</span>;
    const pascal = kebabToPascalMap[iconName] || iconName;
    const IconComponent = LucideIcons[pascal as keyof typeof LucideIcons] as React.ComponentType<any>;
    if (!IconComponent) return <span className="text-gray-500">{iconName}</span>;
    return (
      <div className="flex items-center space-x-2">
        <IconComponent className="w-5 h-5" />
        <span className="text-sm text-gray-400">{iconName}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!adminStatus?.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/admin')}
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white">Recipe Tag Icon Manager</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Logged in as <span className="font-semibold text-blue-400">{adminStatus.username}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Icon Mapping
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-900/20 border-green-700">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-300">{success}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recipe Tag Icons</CardTitle>
            <CardDescription className="text-gray-400">
              Manage icons for recipe option tags. These icons will be displayed in the recipe form.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Tag Variable</TableHead>
                  <TableHead className="text-gray-300">Display Name</TableHead>
                  <TableHead className="text-gray-300">Icon</TableHead>
                  <TableHead className="text-gray-300">Color</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {icons.map((icon) => (
                  <TableRow key={icon.id} className="border-gray-700">
                    <TableCell className="text-white font-mono text-sm">
                      {icon.id}
                    </TableCell>
                    <TableCell className="text-white">
                      {icon.display}
                    </TableCell>
                    <TableCell className="text-white">
                      {renderIcon(icon.icon)}
                    </TableCell>
                    <TableCell className="text-white">
                      {icon.color ? (
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded border-2 border-gray-600 shadow-sm"
                            style={{ backgroundColor: icon.color }}
                          />
                          <span className="text-sm font-mono">{icon.color}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Default</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(icon)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(icon.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {icons.length === 0 && (
                  <TableRow className="border-gray-700">
                    <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                      No icon mappings found. Click "Add Icon Mapping" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingIcon ? 'Edit Icon Mapping' : 'Add Icon Mapping'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id" className="text-gray-300">
                Tag Variable (ID)
              </Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g., Age, Cat Breed, Food Type"
                className="bg-gray-700 border-gray-600 text-white"
                disabled={!!editingIcon} // Can't edit ID when editing
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display" className="text-gray-300">
                Display Name
              </Label>
              <Input
                id="display"
                value={formData.display}
                onChange={(e) => setFormData({ ...formData, display: e.target.value })}
                placeholder="e.g., Age, Cat Breed, Food Type"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Icon</Label>
              <LucideIconPicker
                value={formData.icon}
                onChange={(icon) => setFormData({ ...formData, icon })}
                placeholder="Select an icon..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-gray-300">
                Color Override (optional)
              </Label>
              <ColorPicker
                value={formData.color || "#000000"}
                onChange={(color) => setFormData({ ...formData, color })}
                placeholder="Select a color or enter hex code..."
                className="w-full"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 