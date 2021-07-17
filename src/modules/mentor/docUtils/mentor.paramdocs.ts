import { ApiParamOptions } from '@nestjs/swagger';

export const mentorId: ApiParamOptions = {
  name: 'mentorId',
  type: String,
  description: 'mentor Id in the form of MongoId',
  example: '60ccf3758dc53371bd4d0154',
};

export const courseId: ApiParamOptions = {
  name: 'courseId',
  type: String,
  description: 'Course Id in the form of MongoId',
  example: '60ccf3758dc53371bd4d0154',
};
