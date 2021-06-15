import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { UpdateCourseDTO } from './dto/course-update.dto';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Schema } from 'mongoose';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  // get all courses
  @Get('/all')
  async getAllCourses() {
    return await this.courseService.getAllCourses();
  }

  // get selected course by Id
  @Get('/:courseId')
  @ApiParam({ name: 'courseId', type: String })
  @ApiCreatedResponse({ type: CreateCourseDto })
  async getSelectedCourse(@Param('courseId') courseId: Schema.Types.ObjectId) {
    return await this.courseService.findCourseById(courseId);
  }

  // add a Course
  @Post('/create')
  async addCourse(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.addCourse(createCourseDto);
  }

  // update a course by Id
  @Put('/edit/:courseId')
  @ApiParam({ name: 'courseId', type: String })
  @ApiOkResponse({ type: UpdateCourseDTO })
  async updateCourse(
    @Param('courseId') courseId: Schema.Types.ObjectId,
    @Body() updateCourseDTO: UpdateCourseDTO,
  ) {
    return await this.courseService.editCourse(courseId, updateCourseDTO);
  }

  // delete a course by Id
  @Delete('delete/:courseId')
  @ApiParam({ name: 'courseId', type: String })
  async deleteCourse(@Param('courseId') courseId: Schema.Types.ObjectId) {
    return await this.courseService.deleteCourse(courseId);
  }

  // Create a Schedule
  @Post('/create/:courseId/schedule')
  @ApiParam({ name: 'courseId', type: String })
  @ApiCreatedResponse({ type: CreateScheduleDto })
  async addScheduleCourse(
    @Param('courseId') courseId: Schema.Types.ObjectId,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return await this.courseService.addScheduleCourse(
      courseId,
      createScheduleDto,
    );
  }

  // update a Schedule by Id
  @Put('/update/:courseId/schedule/:scheduleId')
  @ApiParam({ name: 'courseId', type: String })
  @ApiOkResponse({ type: UpdateScheduleDto })
  async updateScheduleCourse(
    @Param('courseId') courseId: Schema.Types.ObjectId,
    @Param('scheduleId') scheduleId: Schema.Types.ObjectId,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return await this.courseService.updateScheduleCourse(
      courseId,
      scheduleId,
      updateScheduleDto,
    );
  }

  // Delete a schedule by Id
  @Delete('/delete/:courseId/schedule/:scheduleId')
  @ApiParam({ name: 'courseId', type: String })
  async deleteScheduleCourse(
    @Param('courseId') courseId: Schema.Types.ObjectId,
    @Param('scheduleId') scheduleId: Schema.Types.ObjectId,
  ) {
    return await this.courseService.deleteScheduleCourse(courseId, scheduleId);
  }
}
