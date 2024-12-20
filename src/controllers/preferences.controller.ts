import {
  Controller,
  Request,
  UseGuards,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { AddPreferenceDto } from 'src/dto/add-preferences.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { VerifiedUserGuard } from 'src/guard/verfied-user.guard';
import { PreferencesService } from 'src/services/preferences.service';

@Controller('preferences')
@UseGuards(AuthGuard, VerifiedUserGuard)
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post('add')
  addPreference(@Request() req, @Body() addPreferenceDto: AddPreferenceDto) {
    const userId = req.user.id;
    return this.preferencesService.addPreference(userId, addPreferenceDto);
  }

  @Delete('remove')
  removePreference(@Request() req, @Body('id') id: number) {
    const userId = req.user.id;
    return this.preferencesService.removePreference(userId, id);
  }
}
