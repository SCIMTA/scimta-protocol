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
  Tooltip,
  Tr,
} from "@chakra-ui/react";
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
import { useRouter } from "next/router";
import { BsPauseFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { ipfsToGateway } from "../constants/utils";
import { useMusicIsPlayingView } from "../hooks/music";
import { GetMarketOutput } from "../services/api/types";
import { useStoreActions, useStoreState } from "../services/redux/hook";
import SongNFTSmallComponent from "./song-nft-small";
import { ABI_MUSIC } from "../constants/abi";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useEffect, useState } from "react";
import ApiServices from "../services/api";

const Collection = ({
  address,
  setTotalCollection,
}: {
  address: string;
  setTotalCollection: any;
}) => {
  const playMusicAction = useStoreActions((state) => state.music.playMusic);
  const currentSongState = useStoreState((state) => state.music.currentSong);
  const isPlayingState = useStoreState((state) => state.music.isPlaying);
  const [collection, setCollection] = useState<GetMarketOutput[]>([]);

  const [total, setTotal] = useState(0);
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
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

  const getData = async () => {
    if (address) {
      try {
        const resStudio = await ApiServices.music.getMyCollection(currentPage);
        setCollection(resStudio.data.data);
        setTotal(resStudio.data.total);
        setTotalCollection(resStudio.data.total);
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
                Purchase Price
              </Th>
              <Th
                fontFamily="mono"
                fontWeight="bold"
                fontSize="16"
                color="#fcae00"
              >
                Date
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {collection.map((item, idx) => (
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
                <Td>{new Date(item.created_at).toDateString()}</Td>
                <Td>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-evenly"
                  >
                    {isPlayView(item)}
                    <MdSell
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        window.open(
                          `https://testnets.opensea.io/assets/mumbai/${ABI_MUSIC.Music.address}/${item.id}`,
                          `_blank`
                        );
                      }}
                      size={"25px"}
                    />
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
        {collection.map((item, idx) => (
          <SongNFTSmallComponent {...item} key={idx} />
        ))}
      </Stack>
      <Center mt={"10"}>
        {pagesCount > 1 && (
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          >
            <PaginationContainer gap={2}>
              {currentPage > 1 && (
                <PaginationPrevious>
                  <GrFormPrevious />
                </PaginationPrevious>
              )}
              <PaginationPageGroup
                separator={<PaginationSeparator bg="white" />}
                gap={1}
              >
                {pages.map((page: number) => (
                  <PaginationPage
                    _hover={{
                      bg: "#fcae00",
                    }}
                    w={["30px"]}
                    bg={page === currentPage ? "#fcae00" : "white"}
                    key={`pagination_page_${page}`}
                    page={page}
                    _current={{
                      bg: "#fcae00",
                      color: "white",
                    }}
                  />
                ))}
              </PaginationPageGroup>
              {currentPage < pagesCount && (
                <PaginationNext>
                  <GrFormNext />
                </PaginationNext>
              )}
            </PaginationContainer>
          </Pagination>
        )}
      </Center>
    </>
  );
};

export default Collection;
