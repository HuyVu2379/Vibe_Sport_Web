"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { storage } from "@/data/storage";
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  Calendar,
  MapPin,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateProfile } from "@/data/hooks/useUsers";
import { AVATAR_FOLDER } from "@/lib/constants";
import { useUploadImage } from "@/data/hooks/useUpload";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const user = storage.getUser();
export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { updateProfile } = useUpdateProfile()
  const { uploadImage } = useUploadImage()
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName,
      phoneNumber: user?.phone,
      avatarUrl: user?.avatarUrl,
    },
  });

  const isDirty = Object.keys(profileForm.formState.dirtyFields).length > 0;

  // Watch the image value for immediate preview
  const avatarUrlPreview = profileForm.watch("avatarUrl") || user?.avatarUrl;

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    // call updateProfile
    await updateProfile(data);
    setIsSaving(false);
    setSaveSuccess(true);
    profileForm.reset(data);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Password data:", data);
    setIsSaving(false);
    passwordForm.reset();
    alert("Password updated successfully!");
  };

  const onChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    const uploadResult = await uploadImage(file, AVATAR_FOLDER);
    setIsUploadingAvatar(false);
    if (uploadResult) {
      profileForm.setValue("avatarUrl", uploadResult.secureUrl, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });
    }
  }
  const stats = [
    { label: "Total Bookings", value: "24", icon: Calendar },
    { label: "Favorite Venues", value: "5", icon: MapPin },
    { label: "Member Since", value: "Jun 2025", icon: User },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar isAuthenticated userName={user?.fullName} />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">
              My <span className="text-primary">Profile</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <GlassCard key={stat.label} variant="elevated" className="p-4 text-center">
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </GlassCard>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile">
            <TabsList className="w-full glass mb-6">
              <TabsTrigger value="profile" className="flex-1">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-1">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex-1">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <GlassCard variant="elevated" className="p-6">
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className={cn(
                      "h-20 w-20 border-2",
                      isUploadingAvatar ? "border-primary border-t-transparent animate-spin" : "border-border"
                    )}>
                      {isUploadingAvatar ? (
                        <AvatarFallback className="bg-secondary flex items-center justify-center">
                          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src={avatarUrlPreview} alt="Avatar" className="object-cover" />
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            <User className="h-10 w-10" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div>
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/gif"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={onChangeAvatar}
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploadingAvatar}
                      >
                        {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        {...profileForm.register("fullName")}
                        className="pl-10 bg-input"
                      />
                    </div>
                    {profileForm.formState.errors.fullName && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        disabled
                        value={user?.email}
                        className="pl-10 bg-input"
                      />
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        {...profileForm.register("phoneNumber")}
                        className="pl-10 bg-input"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex items-center gap-4">
                    <Button
                      type="submit"
                      disabled={isSaving || (!isDirty && !saveSuccess)}
                      className={cn(saveSuccess && "bg-status-confirmed")}
                    >
                      {isSaving ? (
                        <>
                          <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : saveSuccess ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Saved!
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </GlassCard>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <GlassCard variant="elevated" className="p-6">
                <h2 className="text-lg font-semibold mb-6">Change Password</h2>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type="password"
                        {...passwordForm.register("currentPassword")}
                        className="pl-10 bg-input"
                      />
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type="password"
                        {...passwordForm.register("newPassword")}
                        className="pl-10 bg-input"
                      />
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...passwordForm.register("confirmPassword")}
                        className="pl-10 bg-input"
                      />
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    Update Password
                  </Button>
                </form>
              </GlassCard>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <GlassCard variant="elevated" className="p-6">
                <h2 className="text-lg font-semibold mb-6">
                  Notification Preferences
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      id: "booking",
                      label: "Booking Confirmations",
                      description: "Get notified when your booking is confirmed",
                    },
                    {
                      id: "reminder",
                      label: "Booking Reminders",
                      description: "Receive reminders before your scheduled booking",
                    },
                    {
                      id: "hold",
                      label: "Hold Expiry Alerts",
                      description: "Get alerted when your hold is about to expire",
                    },
                    {
                      id: "promotions",
                      label: "Promotions & Updates",
                      description: "Stay updated with special offers and venue news",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                    >
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked={item.id !== "promotions"}
                        />
                        <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/50 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </main>
  );
}
