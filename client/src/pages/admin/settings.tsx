import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { 
  Settings as SettingsIcon,
  Mail,
  Globe,
  Shield,
  Database,
  Bell,
  Save
} from "lucide-react";

export function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "Immigration Helper",
    siteDescription: "Professional immigration assistance and guides",
    contactEmail: "admin@example.com",
    supportEmail: "support@example.com",
    enableRegistration: true,
    enableNotifications: true,
    maintenanceMode: false,
    stripePublicKey: "",
    stripeSecretKey: "",
    perplexityApiKey: "",
    databaseUrl: "",
    emailNotifications: true,
    smsNotifications: false
  });

  const handleSave = () => {
    // Save settings logic here
    console.log("Saving settings:", settings);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Contact Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* User Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>User Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableRegistration"
                checked={settings.enableRegistration}
                onCheckedChange={(checked) => setSettings({...settings, enableRegistration: checked})}
              />
              <Label htmlFor="enableRegistration">Enable User Registration</Label>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
              <Label htmlFor="emailNotifications">Email Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
              />
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>API Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                <Input
                  id="stripePublicKey"
                  type="password"
                  value={settings.stripePublicKey}
                  onChange={(e) => setSettings({...settings, stripePublicKey: e.target.value})}
                  placeholder="pk_test_..."
                />
              </div>
              <div>
                <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                <Input
                  id="stripeSecretKey"
                  type="password"
                  value={settings.stripeSecretKey}
                  onChange={(e) => setSettings({...settings, stripeSecretKey: e.target.value})}
                  placeholder="sk_test_..."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="perplexityApiKey">Perplexity API Key</Label>
              <Input
                id="perplexityApiKey"
                type="password"
                value={settings.perplexityApiKey}
                onChange={(e) => setSettings({...settings, perplexityApiKey: e.target.value})}
                placeholder="pplx-..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Database Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="databaseUrl">Database URL</Label>
              <Input
                id="databaseUrl"
                type="password"
                value={settings.databaseUrl}
                onChange={(e) => setSettings({...settings, databaseUrl: e.target.value})}
                placeholder="postgresql://..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to use in-memory storage for development
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}