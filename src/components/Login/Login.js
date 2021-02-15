import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { MainContext } from "../../mainContext";
import { SocketContext } from "../../socketContext";
import {
  Flex,
  Heading,
  IconButton,
  Input,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { RiArrowRightLine } from "react-icons/ri";
import { useToast } from "@chakra-ui/react";
import { UsersContext } from "../../usersContext";

const Login = () => {
  const socket = useContext(SocketContext);
  const {
    name,
    setName,
    room,
    setRoom,
    isMod,
    setIsMod,
    modCode,
    setModCode,
  } = useContext(MainContext);
  const history = useHistory();
  const toast = useToast();
  const { setUsers } = useContext(UsersContext);

  //Checks to see if there's a user already present

  useEffect(() => {
    socket.on("users", (users) => {
      setUsers(users);
    });
  });

  function createRoomId(length) {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  //Emits the login event and if successful redirects to chat and saves user data
  const handleClick = () => {
    let roomId = createRoomId(1);
    setRoom(() => roomId);
    setIsMod(() => true);
    console.log(modCode);
    //alert(roomId);
    socket.emit("login", { name, roomId, modCode }, (error) => {
      if (error) {
        console.log(error);
        return toast({
          position: "top",
          title: "Error",
          description: error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      history.push("/chat");
      return toast({
        position: "top",
        title: "Hey there",
        description: `Welcome to ${room}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    });
  };

  const handleClickJoin = () => {
    //let roomId = createRoomId(1);
    //setRoom(() => roomId);;
    socket.emit("goto", { name, room, modCode }, (arg, error) => {
      if (error) {
        console.log(error);
        return toast({
          position: "top",
          title: "Error",
          description: error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      //console.log("MODCODE----", arg );
      setIsMod(() => arg);
      history.push("/chat");
      return toast({
        position: "top",
        title: "Hey there",
        description: `Welcome to ${room}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    });
  };

  return (
    <Flex className="login" flexDirection="column" mb="8">
      <Heading
        as="h1"
        size="4xl"
        textAlign="center"
        mb="8"
        fontFamily="DM Sans"
        fontWeight="600"
        letterSpacing="-2px"        
      >
        Typepad.xyz
      </Heading>

      <Flex
        className="form"
        gap="1rem"
        flexDirection={{ base: "column", md: "column" }}
        padding="20px"
      >
        {" "}
        <Button colorScheme="blue" size="lg" onClick={handleClickJoin}>
          Join
        </Button>
        <div>
          <Input
            variant="filled"
            mt={{ base: "4", md: "4" }}
            type="text"
            placeholder="User Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            variant="filled"
            mt={{ base: "4", md: "4" }}
            type="text"
            placeholder="Room Name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <Input
            variant="filled"
            mt={{ base: "4", md: "4" }}
            type="text"
            placeholder="Mod Code( For Moderators only)"
            value={modCode}
            onChange={(e) => setModCode(e.target.value)}
          />
        </div>
      </Flex>

      <br></br>
      <br></br>
      <br></br>

      <Flex
        className="form"
        gap="1rem"
        flexDirection={{ base: "column", md: "column" }}
        padding="20px"
      >
        <Button colorScheme="blue" size="lg" onClick={handleClick}>
          Create
        </Button>
        <div>
          <Input
            variant="filled"
            mt={{ base: "4", md: "4" }}
            type="text"
            placeholder="User Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            variant="filled"
            mt={{ base: "4", md: "4" }}
            type="text"
            placeholder="Set your Mod Code"
            value={modCode}
            onChange={(e) => setModCode(e.target.value)}
          />
        </div>
      </Flex>
    </Flex>
  );
};

export default Login;
