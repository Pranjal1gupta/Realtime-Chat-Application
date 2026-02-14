import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-2xl p-8 shadow-2xl space-y-8 backdrop-blur-lg border border-base-content/5">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-base-content/60">Manage your account settings and preferences</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="relative size-36 rounded-full object-cover border-4 border-base-300 shadow-xl"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-2 right-2 
                  bg-primary hover:bg-primary-focus hover:scale-110
                  p-3 rounded-full cursor-pointer 
                  transition-all duration-300 shadow-lg
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-6 h-6 text-primary-content" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">
                {isUpdatingProfile ? "Uploading your new look..." : "Personalize your profile"}
              </p>
              <p className="text-xs text-base-content/40">
                JPG, PNG or GIF. Max 10MB
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/70 flex items-center gap-2 ml-1">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <div className="px-4 py-3 bg-base-200 rounded-xl border border-base-content/10 font-medium shadow-sm transition-colors hover:border-primary/30">
                {authUser?.fullName}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/70 flex items-center gap-2 ml-1">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="px-4 py-3 bg-base-200 rounded-xl border border-base-content/10 font-medium shadow-sm transition-colors hover:border-primary/30">
                {authUser?.email}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="bg-base-200/50 rounded-2xl p-6 border border-base-content/5">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                Account Information
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between py-3 border-b border-base-content/10">
                  <span className="text-base-content/60">Member Since</span>
                  <span className="font-mono bg-base-300 px-2 py-1 rounded">{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-base-content/60">Account Status</span>
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-success rounded-full animate-pulse"></span>
                    <span className="text-success font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
