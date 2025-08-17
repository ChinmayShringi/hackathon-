import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Tag, LogOut, ArrowLeft, Database } from 'lucide-react';

interface AdminStatus {
  isAuthenticated: boolean;
  username: string | null;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

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

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setLocation('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const editorActions = [
    {
      id: 'recipe-tag-icons',
      title: 'Recipe Tag Icon Manager',
      description: 'Manage icons for recipe option tags',
      icon: Tag,
      href: '/admin/recipe-tag-icons',
      status: 'active'
    },
    {
      id: 'backlog-maintenance',
      title: 'Backlog Maintenance',
      description: 'Monitor and manage system backlog generations',
      icon: Database,
      href: '/admin/backlog-maintenance',
      status: 'active'
    }
    // Future editor actions can be added here
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!adminStatus?.isAuthenticated) {
    return null; // Will redirect to login
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
                onClick={() => setLocation('/')}
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Site
              </Button>
              <div className="flex items-center space-x-2">
                <Settings className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Editor Actions</h2>
          <p className="text-gray-400">Manage various aspects of the platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editorActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Card
                key={action.id}
                className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => setLocation(action.href)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{action.title}</CardTitle>
                        <Badge 
                          variant={action.status === 'active' ? 'default' : 'secondary'}
                          className="mt-1"
                        >
                          {action.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    {action.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Future Actions Placeholder */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-white mb-4">Coming Soon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700 opacity-50">
              <CardHeader>
                <CardTitle className="text-gray-400">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-500">
                  Manage user accounts and permissions
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 opacity-50">
              <CardHeader>
                <CardTitle className="text-gray-400">Content Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-500">
                  Review and moderate user-generated content
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 opacity-50">
              <CardHeader>
                <CardTitle className="text-gray-400">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-500">
                  View platform usage statistics and insights
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 