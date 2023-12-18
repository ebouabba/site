import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let status = 500; // Default status code

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

   response.redirect('http://localhost:3000/auth/login')
    // response.status(status).json({
    //   statusCode: status,
    //   message: exception.message,
    // });
  }
}

