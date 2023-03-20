import { Constant, logger, onError, onSuccess, onSuccessArray, OptionResponse } from '@constants';
import { SignatureMiddleware } from '@middlewares';
import { Singleton } from '@providers';
import { IMessage } from '@chat-schemas';
import { Request as exRequest } from 'express';
import {
  Body,
  Controller,
  Get,
  Middlewares,
  Patch,
  Post,
  Query,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa';

const { NETWORK_STATUS_CODE, NETWORK_STATUS_MESSAGE } = Constant;

@Tags('Message-Public-Limited')
@Middlewares([SignatureMiddleware])
@Route('message-public-limited')
@Security({
  authorize: [],
  address: [],
})
export class MessagePublicLimitedController extends Controller {
  private messageService = Singleton.getPublicLimitedRoomInstance();

  @Get('get-message-in-room')
  public async getMessage(
    @Request() req: exRequest,
    @Query() room_id: string,
    @Query() page: number,
    @Query() limit: number = Constant.LIMIT_MESSAGE,
    @Query() isDescending: boolean = false,
  ): Promise<OptionResponse<IMessage[]>> {
    try {
      const address = req.headers.address as string;

      const messages = await this.messageService.getMessageOfRoom(
        address,
        room_id,
        page,
        limit,
        isDescending,
      );
      return onSuccessArray(messages);
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('update-message')
  public async updateMessage(
    @Request() req: exRequest,
    @Body()
    data: {
      message_id: string;
      message_data: string;
    },
  ): Promise<OptionResponse<IMessage>> {
    try {
      const address = req.headers.address as string;
      const { message_data, message_id } = data;
      const messages = await this.messageService.updateMessage(message_id, address, message_data);
      return onSuccess(messages);
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('send-message')
  public async sendMessage(
    @Request() req: exRequest,
    @Body()
    inputParam: {
      message_data: string;
      room_id: string;
      shared_key_id: string;
      is_forwarded?: boolean;
      message_id_reply?: string;
      is_notification?: boolean;
    },
  ) {
    try {
      const address = req.headers.address as string;
      const {
        message_data,
        room_id,
        shared_key_id,
        is_forwarded,
        message_id_reply,
        is_notification,
      } = inputParam;
      const updatedMessage = await this.messageService.sendMessage(
        address,
        room_id,
        message_data,
        shared_key_id,
        is_forwarded,
        message_id_reply,
        is_notification,
      );
      return onSuccess(updatedMessage);
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }
}
