import { Box, Image, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaPlay } from "react-icons/fa";
import { TiMediaPause } from "react-icons/ti";
import { ipfsToGateway } from "../constants/utils";
import { GetMarketOutput } from "../services/api/types";
import { useStoreActions, useStoreState } from "../services/redux/hook";
import { useBuyMusic } from "../hooks/music";
import { useAddress } from "@thirdweb-dev/react";

const SongNFTComponent = (props: GetMarketOutput) => {
  const { image, name, singer, price, id, audio, ...rest } = props;
  const playMusicAction = useStoreActions((state) => state.music.playMusic);
  const getUserData = useStoreActions((state) => state.user.getData);
  const address = useAddress();
  const addToPlayListAction = useStoreActions(
    (state) => state.music.addToPlayList
  );
  const currentSongState = useStoreState((state) => state.music.currentSong);
  const isPlayingState = useStoreState((state) => state.music.isPlaying);
  const userInfoData = useStoreState((state) => state.user.data);
  const isOwnNft = userInfoData?.ids?.includes(id);
  const isSeller = `${address}`.toLowerCase() == rest?.seller?.toLowerCase();
  const isSoldOut = parseInt(rest.left) == 0;
  const onPlayMusic = () => {
    playMusicAction({
      audio: ipfsToGateway(audio),
      name,
      singer,
      image: ipfsToGateway(image),
      id,
      price,
      ...rest,
    });
  };

  const router = useRouter();

  const goToMusic = () => {
    router.push(
      {
        pathname: `/music/${id}`,
      },
      undefined,
      { shallow: true }
    );
  };

  const { onBuy } = useBuyMusic();

  return (
    <Box
      w={["full"]}
      boxShadow="lg"
      borderRadius="lg"
      shadow="2xl"
      overflow="hidden"
      style={{
        boxShadow: "5px 5px 5px 5px rgba(0,0,0,0.15)",
      }}
    >
      <Image
        _hover={{
          transform: "scale(1.2)",
        }}
        transition="all 0.3s ease-in-out"
        w={["full"]}
        h={["200px"]}
        fit="cover"
        cursor="pointer"
        onClick={goToMusic}
        src={ipfsToGateway(image)}
      />
      <Box
        backgroundImage={`url(${ipfsToGateway(image)})`}
        backgroundSize="cover"
        backgroundColor="transparent"
      >
        <Stack
          p="3"
          zIndex="0"
          bgGradient="linear(rgba(0,0,0,0.6), transparent)"
          backdropFilter="auto"
          backdropBlur="1rem"
        >
          <Stack justifyContent="space-between" direction="row">
            <Stack>
              <Text
                cursor="pointer"
                onClick={goToMusic}
                fontWeight="bold"
                textOverflow="ellipsis"
                noOfLines={1}
                color="white"
              >
                {name}
              </Text>
              <Text
                fontWeight="bold"
                textOverflow="ellipsis"
                noOfLines={1}
                fontSize="sm"
                color="white"
              >
                {singer}
              </Text>
            </Stack>
            <Text
              fontSize="md"
              alignSelf="center"
              fontWeight="bold"
              color="white"
            >
              {price} MUC
            </Text>
          </Stack>
          <Stack
            alignItems="center"
            justifyContent="space-between"
            direction="row"
          >
            {(() => {
              if (isSeller) {
                return (
                  <Text
                    cursor="pointer"
                    fontWeight="bold"
                    color="white"
                    borderRadius="3xl"
                    backgroundColor="#fc8f00"
                    p="1"
                    px="2"
                    fontSize="sm"
                    borderWidth="2px"
                    letterSpacing="widest"
                  >
                    {parseInt(rest.amount) - parseInt(rest.left)}/{rest.amount}{" "}
                    sold
                  </Text>
                );
              }

              if (isOwnNft)
                return (
                  <Text
                    onClick={() => {
                      addToPlayListAction(props);
                      if (!isPlayingState) playMusicAction(props);
                    }}
                    cursor="pointer"
                    fontWeight="bold"
                    color="white"
                    borderRadius="3xl"
                    backgroundColor="#fcae00"
                    p="1"
                    px="2"
                    fontSize="sm"
                    borderWidth="2px"
                    letterSpacing="widest"
                  >
                    Add to next play
                  </Text>
                );
              if (isSoldOut)
                return (
                  <Text
                    fontWeight="bold"
                    color="white"
                    borderRadius="3xl"
                    backgroundColor="#ff5117"
                    p="1"
                    px="2"
                    fontSize="sm"
                    borderWidth="2px"
                    letterSpacing="widest"
                  >
                    Sold out
                  </Text>
                );
              return (
                <Text
                  onClick={async () => {
                    await onBuy(price, id);
                    setTimeout(() => {
                      if (address) getUserData(address);
                    }, 1000);
                  }}
                  cursor="pointer"
                  fontWeight="bold"
                  color="white"
                  borderRadius="3xl"
                  backgroundColor="#0D164D"
                  p="1"
                  px="2"
                  fontSize="sm"
                  borderWidth="2px"
                  letterSpacing="widest"
                >
                  Buy now
                </Text>
              );
            })()}
            <Box
              w="40px"
              cursor="pointer"
              h="40px"
              borderRadius="full"
              justifyContent="center"
              alignItems="center"
              display="flex"
              backgroundColor="white"
              _hover={{
                backgroundColor: "gray.300",
              }}
              onClick={onPlayMusic}
            >
              {isPlayingState &&
              currentSongState?.audio == ipfsToGateway(audio) ? (
                <TiMediaPause size="20px" color="black" />
              ) : (
                <FaPlay size="10px" color="black" />
              )}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default SongNFTComponent;
