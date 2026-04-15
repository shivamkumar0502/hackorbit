import { useSelector, useDispatch } from "react-redux";
import { Trophy, Flame, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays } from "date-fns";
import { changePassword, uploadProfileImage } from "../authSlice";

function Profile() {

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 🖼️ Image Upload
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get("/user/profile");
        setProfileData(response.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // 🔐 Handle Password Change
  const handleChangePassword = () => {
    dispatch(changePassword({ oldPassword, newPassword }));
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
  };

  // 🖼️ Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    dispatch(uploadProfileImage(formData));
  };

  const heatmapData = profileData?.activity
    ? Object.entries(profileData.activity).map(([date, count]) => ({
        date,
        count
      }))
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f1115] text-white">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-8">

      {/* 🔐 PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#1a1d23] p-6 rounded-xl w-80">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>

            <input
              type="password"
              placeholder="Old Password"
              className="input input-bordered w-full mb-3"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              className="input input-bordered w-full mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sm"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleChangePassword}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6">

        {/* LEFT PROFILE CARD */}
        <div className="col-span-1 bg-[#1a1d23] rounded-xl p-6">

          <div className="flex flex-col items-center">

           <div className="relative">
  {(preview || user?.profileImage) ? (
    <img
      src={
        preview ||
        `http://localhost:5000${user.profileImage}`
      }
      alt="profile"
      className="w-24 h-24 rounded-full object-cover bg-[#2a2f3a]"
    />
  ) : (
    <div className="w-24 h-24 rounded-full bg-[#2a2f3a] flex items-center justify-center text-xl">
      {user?.name?.charAt(0)}
    </div>
  )}

  <input
    type="file"
    className="absolute inset-0 opacity-0 cursor-pointer"
    onChange={handleImageUpload}
  />
</div>

            {/* NAME */}
            <h2 className="text-xl font-semibold mt-4">
              {user?.name}
            </h2>

            {/* EMAIL */}
            <p className="text-gray-400 text-sm">
              {user?.email}
            </p>

            {/* CHANGE PASSWORD */}
            <button
              className="btn btn-outline btn-sm mt-4"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>

          </div>

          {/* Problem progress */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">
              Problem Solving Progress
            </h3>

            <div className="space-y-3">

              <div>
                <span className="text-green-400">Easy</span>
                <progress
                  className="progress progress-success w-full"
                  value={profileData?.easySolved || 0}
                  max="108"
                />
              </div>

              <div>
                <span className="text-yellow-400">Medium</span>
                <progress
                  className="progress progress-warning w-full"
                  value={profileData?.mediumSolved || 0}
                  max="184"
                />
              </div>

              <div>
                <span className="text-red-400">Hard</span>
                <progress
                  className="progress progress-error w-full"
                  value={profileData?.hardSolved || 0}
                  max="35"
                />
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-3 space-y-6">

          {/* PERFORMANCE OVERVIEW */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Performance Overview
            </h2>

            <div className="grid grid-cols-3 gap-4">

              <div className="bg-[#1a1d23] p-5 rounded-xl flex items-center gap-3">
                <Trophy />
                <div>
                  <p className="text-2xl font-bold">
                    {profileData?.totalSolved || 0}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Total Solved
                  </p>
                </div>
              </div>

              <div className="bg-[#1a1d23] p-5 rounded-xl flex items-center gap-3">
                <Flame />
                <div>
                  <p className="text-2xl font-bold">
                    {profileData?.currentStreak || 0}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Current Streak
                  </p>
                </div>
              </div>

              <div className="bg-[#1a1d23] p-5 rounded-xl flex items-center gap-3">
                <Activity />
                <div>
                  <p className="text-2xl font-bold">
                    {profileData?.maxStreak || 0}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Max Streak
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* HEATMAP */}
          <div className="bg-[#1a1d23] rounded-xl p-6">
            <h3 className="mb-4 font-semibold">
              Submissions Activity
            </h3>

            <CalendarHeatmap
              startDate={subDays(new Date(), 365)}
              endDate={new Date()}
              values={heatmapData}
              classForValue={(value) => {
                if (!value) return "color-empty";
                if (value.count >= 4) return "color-github-4";
                if (value.count >= 3) return "color-github-3";
                if (value.count >= 2) return "color-github-2";
                if (value.count >= 1) return "color-github-1";
                return "color-empty";
              }}
            />
          </div>

          {/* RECENT SUBMISSIONS */}
          <div className="bg-[#1a1d23] rounded-xl p-6">
            <h3 className="mb-4 font-semibold">
              Recent Submissions
            </h3>

            <table className="table w-full">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Status</th>
                  <th>Language</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {profileData?.recentSubmissions?.map((s, i) => (
                  <tr key={i}>
                    <td>{s.problem}</td>
                    <td className={
                      s.status === "accepted"
                        ? "text-green-400"
                        : "text-red-400"
                    }>
                      {s.status}
                    </td>
                    <td>{s.language}</td>
                    <td>{new Date(s.time).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;

