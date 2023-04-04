import { Flex, Heading } from "@chakra-ui/layout";
// import { Avatar } from "@chakra-ui/avatar";
import { useRouter } from "next/router";

import ChatSidebar from "../../components/sidebar-chat";
import { Input, Text, Avatar } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control";
import { Button } from "@chakra-ui/button";
import Head from "next/head";
import React, { ReactNode, useEffect, useState, memo, useRef } from "react";
import { useStoreActions, useStoreState } from "../../services/redux/hook";
import ApiServices from "../../services/api";
import { GetMessageOutput, GetRoomInfo } from "../../services/api/types";
import { CONSTANT } from "../../constants/chat-constant";

const Topbar = ({ avatar, username }: { avatar: string; username: string }) => {
  return (
    <Flex bg={"gray.100"} h="81px" w={"100%"} align="center" p={5}>
      <Avatar
        src={userAvatarGetter({ avatar })}
        marginEnd={3}
        // loading="lazy"
        ignoreFallback={true}
      />

      <Heading size={"md"}>{username}</Heading>
    </Flex>
  );
};

const userAvatarGetter = ({ avatar }: { avatar: string }) => {
  const avatarURL = CONSTANT.API_PREFIX + avatar;

  return avatarURL;
};

const detail = () => {
  const inputReference = useRef(null);

  const userStateData = useStoreState((state) => state.chatUser.data);
  const router = useRouter();
  const { id } = router.query;

  const [messageList, setMessageList] = useState<GetMessageOutput[]>();

  const [room, setRoom] = useState<GetRoomInfo>();

  const Bottombar = () => {
    const [input, setInput] = useState("");

    const sendMessage = async (e: React.FormEvent<HTMLDivElement>) => {
      e.preventDefault();
      const newMessage = await ApiServices.privateMessage.sendMessage({
        message_data: input,
        room_id: id,
      });

      if (messageList) {
        setMessageList([newMessage.data.data, ...messageList]);
      }
      setInput("");
    };

    return (
      <FormControl px={3} pb={3} onSubmit={sendMessage} as="form">
        <Input
          id="message-text"
          placeholder="Type a message..."
          autoComplete="off"
          onChange={(e) => setInput(e.target.value)}
          ref={inputReference}
        />
        <Button type="submit" hidden>
          Send
        </Button>
      </FormControl>
    );
  };

  const MessageFromOther = ({ message }: { message: string }) => {
    const color = "green.100";

    return (
      <Flex
        bg={color}
        minWidth={"100px"}
        borderRadius="lg"
        w="fit-content"
        p={3}
        m={1}
      >
        <Text>{message}</Text>
      </Flex>
    );
  };
  const MessageFromUser = ({ message }: { message: string }) => {
    const color = "blue.100";
    const align = "flex-end";

    return (
      <Flex
        bg={color}
        minWidth={"100px"}
        borderRadius="lg"
        w="fit-content"
        p={3}
        m={1}
        alignSelf={align}
      >
        <Text>{message}</Text>
      </Flex>
    );
  };

  const getRoom = async () => {
    try {
      if (id) {
        const room = await ApiServices.roomChat.getRoomInfo(id.toString());

        setRoom(room.data.data);
      }
    } catch (error) {}
  };

  const getMessage = async () => {
    try {
      if (id) {
        const message = await ApiServices.privateMessage.getMessage(
          id.toString(),
          0
        );
        setMessageList(message.data.data.messages);
      }
    } catch (error) {}
  };

  const GetMessageOfRoom = () => {
    if (userStateData && messageList) {
      return (
        <>
          {messageList
            .slice(0)
            .reverse()
            .map((message) => {
              if (
                message.sender_user.wallet_address ==
                userStateData.wallet_address
              ) {
                return (
                  <MessageFromUser
                    key={Math.random()}
                    message={message.message_data}
                  />
                );
              }
              return (
                <MessageFromOther
                  key={Math.random()}
                  message={message.message_data}
                />
              );
            })}
          <div id="bottom"></div>
        </>
      );
    }

    return <></>;
  };

  useEffect(() => {
    getMessage();
    getRoom();
  }, [id]);

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("message-text")?.focus();

      document.getElementById("bottom")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 1000);
  }, [messageList]);

  return (
    <Flex h="100vh">
      <Head>
        <title>Decentralized Chat</title>
        <meta
          name="description"
          content="Communicating with your own Web3 Account"
        />
        <link
          rel="icon"
          href="https://cdn.iconscout.com/icon/free/png-512/chat-1438147-1213937.png?f=avif&w=256"
        />
      </Head>
      <ChatSidebar />
      <Flex flex={1} direction="column">
        <Topbar
          key={id?.toString()}
          avatar={room?.avatar || ""}
          username={room?.name || "Chat user"}
        />
        {}

        <Flex
          flex={1}
          direction="column"
          // pt={0}
          pb={0}
          mx={5}
          // mb={0}
          overflowX="scroll"
          sx={{
            "&::-webkit-scrollbar": {
              width: "1px",
            },
          }}
        >
          <GetMessageOfRoom />
        </Flex>
        <Bottombar />
      </Flex>
    </Flex>
  );
};
export default detail;
