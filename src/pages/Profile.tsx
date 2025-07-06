import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileSettings from "@/components/ProfileSettings";
import BlueskyConnect from "@/components/BlueskyConnect";
import AccountSettings from "@/components/AccountSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'bluesky', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <SEO 
        title={`${profile?.display_name || 'User'} Profile - Authentic Moments`}
        description={`View and edit your Authentic Moments profile. ${profile?.bio || 'Connect with Bluesky and manage your account settings.'}`}
      />
       <div className="min-h-screen">
         <Navigation />
         <div className="pt-16">
           <div className="container mx-auto px-4 py-8">
             <div className="max-w-4xl mx-auto">
               <ProfileHeader profile={profile} />
               
               <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
                 <TabsList className="grid w-full grid-cols-3">
                   <TabsTrigger value="profile">Profile</TabsTrigger>
                   <TabsTrigger value="bluesky">Bluesky</TabsTrigger>
                   <TabsTrigger value="settings">Settings</TabsTrigger>
                 </TabsList>
                 
                 <TabsContent value="profile" className="mt-6">
                   <Card className="p-6">
                     <ProfileSettings 
                       profile={profile} 
                       onUpdate={updateProfile} 
                     />
                   </Card>
                 </TabsContent>
                 
                 <TabsContent value="bluesky" className="mt-6">
                   <Card className="p-6">
                     <BlueskyConnect profile={profile} onUpdate={updateProfile} />
                   </Card>
                 </TabsContent>
                 
                 <TabsContent value="settings" className="mt-6">
                   <AccountSettings />
                 </TabsContent>
               </Tabs>
             </div>
           </div>
         </div>
       </div>
    </>
  );
};

export default Profile;