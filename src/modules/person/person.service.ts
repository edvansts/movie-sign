import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { normalizeGender } from 'src/helpers';
import { Person, PersonDocument } from 'src/schemas/person.schema';
import type { PersonBody } from './person.types';

@Injectable()
export class PersonService {
  constructor(
    @InjectModel(Person.name)
    private readonly personModel: Model<PersonDocument>,
  ) {}

  private async create(personBody: PersonBody) {
    const { lastPopularity, name, tmdbId, profileImage, gender } = personBody;

    const newPerson = new this.personModel({
      lastPopularity,
      name,
      tmdbId,
      profileImage,
      gender: normalizeGender(gender),
    });

    await newPerson.save();

    return newPerson;
  }

  async getOrCreatePerson(personBody: PersonBody) {
    const { tmdbId } = personBody;

    const person = await this.personModel.findOne({ tmdbId });

    if (person) {
      return person;
    }

    const createdPerson = await this.create(personBody);

    return createdPerson;
  }
}
