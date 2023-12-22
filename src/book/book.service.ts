import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schema/book.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}
  async findAll(query: Query): Promise<Book[]> {
    const showPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = showPerPage * (currentPage - 1);
    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const books = await this.bookModel
      .find({ ...keyword })
      .limit(showPerPage)
      .skip(skip);
    return books;
  }
  create = async (book: Book): Promise<Book> => {
    const res = await this.bookModel.create(book);
    return res;
  };
  findById = async (id: string): Promise<Book> => {
    const res = await this.bookModel.findById(id);
    if (!res) {
      throw new NotFoundException('Book not found');
    }
    return res;
  };
  updateById = async (id: string, book: Book): Promise<Book> => {
    const res = await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
    if (!res) {
      throw new NotFoundException('Book not found');
    }
    return res;
  };
  deleteById = async (id: string): Promise<any> => {
    return await this.bookModel.findByIdAndDelete(id);
  };
}
