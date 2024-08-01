import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

/**
 * @description Displays a modal window containing user profile information when
 * triggered by a child component or an icon button. The modal shows the user's name,
 * email, and avatar image with a close button for dismissal.
 * 
 * @param {object} obj - Required. The first property "user" represents user data,
 * and the second property "children" allows for rendering children components or
 * text within the modal.
 * 
 * @param {object} obj.user - Used to retrieve user data.
 * 
 * @param {string | JSX.Element} obj.children - Optional, used to render a custom
 * header or content.
 */
const ProfileModals = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader>Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.avatar}
              alt={user?.name}
            />
            <Text fontSize="xl" fontWeight="bold" mt="4">
              {user?.name}
            </Text>
            <Text color="gray.500">{user?.email}</Text>
          </ModalBody>

input:
**useDisclosure:** `onClose` callback now receives the event object

code:
import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModals = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader>Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.avatar}
              alt={user?.name}
            />
            <Text fontSize="xl" fontWeight="bold" mt="4">
              {user?.name}
            </Text>
            <Text color="gray.500">{user?.email}</Text>
          </ModalBody>

output:
import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModals = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={(e) => onClose(e)} isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader>Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.avatar}
              alt={user?.name}
            />
            <Text fontSize="xl" fontWeight="bold" mt="4">
              {user?.name}
            </Text>
            <Text color="gray.500">{user?.email}</Text>
          </ModalBody>
          <ModalHeader
            fontSize="40px"
            fontFamily="monospace"
            d="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="monospace"
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModals;
