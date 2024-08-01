import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useHistory } from "react-router-dom";

/**
 * @description Handles user sign-up by collecting and validating name, email, password,
 * confirm password, and picture. It then posts the data to an API for user creation
 * and displays success or error messages accordingly.
 * 
 * @returns {JSX.Element} A React component that renders a stack of form controls and
 * buttons for user signup, including input fields, password visibility toggles, file
 * upload, and submit button.
 */
const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [pshow, setPShow] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState();
  const [cshow, setCShow] = useState(false);
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handlePShow = () => setPShow(!pshow);
  const handleCShow = () => setCShow(!cshow);

  /**
   * @description Uploads an image to Cloudinary and sets it as a post detail if it is
   * a valid JPEG or PNG file. If not, it displays an error message. The function also
   * handles loading states by setting the `loading` state true before uploading and
   * false after completion or failure.
   * 
   * @param {object} pics - Expected to represent an image file.
   */
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an Image !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "babble");
      fetch("https://api.cloudinary.com/v1_1/babble/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // Sets URL and disables loading upon data reception.

          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          // Catches and logs errors, then sets loading state to false.

          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an Image !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };
  /**
   * @description Handles user sign-up by validating input data, making a POST request
   * to the `/api/user` endpoint, and storing the response in local storage if successful;
   * otherwise, it displays error messages and sets loading state accordingly.
   * 
   * @returns {any} Undefined when it encounters an error and a success message when
   * the sign-up operation is successful.
   */
  const handleSignUp = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all the Datails !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password and Confirm Password does not Match !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      toast({
        title: "User Created Successfully !",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured !",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
        /**
         * @description Checks whether a given `value` has a length greater than zero, returning
         * a boolean result indicating whether the condition is met or not. It effectively
         * validates whether a string is non-empty.
         * 
         * @param {string | number} value - Being validated for non-empty length.
         * 
         * @returns {boolean} True if the length of the input value is greater than zero and
         * false otherwise.
         */
        validator: (value) => {
          return value.length > 0;
        },
        /**
         * @description Converts a given `value` to lowercase. It takes an input, applies the
         * operation to change it into lowercase, and returns the resulting string in lowercase
         * format.
         * 
         * @param {string | number} value - Intended for conversion to lowercase.
         * 
         * @returns {string} Converted to lowercase.
         */
        transformer: (value) => {
          return value.toLowerCase();
        },
      });
      setLoading(false);
    }
  };

  const show = <FontAwesomeIcon icon={faEye} />;
  const hide = <FontAwesomeIcon icon={faEyeSlash} />;

  return (
    <VStack>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={pshow ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem" onClick={handlePShow}>
            <div className="icons" onClick={handlePShow}>
              {pshow ? hide : show}
            </div>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={cshow ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <div className="icons" onClick={handleCShow}>
              {cshow ? hide : show}
            </div>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="picture">
        <FormLabel>Input Your Image</FormLabel>
        <Input
          type="file"
          accept="image/*"
          p={1.5}
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="twitter"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleSignUp}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
