
import React from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <Layout activeSection="settings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600 mt-1">Configure your application preferences</p>
          </div>
          <Button 
            variant="destructive" 
            className="flex items-center gap-2" 
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
        
        <div className="glass-card p-8 min-h-[300px] flex flex-col">
          <div className="flex-grow text-center flex items-center justify-center">
            <p className="text-gray-600">Settings section is under development.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
