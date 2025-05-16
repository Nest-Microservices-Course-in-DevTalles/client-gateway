import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {

  catch(exception: RpcException, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError(); // { status: 400, message: 'Product with id 1 not found' }

    if(
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
      return response.status(status).json(rpcError); //.status(status) es el status que se devolverá y .json(rpcError) es el cuerpo que se devolverá  -> eso se le dice a express framework
    }

    response.status(400).json({
      status: 400,
      message: rpcError
    })

  }

}