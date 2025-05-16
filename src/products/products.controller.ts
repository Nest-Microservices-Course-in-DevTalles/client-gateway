import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query, ParseIntPipe,
} from '@nestjs/common';
import { PRODUCT_SERVICE } from '../config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../common';
import { catchError } from 'rxjs/operators';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto){
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto)
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'find_all_products' }, paginationDto); // { limit: 2, page: 2 }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError( err => {
          throw new RpcException(err);
        } ),
      )

    // try {
    //
    //   const product = await firstValueFrom(this.productsClient.send({ cmd: 'find_one_product' }, { id })); // firstValueFrom recibe un Observable
    //
    //   return product
    //
    // }catch(error) {
    //   throw new RpcException(error);
    // }

  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ){
    return this.productsClient.send(
      { cmd: 'update_product' },
      {
        id,
        ...updateProductDto
      },
    ).pipe(
      catchError(err => {
        throw new RpcException(err)
      })
    );
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id })
      .pipe(
        catchError(err => {
          throw new RpcException(err)
        })
      );
  }

}
