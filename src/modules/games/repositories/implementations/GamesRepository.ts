import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder('g')
      .where('lower(g.title) ilike(:title)', { title: `%${param}%` })
      .getMany();

    return games;
    // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query('select count(1) from games'); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const response = await this.repository
      .createQueryBuilder('g')
      .leftJoinAndSelect('users_games_games', 'user_games', 'user_games.gamesId = g.id')
      .leftJoinAndSelect('users', 'user', 'user.id = user_games.usersId')
      .where('g.id = :id', { id })
      .getRawMany()

    const users = (response.map((gameUsers) => {
      return {
        first_name: gameUsers['user_first_name'],
        last_name: gameUsers['user_last_name'],
        email: gameUsers['user_email'],
      }
    })) as User[];

    return users;
    // Complete usando query builder
  }
}
