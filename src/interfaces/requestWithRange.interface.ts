import IRequestWithUser from './requestWithUser.interface';

interface IRequestWithRange extends IRequestWithUser {
  rangeStart: number;
  rangeEnd: number;
}

export default IRequestWithRange;