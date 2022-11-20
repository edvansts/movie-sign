import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from 'src/schemas/person.schema';
import { PersonService } from './person.service';

@Module({
  providers: [PersonService],
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
  ],
  exports: [PersonService],
})
export class PersonModule {}
