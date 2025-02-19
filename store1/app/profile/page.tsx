import ProfileUpdateForm from "../components/ProfileUpdateForm";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10 mt-8">
      <h1 className="text-3xl font-bold mb-6 mt-8">Profile Settings</h1>
      <ProfileUpdateForm />
    </div>
  )
}

