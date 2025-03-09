import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFLE_ROUTE,
} from "@/lib/constants";
import { useState, useRef, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IoArrowBack } from "react-icons/io5";
import { colors } from "@/lib/utils";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(0);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName.trim()) {
      toast.error("First Name is Required.");
      return false;
    }
    if (!lastName.trim()) {
      toast.error("Last Name is Required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      setIsLoading(true);
      try {
        const response = await apiClient.post(
          UPDATE_PROFLE_ROUTE,
          {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            color: selectedColor,
          },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile Updated Successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to update profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      try {
        const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.image) {
          setUserInfo({ ...userInfo, image: response.data.image });
          toast.success("Image updated successfully.");
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result);
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload image. Please try again.");
      }
    }
  };

  const handleDeleteImage = async () => {
    if (window.confirm("Are you sure you want to delete your profile image?")) {
      try {
        const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUserInfo({ ...userInfo, image: null });
          toast.success("Image Removed Successfully.");
          setImage(undefined);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to remove image. Please try again.");
      }
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile.");
    }
  };

  return (
    <div className="bg-[#1b1c24] min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-[#2c2e3b] rounded-lg shadow-xl p-6 md:p-10">
        <div className="mb-6">
          <IoArrowBack
            className="text-4xl lg:text-5xl text-white text-opacity-90 cursor-pointer hover:text-opacity-100 transition-opacity"
            onClick={handleNavigate}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-40 w-40 md:w-56 md:h-56 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-full w-full text-5xl bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa] flex items-center justify-center rounded-full`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer transition-opacity"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              accept=".png, .jpg, .jpeg, .svg, .webp"
              name="profile-image"
            />
          </div>
          <div className="flex flex-col gap-5 text-white">
            <div className="w-full">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email</label>
              <Input
                id="email"
                placeholder="Email"
                type="email"
                className="rounded-lg p-4 bg-[#3a3c4e] border-none"
                disabled
                value={userInfo.email}
              />
            </div>
            <div className="w-full">
              <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-300">First Name</label>
              <Input
                id="firstName"
                placeholder="First Name"
                type="text"
                className="rounded-lg p-4 bg-[#3a3c4e] border-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-300">Last Name</label>
              <Input
                id="lastName"
                placeholder="Last Name"
                type="text"
                className="rounded-lg p-4 bg-[#3a3c4e] border-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-300">Profile Color</label>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color, index) => (
                  <div
                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-100 ${
                      selectedColor === index
                        ? "outline outline-2 outline-white outline-offset-2"
                        : ""
                    }`}
                    key={index}
                    onClick={() => setSelectedColor(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Button
            className="h-14 w-full bg-purple-700 hover:bg-purple-800 transition-all duration-300 text-lg font-semibold"
            onClick={saveChanges}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;