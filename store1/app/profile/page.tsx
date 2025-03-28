import ProfileSettings from "../components/ProfileUpdateForm";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-tight mt-12">
          Profile Settings
        </h1>
        <ProfileSettings />
      </div>
    </div>
  );
}