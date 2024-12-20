import {
  Controller,
  Request,
  UseGuards,
  Post,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AddPreferenceDto } from 'src/dto/add-preferences.dto';
import { PreferenceDto } from 'src/dto/preferences.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { PreferencesService } from 'src/services/preferences.service';

@Controller('preferences')
@UseGuards(AuthGuard)
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post('add')
  @ApiOperation({
    summary: 'Add preference',
    description: 'Add a preference to the user',
  })
  @ApiCreatedResponse({
    description: 'Preference added successfully',
    type: PreferenceDto,
  })
  @ApiConflictResponse({
    description: 'Preference already exists',
  })
  addPreference(
    @Request() req,
    @Body() addPreferenceDto: AddPreferenceDto,
  ): Promise<PreferenceDto> {
    const userId = req.user.id;
    return this.preferencesService.addPreference(userId, addPreferenceDto);
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Remove preference',
    description: 'Remove a preference from the user',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the preference to delete',
    example: 1,
  }) // Document the ID parameter
  @ApiNoContentResponse({ description: 'Preference deleted successfully' }) // Success response
  @ApiNotFoundResponse({ description: 'Preference not found' }) // E
  removePreference(@Request() req, @Param('id') id: number) {
    const userId = req.user.id;
    return this.preferencesService.removePreference(userId, id);
  }

  @Post('get')
  @ApiOperation({
    summary: 'Get preferences',
    description: 'Get all preferences for the user',
  })
  @ApiOkResponse({
    description: 'Preferences retrieved successfully',
    type: [PreferenceDto],
  })
  getPreferences(@Request() req) {
    const userId = req.user.id;
    return this.preferencesService.getUserPreferences(userId);
  }
}
