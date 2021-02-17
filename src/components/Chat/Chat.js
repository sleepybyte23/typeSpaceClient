import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { MainContext } from "../../mainContext";
import { SocketContext } from "../../socketContext";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  Menu,
  Button,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Icon,
} from "@chakra-ui/react";
import { FiList } from "react-icons/fi";
import { BiMessageDetail } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import ScrollToBottom from "react-scroll-to-bottom";
import { useToast } from "@chakra-ui/react";
import "./Chat.scss";
import { ImTwitter } from "react-icons/im"

import { UsersContext } from "../../usersContext";
//import Jimp from 'jimp';

const Chat = () => {
  const { name, room, setName, setRoom, isMod } = useContext(MainContext);
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { users } = useContext(UsersContext);
  const history = useHistory();
  const toast = useToast();

  window.onpopstate = (e) => logout();
  //Checks to see if there's a user present
  useEffect(() => {
    if (!name) return history.push("/");
  }, [history, name]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((messages) => [...messages, msg]);
    });

    socket.on("notification", (notif) => {
      // toast({
      //   position: "top",
      //   title: notif?.title,
      //   description: notif?.description,
      //   status: "success",
      //   duration: 5000,
      //   isClosable: true,
      // });
      console.log("new user join");
    });
  }, [socket, toast]);

  const handleSendMessage = () => {
    console.log("ddd", isMod);
    socket.emit("sendMessage", message, () => setMessage(""));
    setMessage("");
  };

  const logout = () => {
    setName("");
    setRoom("");
    history.push("/");
    history.go(0);
  };

  return (
    <Flex
      className="room"
      flexDirection="column"
      width={{ base: "100%", sm: "90%" }}
      height={{ base: "100%", sm: "90%" }}
    >
      <Heading
        className="heading"
        as="h4"
        bg="white"
        p="1rem 1rem"
        borderRadius="10px 10px 0 0"
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Menu>
            <MenuButton isRound="true" color="white">
              <Image
                boxSize="3rem"
                borderRadius="full"
                src="https://placekitten.com/100/100"
                alt="Fluffybuns the destroyer"
              />
            </MenuButton>
            <MenuList>
              <MenuItem minH="40px">
                <Text fontSize="sm">Download Image</Text>
              </MenuItem>
              <MenuItem minH="40px">
                <Text fontSize="sm">User Name : {name} </Text>
              </MenuItem>
              <MenuItem minH="40px">
                <Text fontSize="sm">Total Users : {users.length}</Text>
              </MenuItem>
            </MenuList>
          </Menu>
          <Flex
            alignItems="center"
            flexDirection="column"
            flex={{ base: "1", sm: "auto" }}
          >
            <Heading as="h4" size="md">
              {" "}
              Room ID : {room.slice(0, 1).toUpperCase() + room.slice(1)}YASH
              <Icon as={ImTwitter} />
              
            </Heading>
          </Flex>
          <Button color="gray.500" fontSize="sm" width="55px" onClick={logout}>
            Logout
          </Button>
        </Flex>
      </Heading>

      <ScrollToBottom className="messages" debug={false}>
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <Box
              key={i}
              className={`message ${msg.user === name ? "my-message" : ""}`}
              m=".2rem 0"
            >
              <Text fontSize="xs" opacity=".7" ml="5px" className="user">
                {msg.user}
              </Text>
              <Text
                fontSize="sm"
                className="msg"
                p=".4rem .8rem"
                bg="white"
                borderRadius="15px"
                color="white"
              >
                {msg.text}
              </Text>
            </Box>
          ))
        ) : (
          <Flex
            alignItems="center"
            justifyContent="center"
            mt=".5rem"
            bg="#EAEAEA"
            opacity=".2"
            w="100%"
          >
            <Box mr="2">-----</Box>
            <BiMessageDetail fontSize="1rem" />
            <Text ml="1" fontWeight="400">
              No messages
            </Text>
            <Box ml="2">-----</Box>
          </Flex>
        )}
      </ScrollToBottom>
      {isMod ? (
        <div className="form">
          <input
            type="text"
            placeholder="Enter Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            colorScheme="green"
            isRound="true"
            icon={<RiSendPlaneFill />}
            onClick={handleSendMessage}
            disabled={message === "" ? true : false}
          >
            Send
          </IconButton>
        </div>
      ) : (
        ""
      )}
    </Flex>
  );
};

export default Chat;
