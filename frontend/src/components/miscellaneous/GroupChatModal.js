import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useChatState } from "../../context/chatProvider";
import React, { useState } from "react";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

/**
 * @description Creates a modal for creating a new group chat. It allows users to
 * input a chat name, search for and add users, display selected users, and create
 * the group when ready. The modal also displays a loading message while processing
 * user data.
 * 
 * @param {object} obj - Required for rendering the modal component. It is expected
 * to contain any JSX elements that will be displayed inside the modal, which can
 * include text, images, or other components.
 * 
 * @param {ReactNode} obj.children - Used to pass JSX content to render within the modal.
 * 
 * @returns {JSX.Element} A React component that represents a modal window with various
 * elements such as input fields, buttons and other widgets.
 */
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = useChatState();

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAdd(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateGroup}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;

  /**
   * @description Performs a GET request to an API endpoint with a search query parameter.
   * It sets the loading state and then updates the search result based on the response
   * data. If an error occurs, it displays an error toast notification.
   * 
   * @param {string} query - Used to search for user data.
   */
  const handleSearch = async (query) => {
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured !",
        description: "Failed to load search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  /**
   * @description Creates a new chat group by sending a POST request to the `/api/chat/group`
   * endpoint with the provided group name and selected users. If any validation errors
   * occur, it displays an error toast notification; otherwise, it updates the chats
   * list and displays a success toast notification.
   * 
   * @returns {any} Either an array of objects (`setChats([data, ...chats])`) or a toast
   * notification with error message (`toast({...})`).
   */
  const handleSubmit = async () => {
    if (!groupName || !selectedUsers) {
     toast({
        title: "Please Fill All The Details !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        /**
         * @description Verifies whether a given value meets certain criteria before allowing
         * it to proceed. It checks if the value's name is not empty and if its users array
         * has at least one element, throwing an error if either condition is not met.
         * 
         * @param {object} value - Used for validation.
         */
        validator: (value) => {
          if (value.name === "") {
            throw new Error("Group name is required");
          }
          if (value.users.length === 0) {
            throw new Error("Please select at least one user");
          }
        },
        /**
         * @description Takes a value as input, returns a new object with all properties from
         * the input value, and modifies the `users` property to contain only the `_id`s of
         * the users in the original array.
         * 
         * @param {object} value - Processed to modify its contents.
         * 
         * @returns {object} An extended version of its input. This returned object has the
         * same properties as its input except for the 'users' property which contains an
         * array of IDs instead of user objects.
         */
        transformer: (value) => {
          return {
            ...value,
            users: value.users.map((u) => u._id),
          };
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Created Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error occured while creating group! Please Try Again.",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  /**
   * @description Checks if a user is already included in an array of selected users.
   * If not, it adds the user to the array and triggers a toast notification.
   * 
   * @param {string} userToAdd - Intended to be a user ID to add.
   */
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User Already Added !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  /**
   * @description Filters out a user from the `selectedUsers` array based on their
   * unique identifier `_id`. It updates the `selectedUsers` state by removing the
   * specified user from the list when called with a user object as an argument.
   * 
   * @param {object} delUser - Used to identify user for deletion.
   */
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" display="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Group Name"
                mb={3}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Jane etc."
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex" w="100%" flexWrap="wrap" colorScheme="purple">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
