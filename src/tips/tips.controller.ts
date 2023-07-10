import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Controller('tips')
export class TipsController {
  @Get(':slug')
  async getAllTips(@Param('slug') slug: string): Promise<any[]> {
    return [{ Matze: { Fooo: slug } }];
  }

  @Get(':slug/:username')
  async getUserTip(@Param('username') username: string): Promise<any> {
    return {};
  }

  @Post(':slug/:username')
  async setUserTip(@Param('username') userId: string): Promise<any> {
    console.log(admin.database().ref().ref);
    return {};
  }

  @Post(':slug/setJoker/:username')
  async setJokerTip(
    @Param('username') userId: string,
    @Body() body: any,
  ): Promise<any> {
    return { userId: body };
  }

  @Post(':slug/unsetJoker/:username')
  async unsetJokerTip(
    @Param('username') userId: string,
    @Body() body: any,
  ): Promise<any> {
    return { userId: body };
  }
}
