import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  NotFoundException,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service'; //eslint-disable-line 
import { CreateAssignmentDTO } from './dto/create-assignment.dto'; //eslint-disable-line 
import { ApiCreatedResponse, ApiProperty } from '@nestjs/swagger';

class AssignmentResponseBody {
  @ApiProperty({ required: true, example: '605e3fd9acc33583fb389aec' })
  id: string;

  @ApiProperty({ required: true, example: 'Noob' })
  name: string;

  @ApiProperty({ required: true, example: 'Coder' })
  link: string;

  @ApiProperty({ required: true, example: 'noobcoder@gmai.com' })
  submit_by: string;
}

@Controller('Assignment')
export class AssignmentController {
  constructor(private AssignmentService: AssignmentService) {}

  // add a Assignment
  @Post()
  @UsePipes(ValidationPipe)
  async addAssignment(@Body() CreateAssignmentDTO: CreateAssignmentDTO) {
    const Assignment = await this.AssignmentService.addAssignment(
      CreateAssignmentDTO,
    );
    return Assignment;
  }

  // Retrieve Assignments list
  @ApiCreatedResponse({ type: [AssignmentResponseBody] })
  @Get()
  async getAllAssignment() {
    const Assignments = await this.AssignmentService.getAllAssignment();
    return Assignments;
  }

  // Fetch a particular Assignment using ID
  @ApiCreatedResponse({ type: AssignmentResponseBody })
  @Get('/:assignmentId')
  async getAssignment(@Param('assignmentId') AssignmentId: string) {
    const Assignment = await this.AssignmentService.getAssignment(AssignmentId);
    return Assignment;
  }

  @Put('/:assignmentId')
  async updateAssignment(
    @Param('assignmentId') AssignmentId: string,
    @Body() createAssignmentDTO: CreateAssignmentDTO,
  ) {
    console.log('assignmentId', AssignmentId);
    const Assignment = await this.AssignmentService.updateAssignment(
      AssignmentId,
      createAssignmentDTO,
    );

    if (!Assignment) throw new NotFoundException('Assignment does not exist!');

    return Assignment;
  }

  // Delete a Assignment
  @Delete('/:assignmentId')
  async deleteAssignment(@Param('assignmentId') AssignmentId: string) {
    const Assignment = await this.AssignmentService.deleteAssignment(
      AssignmentId,
    );
    if (!Assignment) throw new NotFoundException('Assignment does not exist');
    return Assignment;
  }
}
