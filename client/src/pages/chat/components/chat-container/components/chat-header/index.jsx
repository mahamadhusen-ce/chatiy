import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST } from "@/lib/constants";
import { getColor } from "@/lib/utils";

const ChatHeader = () => {
  const { selectedChatData, closeChat, selectedChatType } = useAppStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4  dark:bg-gray-900"
    >
      <motion.div 
        className="flex items-center space-x-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {selectedChatType === "contact" ? (
          <Avatar className="h-10 w-10">
            {selectedChatData.image ? (
              <AvatarImage
                src={`${HOST}/${selectedChatData.image}`}
                alt="profile"
                className="object-cover"
              />
            ) : (
              <div
                className={`uppercase h-full w-full text-sm ${getColor(
                  selectedChatData.color
                )} flex items-center justify-center rounded-full`}
              >
                {selectedChatData.firstName
                  ? selectedChatData.firstName.charAt(0)
                  : selectedChatData.email.charAt(0)}
              </div>
            )}
          </Avatar>
        ) : (
          <div
            className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300"
          >
            #
          </div>
        )}
        <div className="font-medium">
          {selectedChatType === "channel" && selectedChatData.name}
          {selectedChatType === "contact" &&
            (selectedChatData.firstName && selectedChatData.lastName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email)}
        </div>
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
        onClick={closeChat}
      >
        <X className="h-6 w-6" />
      </motion.button>
    </motion.div>
  );
};

export default ChatHeader;