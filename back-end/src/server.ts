import 'module-alias/register';
import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from '../build/routes';
import { logger } from './constants';
import { exec } from 'child_process';
import { connectToMongoDB, startSynchronizeDataFromSmartContract } from '@providers';

startSynchronizeDataFromSmartContract();
connectToMongoDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.use(function (_req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});
app.use(function (req, _res, next) {
  logger.info(
    `[${req.method}] ${req.url} ${req.ip} ${req.headers['authorize']} ${JSON.stringify(req.body)}`,
  );
  next();
});

// router.get("/file", (req, res) => {
//   try {
//     const { name } = req.query;
//     let filePath = `${__dirname}/${PATH_UPLOAD_FILE}${name}`;
//     if (fs.existsSync(filePath)) {
//       var path = require("path");
//       return res.sendFile(path.resolve(filePath));
//     } else throw new Error("File not found");
//   } catch (error) {
//     return res.json(onError(error));
//   }
// });

app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('../build/swagger.json')));
});

app.use('/push', async (_req: Request, _res: Response) => {
  _res.json({ message: 'push' });
  exec('cd ~/ubuntu/blc-awesome-dapp/BE && yarn && pm2 restart 0');
});

logger.info('Server start at ' + new Date().toUTCString());
app.listen(parseInt(process.env.PORT || ''), '0.0.0.0', () => {
  logger.info(`Server running on port ${process.env.PORT}`);
});
RegisterRoutes(app);
