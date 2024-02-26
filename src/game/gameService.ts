import { StatusAttack } from '../types/command';
import { ShipsCoord } from '../types/incomingData';
import { Coordinate } from '../types/types';

export class GameService {
  addShips(ships: ShipsCoord[]) {
    const board: Array<number[]> = Array(10)
      .fill(0)
      .map(() => Array(10).fill(0));
    for (const ship of ships) {
      const x = ship.position.x;
      const y = ship.position.y;

      const direction = ship.direction;

      for (let i = 0; i < ship.length; i++) {
        const dx = direction ? 0 : i;
        const dy = direction ? i : 0;

        board[y + dy][x + dx] = ship.type === 'small' ? 1 : ship.type === 'medium' ? 2 : ship.type === 'large' ? 3 : 4;
      }
    }
    return board;
  }

  private isValid(x: number, y: number) {
    return x >= 0 && x < 10 && y >= 0 && y < 10;
  }

  attack(x: number, y: number, board: Array<number[]>) {
    if (!this.isValid(x, y)) {
      return null;
    }

    const value = board[y][x];

    if (value === 0) {
      board[y][x] = -5;
      return StatusAttack.Miss;
    }

    if (value < 0) {
      return value;
    }

    if (value === 1) {
      board[y][x] = -value;
      return StatusAttack.Killed;
    }

    board[y][x] = -value;
    let count = 1;

    for (let dx = -1; x + dx >= 0; dx--) {
      const neighbor = board[y][x + dx];
      if (neighbor === -value) {
        count++;
      }

      if (neighbor === 0 || neighbor === -5) {
        break;
      }
    }

    for (let dx = 1; x + dx < board.length; dx++) {
      const neighbor = board[y][x + dx];

      if (neighbor === -value) {
        count++;
      }

      if (neighbor === 0 || neighbor === -5) {
        break;
      }
    }

    for (let dy = -1; y + dy >= 0; dy--) {
      const neighbor = board[y + dy][x];

      if (neighbor === -value) {
        count++;
      }

      if (neighbor === 0 || neighbor === -5) {
        break;
      }
    }

    for (let dy = 1; y + dy < board.length; dy++) {
      const neighbor = board[y + dy][x];

      if (neighbor === -value) {
        count++;
      }

      if (neighbor === 0 || neighbor === -5) {
        break;
      }
    }

    return count === value ? StatusAttack.Killed : StatusAttack.Shot;
  }

  getRandomCoordinate(board: Array<number[]>) {
    const free = [];

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (board[y][x] > 0) {
          free.push({ x, y });
        }

        if (board[y][x] === 0) {
          const random = Math.random();
          if (random <= 0.6) {
            free.push({ x, y });
          }
        }
      }
    }

    if (free.length === 0) {
      return null;
    }
    const index = Math.floor(Math.random() * free.length);
    const coord = free[index];
    return coord;
  }

  markAroundKilledShip(board: Array<number[]>, x: number, y: number, prevX?: number, prevY?: number): Coordinate[] {
    const coordinates: Coordinate[] = [];
    const value = board[y][x];
    if (value < 0 && value !== -5) {
      const offsets = [-1, 0, 1];
      for (const dy of offsets) {
        for (const dx of offsets) {
          const newX = x + dx;
          const newY = y + dy;
          if (this.isValid(newX, newY) && !(newX === x && newY === y) && !(newX === prevX && newY === prevY)) {
            if (board[newY][newX] === 0) {
              board[newY][newX] = -5;
              coordinates.push({ x: newX, y: newY });
            } else if (board[newY][newX] === value) {
              coordinates.push(...this.markAroundKilledShip(board, newX, newY, x, y));
            }
          }
        }
      }
    }
    return coordinates;
  }

  checkWin(wounded: number) {
    if (wounded === 20) {
      return true;
    } else {
      return false;
    }
  }
}
