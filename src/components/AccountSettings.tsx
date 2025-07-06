import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Shield, Bell, Eye, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // In a real app, this would be handled by an admin function
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    });
  };

  const handleDataDownload = async () => {
    try {
      // Fetch user's moments data
      const { data: moments, error } = await supabase
        .from('moments')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      // Create downloadable JSON
      const userData = {
        profile: user,
        moments: moments,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `authentic-moments-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Downloaded",
        description: "Your data has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download your data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            <div>
              <Label>Account Created</Label>
              <Input value={new Date(user?.created_at || '').toLocaleDateString()} disabled />
            </div>
          </div>
          <Button onClick={handlePasswordReset} disabled={loading} variant="outline">
            {loading ? 'Sending...' : 'Reset Password'}
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control who can see your profile and content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Profile</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to find and view your profile
              </p>
            </div>
            <Switch 
              checked={publicProfile} 
              onCheckedChange={setPublicProfile}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about interactions with your moments
              </p>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Download or delete your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleDataDownload} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Your Data
          </Button>
          
          <Separator />
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardContent className="pt-6">
          <Button onClick={signOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;