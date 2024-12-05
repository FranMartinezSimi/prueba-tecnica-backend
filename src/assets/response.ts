export class Response {
  status: string;
  message: string;
  data: any;
  constructor(status, message, data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
