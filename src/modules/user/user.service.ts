import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument as User } from './schema/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CourseDocument as Course } from '../course/schema/course.schema';
import { EnrolledCourseDocument as Enrolled } from '../course/schema/enrolledCourse.schema';
import * as mongoose from 'mongoose';
import { CreateEnrolledDTO } from './dto/create-enrolled.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Course') private readonly courseModel: Model<Course>,
    @InjectModel('Enrolled') private readonly enrolledModel: Model<Enrolled>,
  ) {}

  // fetch all Users
  async getAllUser(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  // Get a single User
  async findUserById(userId): Promise<User> {
    try {
      const user = await this.userModel.findById(userId).exec();

      if (user) {
        return user;
      }
    } catch (e) {
      throw new NotFoundException('User Not Found!');
    }
    throw new NotFoundException('User Not Found!');
  }

  // post a single User
  async addUser(CreateUserDTO: CreateUserDTO): Promise<User> {
    const newUser = await new this.userModel(CreateUserDTO);
    return newUser.save();
  }

  // Edit User details
  async updateUser(
    userID: string,
    UpdateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    let updatedUser;
    try {
      updatedUser = await this.userModel.findByIdAndUpdate(
        userID,
        UpdateUserDTO,
        { new: true, useFindAndModify: false },
      );
    } catch (e) {
      throw new BadRequestException(e);
    } finally {
      return updatedUser;
    }
  }

  // Delete a User
  async deleteUser(userID: string): Promise<any> {
    let deletedUser;
    try {
      deletedUser = await this.userModel.findByIdAndRemove(userID);
    } finally {
      return deletedUser;
    }
  }

  // gets all Enrolled courses
  async getEnrolledCourses(userId: mongoose.Schema.Types.ObjectId) {
    const enrolledCourses = await this.enrolledModel.findOne({
      studentId: userId,
    });
    return enrolledCourses;
  }

  // adds Enrolled Course
  async addCourse(userId: string, createEnrolledDTO: CreateEnrolledDTO) {
    try {
      const newEnrolled = await new this.enrolledModel(createEnrolledDTO);
      await newEnrolled.save();
      const course = await this.courseModel.findById(
        createEnrolledDTO.courseId,
      );

      if (course) {
        newEnrolled['videosWatched'] = new Array(course.video_num).fill(false);
        await newEnrolled.save();
        return newEnrolled;
      } else {
        throw new NotFoundException('course not found!');
      }

      // a test line to see the populated sets of data
      /*const newF = await this.enrolledModel.find({}).populate('students');
      return newF;*/
    } catch (e) {
      throw new NotFoundException('User or Course does not exist');
    }
  }

  // gets all wishlisted courses
  async getWishList(userId: string) {
    const UserWishList = await this.findUserById(userId);
    return UserWishList.wishlist;
  }

  // adds wishlisted course
  async addWishlist(userId: string, cId: mongoose.Schema.Types.ObjectId) {
    try {
      const UserWishList = await this.findUserById(userId);

      if (UserWishList) {
        UserWishList.wishlist.push(cId);
        await UserWishList.save();
        return UserWishList;
      }
    } catch (e) {
      throw new NotFoundException('User or Course does not exist');
    }

    throw new NotFoundException('course could not be wishlisted');
  }
}
