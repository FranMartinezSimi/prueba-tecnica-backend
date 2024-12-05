export class Response {
  status: string;
  message: string;
  data: any;
  statusCode: number;

  constructor(status: string, message: string, data: any, statusCode: number) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  static success(message: string, data: any, statusCode: number = 200) {
    return {
      status: 'success',
      message,
      data,
      statusCode
    }
  }
}
