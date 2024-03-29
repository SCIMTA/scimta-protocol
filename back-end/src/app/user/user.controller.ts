import { Constant, logger, onError, onSuccess, OptionResponse } from '@constants';
import { SignatureMiddleware } from '@middlewares';
import { Singleton } from '@providers';
import { IUser } from '@schemas';
import {
  Body,
  Controller,
  Get,
  Middlewares,
  Post,
  Query,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa';
import { CreateUserInput } from './user';

const { NETWORK_STATUS_CODE, NETWORK_STATUS_MESSAGE } = Constant;
@Tags('user')
@Route('user')
@Security('authorize')
export class UserController extends Controller {
  @Post('create-user')
  @Middlewares([SignatureMiddleware])
  public async createUser(
    @Request() request: any,
    @Body() payload: Omit<CreateUserInput, 'wallet_address'>,
  ): Promise<OptionResponse<IUser>> {
    try {
      const address = request.headers.address;
      return onSuccess(
        await Singleton.getUserInstance().createUser({
          wallet_address: address.toLowerCase(),
          ...payload,
        }),
      );
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('get-user')
  public async getUser(@Query() address: string): Promise<OptionResponse<IUser>> {
    try {
      return onSuccess(await Singleton.getUserInstance().getUser(`${address}`.toLowerCase()));
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }
}
