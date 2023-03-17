import { create } from 'ipfs-http-client';
import { AxiosGet } from './axios.provider';

const getClient = () => {
  const ipfsUrl: any = new URL(process.env.IPFS_PROVIDER_URI as string);
  const client = create(ipfsUrl);
  return client;
};

const uploadJson = async (json: any): Promise<any> => {
  const client = getClient();
  const jsonIPFS = await client.add(JSON.stringify(json));
  return jsonIPFS;
};

const uploadFile = async (content: Buffer): Promise<any> => {
  const client = getClient();

  const file = await client.add({
    content,
  });
  return file;
};

const getFile = async (cid: string): Promise<any> => {
  const client = getClient();
  let result: any = [];
  for await (const chunk of client.cat(cid)) {
    result = [...result, ...chunk];
    // console.log("run");
  }

  try {
    JSON.parse(Buffer.from(result) as any);
    // console.log(JSON.parse(Buffer.from(result) as any));
    return [Buffer.from(result), 'json'];
    // fs.writeFileSync(Date.now() + ".json", Buffer.from(result));
  } catch (error) {
    return [Buffer.from(result), 'png'];
    // fs.writeFileSync(Date.now() + ".png", Buffer.from(result));
  }
};

const uploadFolder = async (contents: Buffer[]): Promise<any> => {
  let listFiles: string[] = [];
  let id = 1;
  const recentTime = Date.now().toString();
  for (let i = 0; i < contents.length; i++) {
    listFiles.push(`${recentTime}/${id}`);
    id++;
  }
  const client = getClient();
  let results: any[] = [];
  for await (const result of client.addAll(
    listFiles.map((file, index) => ({
      path: file,
      content: contents[index],
    })),
  )) {
    results.push(result);
  }
  return results;
};

const readCID = async (cid: string) => {
  const data = await AxiosGet(`${process.env.IPFS_GATEWAY_URI}${cid.replace('ipfs://', '')}`);
  return data.data;
};

export { uploadJson, uploadFile, readCID, uploadFolder, getFile };
