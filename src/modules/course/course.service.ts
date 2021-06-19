import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseDocument as Course } from './schema/course.schema';
import { UpdateCourseDTO } from './dto/course-update.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { Schema } from 'mongoose';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './schema/schedule.schema';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private readonly CourseModel: Model<Course>,
    @InjectModel('Schedule') private readonly ScheduleModel: Model<Schedule>,
  ) {}

  // fetch all courses
  async getAllCourses(): Promise<Course[]> {
    try {
      return await this.CourseModel.find().populate('schedule').exec();
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `${e}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // fetch selected course by id
  async findCourseById(courseId: Schema.Types.ObjectId): Promise<Course> {
    try {
      const Course = await this.CourseModel.findById(courseId)
        .populate('schedule')
        .exec();
      if (Course) {
        return Course;
      } else {
        throw new NotFoundException('course not found');
      }
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `${e}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // add course
  async addCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const newCourse = new this.CourseModel(createCourseDto);
      await newCourse.save();
      if (newCourse) {
        return newCourse;
      }
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `${e}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new NotFoundException('doubt not found!');
  }

  // edit course by Id
  async editCourse(
    courseId: Schema.Types.ObjectId,
    updateCourseDTO: UpdateCourseDTO,
  ): Promise<Course> {
    let updatedCourse = null;
    try {
      updatedCourse = await this.CourseModel.findByIdAndUpdate(
        courseId,
        updateCourseDTO,
        { new: true },
      );
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `${e}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      return updatedCourse;
    }
  }

  // Delete a Course by Id
  async deleteCourse(courseId): Promise<any> {
    try {
      const deletedCourse = await this.CourseModel.findByIdAndRemove(courseId);
      return deletedCourse;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `${e}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Create a Schedule
  async addScheduleCourse(
    courseId: Schema.Types.ObjectId,
    createScheduleDto: CreateScheduleDto,
  ): Promise<any> {
    try {
      const course = await this.CourseModel.findById(courseId);
      if (course) {
        const newSchedule = new this.ScheduleModel(createScheduleDto);
        await newSchedule.save();
        course.schedule.push(newSchedule);
        await course.save();
        return newSchedule;
      } else {
        throw new NotFoundException(
          'The course id is invalid or the course no longer exists',
        );
      }
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `${e}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // update a Schedule by Id
  async updateScheduleCourse(
    courseId: Schema.Types.ObjectId,
    scheduleId: Schema.Types.ObjectId,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<any> {
    try {
      const course = await this.CourseModel.findById(courseId);
      if (course) {
        let updatedSchedule = null;
        updatedSchedule = await this.ScheduleModel.findByIdAndUpdate(
          scheduleId,
          updateScheduleDto,
          { new: true },
        );
        return updatedSchedule;
      } else {
        throw new NotFoundException(
          'The course id is invalid or the course no longer exists',
        );
      }
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `${e}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete a schedule by Id
  async deleteScheduleCourse(
    courseId: Schema.Types.ObjectId,
    scheduleId: Schema.Types.ObjectId,
  ): Promise<any> {
    try {
      const course = await this.CourseModel.findById(courseId);
      if (course) {
        let deletedSchedule = null;
        deletedSchedule = await this.ScheduleModel.findByIdAndRemove(
          scheduleId,
        );
        return deletedSchedule;
      } else {
        throw new NotFoundException(
          'The course id is invalid or the course no longer exists',
        );
      }
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `${e}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
