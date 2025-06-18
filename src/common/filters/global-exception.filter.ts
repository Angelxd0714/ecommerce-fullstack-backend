import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { WompiError } from '../interfaces/wompi-error.interface';
import { Response } from 'express';


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let message: string;
    let details: any;
    let stack: string | undefined;

    // Manejo de diferentes tipos de excepciones
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        details = (exceptionResponse as any).details || null;
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
      stack = exception.stack;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
    }

    // Log del error
    this.logger.error(
      `Error en ${request.method} ${request.url}: ${message}`,
      stack || exception
    );

    // Formato de respuesta consistente
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      details,
    };

    // Manejo especial para errores de Wompi (422)
    if (this.isWompiError(exception)) {
      const wompiError = this.parseWompiError(exception);
      Object.assign(errorResponse, {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Error en el procesamiento del pago',
        details: wompiError,
      });
    }

    
    response.status(status).json(errorResponse);
  }

  private isWompiError(exception: any): boolean {
    return exception?.response?.status === 422;
  }

  private parseWompiError(exception: any): WompiError {
    const errorData = exception.response?.data?.error || {};
    return {
      type: errorData.type || 'payment_error',
      messages: Array.isArray(errorData.messages)
        ? errorData.messages
        : [errorData.message || 'Error desconocido en el pago'],
      fields: errorData.fields || null,
      code: errorData.code || null,
    };
  }
}
