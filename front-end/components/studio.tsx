import {
  Center,
  Image,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsPauseFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { ipfsToGateway } from "../constants/utils";
import { useBuyMusic, useMusicIsPlayingView } from "../hooks/music";
import { GetMarketOutput } from "../services/api/types";
import { useStoreActions, useStoreState } from "../services/redux/hook";
import SongNFTSmallComponent from "./song-nft-small";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
  PaginationSeparator,
} from "@ajna/pagination";
import { useEffect, useState } from "react";
import ApiServices from "../services/api";
import { GiShoppingCart } from "react-icons/gi";
import { useAddress } from "@thirdweb-dev/react";
import PaginationComponent from "./Pagination";
const Studio = ({
  address,
  setTotalStudio,
}: {
  address: string;
  setTotalStudio: any;
}) => {
  const playMusicAction = useStoreActions((state) => state.music.playMusic);
  const { onBuy } = useBuyMusic();

  const currentAddress = useAddress();
  const isMyProfile = currentAddress === address;
  const currentSongState = useStoreState((state) => state.music.currentSong);
  const isPlayingState = useStoreState((state) => state.music.isPlaying);
  const [studio, setStudio] = useState<GetMarketOutput[]>([]);
  const [total, setTotal] = useState(0);
  const pagination = usePagination({
    total,
    initialState: {
      currentPage: 1,
      pageSize: 24,
    },
    limits: {
      inner: 1,
      outer: 1,
    },
  });

  const { currentPage } = pagination;

  const getData = async () => {
    if (address) {
      try {
        const resStudio = await ApiServices.music.getMyMarket(
          `${address}`,
          currentPage
        );
        setStudio(resStudio.data.data);
        setTotal(resStudio.data.total);
        setTotalStudio(resStudio.data.total);
      } catch (error) {}
    }
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  const isPlayView = useMusicIsPlayingView({
    pauseComponent: <BsPauseFill size={"20px"} />,
    playComponent: <FaPlay size={"20px"} />,
    playMusicAction,
    currentSongState,
    isPlayingState,
  });

  const { push } = useRouter();

  return (
    <>
      <TableContainer>
        <Table
          display={{
            base: "none",
            md: "table",
          }}
          variant="simple"
        >
          <Thead>
            <Tr>
              <Th
                fontFamily="mono"
                fontWeight="bold"
                fontSize="16"
                color="#fcae00"
              >
                Title
              </Th>
              <Th
                fontFamily="mono"
                fontWeight="bold"
                fontSize="16"
                color="#fcae00"
              >
                Time
              </Th>
              <Th
                fontFamily="mono"
                fontWeight="bold"
                fontSize="16"
                color="#fcae00"
              >
                Price
              </Th>
              <Th
                fontFamily="mono"
                fontWeight="bold"
                fontSize="16"
                color="#fcae00"
              >
                Sold
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {studio.map((item, idx) => (
              <Tr
                fontFamily="mono"
                fontWeight="bold"
                key={idx}
                fontSize="16"
                color="white"
              >
                <Td
                  cursor="pointer"
                  onClick={() => {
                    push(`/music/${item.id}`);
                  }}
                  display="flex"
                  alignItems="center"
                  gap={3}
                >
                  <Image
                    _hover={{
                      transform: "scale(1.2)",
                    }}
                    transition="all 0.3s ease-in-out"
                    w={["50px"]}
                    fit="cover"
                    style={{
                      aspectRatio: "1/1",
                    }}
                    borderRadius="lg"
                    cursor="pointer"
                    src={ipfsToGateway(item.image)}
                  />
                  {item.name}
                </Td>
                <Td>
                  {Math.floor(item.duration / 60)}:
                  {Math.round(item.duration % 60)}
                </Td>
                <Td>{item.price} MUC</Td>
                <Td>
                  {item.left}/{item.amount}
                </Td>
                <Td>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-evenly"
                  >
                    {isPlayView(item)}
                    {!isMyProfile && (
                      <GiShoppingCart
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          onBuy(item.price, item.id);
                        }}
                        size={"25px"}
                      />
                    )}
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Stack
        display={{
          base: "flex",
          md: "none",
        }}
      >
        {studio.map((item, idx) => (
          <SongNFTSmallComponent {...item} key={idx} />
        ))}
      </Stack>
      <PaginationComponent pagination={pagination} />
    </>
  );
};

export default Studio;
