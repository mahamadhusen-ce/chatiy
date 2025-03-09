import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactList from "@/components/common/contact-list";
import Logo from "@/components/common/logo";
import ProfileInfo from "./components/profile-info";
import apiClient from "@/lib/api-client";
import {
  GET_CONTACTS_WITH_MESSAGES_ROUTE,
  GET_USER_CHANNELS,
} from "@/lib/constants";
import { useAppStore } from "@/store";
import NewDM from "./components/new-dm/new-dm";
import CreateChannel from "./components/create-channel/create-channel";

const ContactsContainer = () => {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [contactsResponse, channelsResponse] = await Promise.all([
          apiClient.get(GET_CONTACTS_WITH_MESSAGES_ROUTE, { withCredentials: true }),
          apiClient.get(GET_USER_CHANNELS, { withCredentials: true }),
        ]);

        if (contactsResponse.data.contacts) {
          setDirectMessagesContacts(contactsResponse.data.contacts);
        }
        if (channelsResponse.data.channels) {
          setChannels(channelsResponse.data.channels);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setDirectMessagesContacts, setChannels]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full h-screen flex flex-col"
    >
      <div className="pt-3 px-5">
        <Logo />
      </div>
      <div className="flex-grow overflow-y-auto scrollbar-hidden">
        <AnimatePresence>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Section title="Direct Messages" items={directMessagesContacts}>
                <NewDM />
              </Section>
              <Section title="Channels" items={channels} isChannel>
                <CreateChannel />
              </Section>
            </>
          )}
        </AnimatePresence>
      </div>
      <ProfileInfo />
    </motion.div>
  );
};

const Section = ({ title, items, children, isChannel = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="my-5"
  >
    <div className="flex items-center justify-between px-5 mb-3">
      <Title text={title} />
      {children}
    </div>
    <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
      <ContactList contacts={items} isChannel={isChannel} />
    </div>
  </motion.div>
);

const Title = ({ text }) => (
  <h6 className="uppercase tracking-widest text-neutral-400 font-light text-opacity-90 text-sm">
    {text}
  </h6>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-400"></div>
  </div>
);

export default ContactsContainer;